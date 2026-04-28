import { NextRequest, NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { webhookEvents, orders, subscriptions, users } from "@/lib/db/schema"
import { paymongo } from "@/lib/paymongo/client"
import { verifyPayMongoSignature } from "@/lib/paymongo/webhook"

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

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
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

  const eventId = body.data.id
  const eventType = body.data.attributes.type

  const existing = await db.query.webhookEvents.findFirst({ where: eq(webhookEvents.id, eventId) })
  if (existing?.processedAt) {
    return NextResponse.json({ received: true, idempotent: true })
  }

  await db.insert(webhookEvents)
    .values({ id: eventId, type: eventType, payload: body })
    .onConflictDoNothing()

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
    return NextResponse.json({ error: "processing_failed" }, { status: 500 })
  }
}

async function handleCheckoutPaid(checkoutSessionId: string) {
  const session = await paymongo.retrieveCheckoutSession(checkoutSessionId)
  const order = await db.query.orders.findFirst({
    where: eq(orders.paymongoCheckoutSessionId, session.id),
  })
  if (!order) {
    console.warn("[paymongo webhook] checkout paid for unknown order:", session.id)
    return
  }
  if (order.status === "paid") return

  const paymentIntentId = session.attributes.payment_intent?.id ?? null
  await db.update(orders).set({
    status: "paid",
    paidAt: new Date(),
    paymongoPaymentIntentId: paymentIntentId,
  }).where(eq(orders.id, order.id))

  const meta = (order.metadata ?? {}) as { subscription?: boolean; billingInterval?: string; productId?: string }
  if (!meta.subscription || !meta.productId || !meta.billingInterval) return

  const intent = paymentIntentId ? await paymongo.retrievePaymentIntent(paymentIntentId) : null
  const payment = intent?.attributes.payments?.[0]
  const pmId = payment?.attributes.source.id
  if (!pmId) {
    console.warn("[paymongo webhook] subscription paid but no payment_method id", session.id)
    return
  }

  const pm = await paymongo.retrievePaymentMethod(pmId).catch(() => null)
  const last4 = pm?.attributes.details?.last4 ?? null
  const brand = pm?.attributes.details?.brand ?? null

  const user = await db.query.users.findFirst({ where: eq(users.id, order.userId) })
  let customerId = user?.paymongoCustomerId ?? null
  if (!customerId && user) {
    const fullName = (user.name ?? "Danica User").trim()
    const [firstName, ...rest] = fullName.split(/\s+/)
    const created = await paymongo.createCustomer({
      firstName: firstName || "Danica",
      lastName: rest.join(" ") || "User",
      email: user.email,
      phone: user.phone ?? undefined,
    })
    customerId = created.id
    await db.update(users).set({ paymongoCustomerId: customerId }).where(eq(users.id, user.id))
  }

  const interval = meta.billingInterval as "monthly" | "quarterly" | "yearly"
  await db.insert(subscriptions).values({
    userId: order.userId,
    productId: meta.productId,
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
}

function nextChargeDate(from: Date, interval: "monthly" | "quarterly" | "yearly"): Date {
  const d = new Date(from)
  if (interval === "monthly") d.setMonth(d.getMonth() + 1)
  else if (interval === "quarterly") d.setMonth(d.getMonth() + 3)
  else d.setFullYear(d.getFullYear() + 1)
  return d
}
