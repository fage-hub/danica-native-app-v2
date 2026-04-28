import { NextRequest, NextResponse } from "next/server"
import { and, eq, lte } from "drizzle-orm"
import { db } from "@/lib/db"
import { subscriptions, subscriptionRenewals } from "@/lib/db/schema"
import { paymongo, PayMongoError } from "@/lib/paymongo/client"

export const runtime = "nodejs"
export const maxDuration = 60

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization")
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
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
    try {
      const intent = await paymongo.createPaymentIntent({
        amount: sub.amount,
        currency: sub.currency,
        paymentMethodAllowed: ["card"],
        description: `Subscription ${sub.id} renewal`,
        metadata: { subscriptionId: sub.id, userId: sub.userId, isRenewal: "true" },
      })
      const attached = await paymongo.attachPaymentIntent(intent.id, {
        paymentMethodId: sub.paymongoPaymentMethodId,
        returnUrl: `${process.env.APP_URL}/portal/dashboard/billing`,
      })
      const status = attached.attributes.status
      const success = status === "succeeded"

      await db.insert(subscriptionRenewals).values({
        subscriptionId: sub.id,
        status: success ? "success" : "failed",
        amount: sub.amount,
        paymongoPaymentIntentId: intent.id,
        failureReason: success ? null : `intent_status:${status}`,
      })

      if (success) {
        await db.update(subscriptions).set({
          lastChargedAt: now,
          nextChargeAt: nextChargeDate(now, sub.billingInterval as "monthly" | "quarterly" | "yearly"),
          failureCount: 0,
        }).where(eq(subscriptions.id, sub.id))
        results.push({ id: sub.id, ok: true })
      } else {
        const newCount = sub.failureCount + 1
        await db.update(subscriptions).set({
          failureCount: newCount,
          status: newCount >= 3 ? "past_due" : "active",
          // back off retry by 1 day
          nextChargeAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        }).where(eq(subscriptions.id, sub.id))
        results.push({ id: sub.id, ok: false, status })
      }
    } catch (err) {
      const msg = err instanceof PayMongoError ? err.message : String(err)
      await db.insert(subscriptionRenewals).values({
        subscriptionId: sub.id,
        status: "failed",
        amount: sub.amount,
        failureReason: msg.slice(0, 500),
      })
      const newCount = sub.failureCount + 1
      await db.update(subscriptions).set({
        failureCount: newCount,
        status: newCount >= 3 ? "past_due" : "active",
        nextChargeAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      }).where(eq(subscriptions.id, sub.id))
      results.push({ id: sub.id, ok: false, error: msg })
    }
  }

  return NextResponse.json({ processed: results.length, results, scannedAt: now.toISOString() })
}

function nextChargeDate(from: Date, interval: "monthly" | "quarterly" | "yearly"): Date {
  const d = new Date(from)
  if (interval === "monthly") d.setMonth(d.getMonth() + 1)
  else if (interval === "quarterly") d.setMonth(d.getMonth() + 3)
  else d.setFullYear(d.getFullYear() + 1)
  return d
}
