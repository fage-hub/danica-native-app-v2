import { NextRequest, NextResponse } from "next/server"
import crypto from "node:crypto"
import { and, eq, lte } from "drizzle-orm"
import { db } from "@/lib/db"
import { subscriptions, subscriptionRenewals } from "@/lib/db/schema"
import { paymongo, PayMongoError } from "@/lib/paymongo/client"

export const runtime = "nodejs"
export const maxDuration = 60

function timingSafeBearer(received: string | null, secret: string | undefined): boolean {
  if (!secret || !received) return false
  const expected = `Bearer ${secret}`
  const a = Buffer.from(received)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization")
  if (!timingSafeBearer(auth, process.env.CRON_SECRET)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const now = new Date()
  const due = await db.query.subscriptions.findMany({
    where: and(eq(subscriptions.status, "active"), lte(subscriptions.nextChargeAt, now)),
    limit: 200,
  })

  const results: Array<Record<string, unknown>> = []

  for (const sub of due) {
    if (!sub.paymongoPaymentMethodId) {
      results.push({ id: sub.id, skipped: "no_payment_method" })
      continue
    }

    // Idempotency: if we already logged a successful renewal for this period,
    // skip — handles the case where charge succeeded but the subscription row
    // update failed and cron picks the row up again.
    const periodKey = `${sub.id}:${sub.nextChargeAt.toISOString()}`
    const alreadyRenewed = await db.query.subscriptionRenewals.findFirst({
      where: and(
        eq(subscriptionRenewals.subscriptionId, sub.id),
        eq(subscriptionRenewals.status, "success"),
      ),
      orderBy: (r, { desc }) => [desc(r.attemptedAt)],
    })
    if (alreadyRenewed && alreadyRenewed.attemptedAt > new Date(sub.nextChargeAt.getTime() - 60_000)) {
      // we have a success record newer than this period start — heal the row
      await db
        .update(subscriptions)
        .set({
          lastChargedAt: alreadyRenewed.attemptedAt,
          nextChargeAt: nextChargeDate(alreadyRenewed.attemptedAt, sub.billingInterval as Interval),
          failureCount: 0,
        })
        .where(eq(subscriptions.id, sub.id))
      results.push({ id: sub.id, healed: true, periodKey })
      continue
    }

    try {
      const intent = await paymongo.createPaymentIntent({
        amount: sub.amount,
        currency: sub.currency,
        paymentMethodAllowed: ["card"],
        description: `Subscription ${sub.id} renewal`,
        metadata: { subscriptionId: sub.id, isRenewal: "true", periodKey },
      })
      const attached = await paymongo.attachPaymentIntent(intent.id, {
        paymentMethodId: sub.paymongoPaymentMethodId,
        returnUrl: `${process.env.APP_URL ?? ""}/portal/dashboard/billing`,
      })
      const status = attached.attributes.status
      const success = status === "succeeded"

      // Single transaction: log renewal + advance subscription state atomically.
      await db.transaction(async (tx) => {
        await tx.insert(subscriptionRenewals).values({
          subscriptionId: sub.id,
          status: success ? "success" : "failed",
          amount: sub.amount,
          paymongoPaymentIntentId: intent.id,
          failureReason: success ? null : `intent_status:${status}`,
        })

        if (success) {
          await tx
            .update(subscriptions)
            .set({
              lastChargedAt: now,
              nextChargeAt: nextChargeDate(now, sub.billingInterval as Interval),
              failureCount: 0,
            })
            .where(eq(subscriptions.id, sub.id))
        } else {
          const newCount = sub.failureCount + 1
          await tx
            .update(subscriptions)
            .set({
              failureCount: newCount,
              status: newCount >= 3 ? "past_due" : "active",
              nextChargeAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
            })
            .where(eq(subscriptions.id, sub.id))
        }
      })

      results.push(success ? { id: sub.id, ok: true } : { id: sub.id, ok: false, status })
    } catch (err) {
      const msg = err instanceof PayMongoError ? err.message : String(err)
      await db.transaction(async (tx) => {
        await tx.insert(subscriptionRenewals).values({
          subscriptionId: sub.id,
          status: "failed",
          amount: sub.amount,
          failureReason: msg.slice(0, 500),
        })
        const newCount = sub.failureCount + 1
        await tx
          .update(subscriptions)
          .set({
            failureCount: newCount,
            status: newCount >= 3 ? "past_due" : "active",
            nextChargeAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
          })
          .where(eq(subscriptions.id, sub.id))
      })
      results.push({ id: sub.id, ok: false, error: msg })
    }
  }

  return NextResponse.json({ processed: results.length, results, scannedAt: now.toISOString() })
}

type Interval = "monthly" | "quarterly" | "yearly"

function nextChargeDate(from: Date, interval: Interval): Date {
  const d = new Date(from)
  if (interval === "monthly") d.setMonth(d.getMonth() + 1)
  else if (interval === "quarterly") d.setMonth(d.getMonth() + 3)
  else d.setFullYear(d.getFullYear() + 1)
  return d
}
