import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { eq, inArray } from "drizzle-orm"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { products, orders, orderItems } from "@/lib/db/schema"
import { paymongo, PAYMENT_METHODS_ALL, PayMongoError } from "@/lib/paymongo/client"

export const runtime = "nodejs"

const schema = z.object({
  items: z.array(z.object({
    productId: z.string().min(1),
    quantity: z.number().int().min(1).max(100),
  })).min(1).max(20),
  isSubscription: z.boolean().default(false),
  billingInterval: z.enum(["monthly", "quarterly", "yearly"]).optional(),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const { items, isSubscription, billingInterval } = parsed.data

  if (isSubscription && items.length !== 1) {
    return NextResponse.json({ error: "subscription_must_be_single_item" }, { status: 400 })
  }

  const productIds = items.map(i => i.productId)
  const dbProducts = await db.query.products.findMany({ where: inArray(products.id, productIds) })
  const productMap = new Map(dbProducts.map(p => [p.id, p]))
  if (productMap.size !== productIds.length) {
    return NextResponse.json({ error: "product_not_found" }, { status: 400 })
  }

  const currency = dbProducts[0].currency
  if (!dbProducts.every(p => p.currency === currency)) {
    return NextResponse.json({ error: "mixed_currencies_not_allowed" }, { status: 400 })
  }

  let total = 0
  const lineItems = items.map(it => {
    const p = productMap.get(it.productId)!
    total += p.basePrice * it.quantity
    return {
      name: p.name,
      amount: p.basePrice,
      currency: p.currency,
      quantity: it.quantity,
      description: p.description ?? undefined,
    }
  })

  const interval = isSubscription ? (billingInterval ?? "monthly") : null

  const [order] = await db.insert(orders).values({
    userId: session.user.id,
    total,
    currency,
    status: "pending",
    metadata: isSubscription ? {
      subscription: true,
      billingInterval: interval,
      productId: items[0].productId,
      quantity: items[0].quantity,
    } : {},
  }).returning()

  await db.insert(orderItems).values(items.map(it => ({
    orderId: order.id,
    productId: it.productId,
    quantity: it.quantity,
    unitPrice: productMap.get(it.productId)!.basePrice,
  })))

  const appUrl = process.env.APP_URL ?? new URL(req.url).origin
  try {
    const checkout = await paymongo.createCheckoutSession({
      lineItems,
      paymentMethodTypes: [...PAYMENT_METHODS_ALL],
      successUrl: `${appUrl}/portal/dashboard/billing?order=${order.id}&status=success`,
      cancelUrl: `${appUrl}/portal/dashboard/billing?order=${order.id}&status=cancelled`,
      customerEmail: session.user.email,
      referenceNumber: order.id,
      description: isSubscription ? `${interval} subscription` : "Danica purchase",
      metadata: {
        orderId: order.id,
        userId: session.user.id,
        ...(isSubscription ? { subscription: "true", billingInterval: interval! } : {}),
      },
    })

    await db.update(orders).set({
      paymongoCheckoutSessionId: checkout.id,
    }).where(eq(orders.id, order.id))

    return NextResponse.json({
      checkoutUrl: checkout.attributes.checkout_url,
      orderId: order.id,
      sessionId: checkout.id,
    })
  } catch (err) {
    if (err instanceof PayMongoError) {
      console.error("paymongo checkout failed:", err.errors)
      return NextResponse.json({ error: "paymongo_failed", detail: err.message }, { status: 502 })
    }
    throw err
  }
}
