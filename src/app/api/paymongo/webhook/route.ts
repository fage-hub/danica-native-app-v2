import { NextRequest, NextResponse } from "next/server"
import { and, eq, sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { webhookEvents, orders, subscriptions, users } from "@/lib/db/schema"
import { paymongo } from "@/lib/paymongo/client"
import { verifyPayMongoSignature } from "@/lib/paymongo/webhook"
import { splitNameForPayMongo } from "@/lib/paymongo/customer-name"

export const runtime = "nodejs"

type WebhookPayload = {
  data: {
    id: string
    attributes: {
      type: string
      data: { id: string; attributes: Record<string, unknown> }
    }
  }
}

const MAX_BODY_BYTES = 64 * 1024 // 64 KB — way more than PayMongo ever sends; rejects DoS-y payloads cheaply

export async function POST(req: NextRequest) {
  // body-size cap before any other work — protects HMAC + DB from bulk garbage
  const declaredLen = parseInt(req.headers.get("content-length") ?? "0", 10)
  if (declaredLen > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "payload_too_large" }, { status: 413 })
  }

  const rawBody = await req.text()
  if (rawBody.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "payload_too_large" }, { status: 413 })
  }

  const signature = req.headers.get("paymongo-signature")
  const secret = process.env.PAYMONGO_WEBHOOK_SECRET ?? ""

  const verify = verifyPayMongoSignature(rawBody, signature, secret)
  if (!verify.ok) {
    console.warn("[paymongo webhook] rejected:", verify.reason)
    return NextResponse.json({ error: verify.reason }, { status: 401 })
  }

  let body: WebhookPayload
  try {
    body = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 })
  }

  const eventId = body.data?.id
  const eventType = body.data?.attributes?.type
  if (!eventId || !eventType) {
    return NextResponse.json({ error: "malformed_event" }, { status: 400 })
  }

  // Atomic claim: insert with ON CONFLICT DO NOTHING and check whether
  // we actually inserted (xmax = 0 on the new row, non-zero on conflict).
  // Only the inserter proceeds; concurrent retries fall through to the
  // idempotency response below.
  const [claimed] = await db
    .insert(webhookEvents)
    .values({ id: eventId, type: eventType, payload: body })
    .onConflictDoNothing()
    .returning({ id: webhookEvents.id })

  if (!claimed) {
    // Already claimed by a concurrent request — check whether it finished.
    const existing = await db.query.webhookEvents.findFirst({
      where: eq(webhookEvents.id, eventId),
    })
    if (existing?.processedAt) {
      return NextResponse.json({ received: true, idempotent: true })
    }
    // Another worker is in-flight; ask PayMongo to retry shortly.
    return NextResponse.json({ error: "in_flight" }, { status: 409 })
  }

  try {
    switch (eventType) {
      case "checkout_session.payment.paid":
        await handleCheckoutPaid(body.data.attributes.data.id)
        break
      case "payment.paid":
      case "payment.failed":
      case "source.chargeable":
        // logged for audit; downstream state lives on payment_intent / checkout_session
        break
      default:
        console.log("[paymongo webhook] unhandled:", eventType)
    }
    await db.update(webhookEvents).set({ processedAt: new Date() }).where(eq(webhookEvents.id, eventId))
    return NextResponse.json({ received: true })
  } catch (err) {
    console.error("[paymongo webhook] processing failed:", err)
    // Leave processedAt null so PayMongo retry reaches us; but clear the
    // claim so the retry can re-enter (rather than hitting "in_flight").
    await db.delete(webhookEvents).where(eq(webhookEvents.id, eventId))
    return NextResponse.json({ error: "processing_failed" }, { status: 500 })
  }
}

