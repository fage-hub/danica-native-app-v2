import { and, desc, eq, gte, sql } from "drizzle-orm"
import { db } from "./db"
import { subscriptions, orders, usageEvents, products, users } from "./db/schema"

export async function getUserOverview(userId: string) {
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1)

  const activeSubs = await db.select({
    id: subscriptions.id,
    productId: subscriptions.productId,
    productName: products.name,
    amount: subscriptions.amount,
    currency: subscriptions.currency,
    billingInterval: subscriptions.billingInterval,
    nextChargeAt: subscriptions.nextChargeAt,
    cardLast4: subscriptions.cardLast4,
    cardBrand: subscriptions.cardBrand,
    status: subscriptions.status,
  })
    .from(subscriptions)
    .leftJoin(products, eq(subscriptions.productId, products.id))
    .where(and(eq(subscriptions.userId, userId), eq(subscriptions.status, "active")))
    .orderBy(subscriptions.nextChargeAt)

  const monthAgo = new Date()
  monthAgo.setDate(monthAgo.getDate() - 30)

  const usageRow = await db.select({
    total: sql<number>`coalesce(sum(${usageEvents.tokensUsed}), 0)`.as("total"),
  })
    .from(usageEvents)
    .where(and(eq(usageEvents.userId, userId), gte(usageEvents.occurredAt, monthAgo)))

  const recentOrders = await db.select({
    id: orders.id,
    total: orders.total,
    currency: orders.currency,
    status: orders.status,
    paidAt: orders.paidAt,
    createdAt: orders.createdAt,
  })
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt))
    .limit(5)

  return {
    user,
    activeSubs,
    usageLast30d: Number(usageRow[0]?.total ?? 0),
    recentOrders,
  }
}

export async function getDailyUsage(userId: string, days: number = 30) {
  const since = new Date()
  since.setDate(since.getDate() - days)
  const rows = await db.select({
    day: sql<string>`to_char(${usageEvents.occurredAt}, 'YYYY-MM-DD')`.as("day"),
    productId: usageEvents.productId,
    tokens: sql<number>`coalesce(sum(${usageEvents.tokensUsed}), 0)`.as("tokens"),
  })
    .from(usageEvents)
    .where(and(eq(usageEvents.userId, userId), gte(usageEvents.occurredAt, since)))
    .groupBy(sql`to_char(${usageEvents.occurredAt}, 'YYYY-MM-DD')`, usageEvents.productId)
    .orderBy(sql`to_char(${usageEvents.occurredAt}, 'YYYY-MM-DD')`)
  return rows
}

export async function getActiveProducts() {
  return db.query.products.findMany({
    where: eq(products.active, true),
    orderBy: products.basePrice,
  })
}

export async function getUserSubscriptions(userId: string) {
  return db.select({
    id: subscriptions.id,
    status: subscriptions.status,
    productId: subscriptions.productId,
    productName: products.name,
    productSlug: products.slug,
    productDescription: products.description,
    amount: subscriptions.amount,
    currency: subscriptions.currency,
    billingInterval: subscriptions.billingInterval,
    nextChargeAt: subscriptions.nextChargeAt,
    lastChargedAt: subscriptions.lastChargedAt,
    cardLast4: subscriptions.cardLast4,
    cardBrand: subscriptions.cardBrand,
    failureCount: subscriptions.failureCount,
    createdAt: subscriptions.createdAt,
  })
    .from(subscriptions)
    .leftJoin(products, eq(subscriptions.productId, products.id))
    .where(eq(subscriptions.userId, userId))
    .orderBy(desc(subscriptions.createdAt))
}

export async function getUserOrders(userId: string) {
  return db.select({
    id: orders.id,
    total: orders.total,
    currency: orders.currency,
    status: orders.status,
    paidAt: orders.paidAt,
    createdAt: orders.createdAt,
  })
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt))
    .limit(50)
}