async function handleCheckoutPaid(checkoutSessionId: string) {
  const session = await paymongo.retrieveCheckoutSession(checkoutSessionId)

  // Only honour events where PayMongo's authoritative state confirms payment.
  if (session.attributes.status !== "paid") {
    console.warn(
      "[paymongo webhook] session in non-paid state, ignoring:",
      session.id,
      session.attributes.status,
    )
    return
  }
  const succeededPayment = session.attributes.payments?.find(
    (p) => p.attributes.status === "paid",
  )
  if (!succeededPayment) {
    console.warn("[paymongo webhook] session paid but no succeeded payment:", session.id)
    return
  }

  const order = await db.query.orders.findFirst({
    where: eq(orders.paymongoCheckoutSessionId, session.id),
  })
  if (!order) {
    console.warn("[paymongo webhook] checkout paid for unknown order:", session.id)
    return
  }

  const meta = (order.metadata ?? {}) as { subscription?: boolean; billingInterval?: string; productId?: string }
  const isSubscription = !!meta.subscription && !!meta.productId && !!meta.billingInterval

  // Look up payment-method details (best-effort) before we open the txn so we
  // don't hold a connection while waiting on PayMongo.
  const paymentIntentId = session.attributes.payment_intent?.id ?? null
  let pmId: string | null = null
  let last4: string | null = null
  let brand: string | null = null

  if (isSubscription) {
    const intent = paymentIntentId
      ? await paymongo.retrievePaymentIntent(paymentIntentId)
      : null
    const payment = intent?.attributes.payments?.find(
      (p) => p.attributes.status === "paid",
    )
    pmId = payment?.attributes.source.id ?? null
    if (pmId) {
      const pm = await paymongo.retrievePaymentMethod(pmId).catch(() => null)
      last4 = pm?.attributes.details?.last4 ?? null
      brand = pm?.attributes.details?.brand ?? null
    }
  }

  // Fetch user and (if needed) create PayMongo customer outside the txn — both
  // are network I/O and idempotent enough that retry is fine.
  const user = await db.query.users.findFirst({ where: eq(users.id, order.userId) })
  let customerId = user?.paymongoCustomerId ?? null
  if (isSubscription && !customerId && user) {
    const { firstName, lastName } = splitNameForPayMongo(user.name)
    const phoneE164 = user.phone?.replace(/\s+/g, "").slice(0, 13) || undefined
    try {
      const created = await paymongo.createCustomer({
        firstName,
        lastName,
        email: user.email,
        phone: phoneE164,
      })
      customerId = created.id
    } catch (err) {
      console.error("[paymongo webhook] createCustomer failed; continuing without customer link:", err)
    }
  }

  // Single transaction for all DB mutations.
  await db.transaction(async (tx) => {
    // Update order to paid (idempotent: only if still pending).
    await tx
      .update(orders)
      .set({
        status: "paid",
        paidAt: new Date(),
        paymongoPaymentIntentId: paymentIntentId,
      })
      .where(and(eq(orders.id, order.id), eq(orders.status, "pending")))

    if (customerId && user && !user.paymongoCustomerId) {
      await tx
        .update(users)
        .set({ paymongoCustomerId: customerId })
        .where(eq(users.id, user.id))
    }

    if (!isSubscription || !pmId) return

    // Don't double-create. Block if user already has an active sub for this
    // product (covers re-delivery + accidental double-purchase).
    const existing = await tx.query.subscriptions.findFirst({
      where: and(
        eq(subscriptions.userId, order.userId),
        eq(subscriptions.productId, meta.productId!),
        eq(subscriptions.status, "active"),
      ),
    })
    if (existing) {
      console.log("[paymongo webhook] active sub already exists, skipping:", existing.id)
      return
    }

    const interval = meta.billingInterval as "monthly" | "quarterly" | "yearly"
    await tx.insert(subscriptions).values({
      userId: order.userId,
      productId: meta.productId!,
      billingInterval: interval,
      amount: order.total,
      currency: order.currency,
      status: "active",
      paymongoCustomerId: customerId,
      paymongoPaymentMethodId: pmId,
      cardLast4: last4,
      cardBrand: brand,
      nextChargeAt: nextChargeDate(new Date(), interval),
      lastChargedAt: new Date(),
    })
  })
}

function nextChargeDate(from: Date, interval: "monthly" | "quarterly" | "yearly"): Date {
  const d = new Date(from)
  if (interval === "monthly") d.setMonth(d.getMonth() + 1)
  else if (interval === "quarterly") d.setMonth(d.getMonth() + 3)
  else d.setFullYear(d.getFullYear() + 1)
  return d
}
