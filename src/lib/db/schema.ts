import { pgTable, text, timestamp, integer, varchar, boolean, jsonb, primaryKey, index, uniqueIndex } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

const id = () => text("id").primaryKey().$defaultFn(() => crypto.randomUUID())

export const users = pgTable("users", {
  id: id(),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  name: varchar("name", { length: 255 }),
  image: text("image"),
  passwordHash: text("password_hash"),
  company: varchar("company", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  paymongoCustomerId: text("paymongo_customer_id"),
  tokenBalance: integer("token_balance").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (t) => ({
  // Functional unique index on lower(email) → enforces case-insensitive
  // uniqueness at the DB level. Removes the prior `.unique()` whose constraint
  // would let "Foo@Bar.com" + "foo@bar.com" both insert.
  emailLowerIdx: uniqueIndex("users_email_lower_idx").on(sql`lower(${t.email})`),
}))

export const accounts = pgTable("accounts", {
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 50 }).notNull(),
  provider: varchar("provider", { length: 50 }).notNull(),
  providerAccountId: varchar("provider_account_id", { length: 255 }).notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: varchar("token_type", { length: 50 }),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
}, (t) => ({
  pk: primaryKey({ columns: [t.provider, t.providerAccountId] }),
}))

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.identifier, t.token] }),
}))

export const products = pgTable("products", {
  id: id(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  type: varchar("type", { length: 20 }).notNull(),
  basePrice: integer("base_price").notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default("PHP"),
  tokenAmount: integer("token_amount"),
  features: jsonb("features").$type<string[]>().default(sql`'[]'::jsonb`),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const subscriptions = pgTable("subscriptions", {
  id: id(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  productId: text("product_id").notNull().references(() => products.id),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  billingInterval: varchar("billing_interval", { length: 20 }).notNull(),
  amount: integer("amount").notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default("PHP"),
  paymongoCustomerId: text("paymongo_customer_id"),
  paymongoPaymentMethodId: text("paymongo_payment_method_id"),
  cardLast4: varchar("card_last_4", { length: 4 }),
  cardBrand: varchar("card_brand", { length: 20 }),
  nextChargeAt: timestamp("next_charge_at").notNull(),
  lastChargedAt: timestamp("last_charged_at"),
  failureCount: integer("failure_count").notNull().default(0),
  cancelledAt: timestamp("cancelled_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => ({
  userIdx: index("sub_user_idx").on(t.userId),
  nextChargeIdx: index("sub_next_charge_idx").on(t.nextChargeAt),
  // Partial unique: a user can only have ONE active sub per product.
  // Cancelled / past_due rows can repeat (audit history).
  activePerProductUniqueIdx: uniqueIndex("sub_active_per_product_uniq")
    .on(t.userId, t.productId)
    .where(sql`${t.status} = 'active'`),
}))

export const orders = pgTable("orders", {
  id: id(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "restrict" }),
  total: integer("total").notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default("PHP"),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  paymongoCheckoutSessionId: text("paymongo_checkout_session_id").unique(),
  paymongoPaymentIntentId: text("paymongo_payment_intent_id"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default(sql`'{}'::jsonb`),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  paidAt: timestamp("paid_at"),
}, (t) => ({
  userIdx: index("order_user_idx").on(t.userId),
  intentIdx: index("order_intent_idx").on(t.paymongoPaymentIntentId),
  statusCreatedIdx: index("order_status_created_idx").on(t.status, t.createdAt),
}))

export const orderItems = pgTable("order_items", {
  id: id(),
  orderId: text("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: text("product_id").notNull().references(() => products.id),
  quantity: integer("quantity").notNull().default(1),
  unitPrice: integer("unit_price").notNull(),
})

export const subscriptionRenewals = pgTable("subscription_renewals", {
  id: id(),
  subscriptionId: text("subscription_id").notNull().references(() => subscriptions.id, { onDelete: "cascade" }),
  status: varchar("status", { length: 20 }).notNull(),
  amount: integer("amount").notNull(),
  paymongoPaymentIntentId: text("paymongo_payment_intent_id"),
  failureReason: text("failure_reason"),
  attemptedAt: timestamp("attempted_at").notNull().defaultNow(),
}, (t) => ({
  subIdx: index("renewal_sub_idx").on(t.subscriptionId),
  attemptedIdx: index("renewal_attempted_idx").on(t.attemptedAt),
}))

export const usageEvents = pgTable("usage_events", {
  id: id(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  productId: text("product_id").references(() => products.id),
  tokensUsed: integer("tokens_used").notNull().default(0),
  endpoint: varchar("endpoint", { length: 100 }),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default(sql`'{}'::jsonb`),
  occurredAt: timestamp("occurred_at").notNull().defaultNow(),
}, (t) => ({
  userIdx: index("usage_user_idx").on(t.userId),
  occurredIdx: index("usage_occurred_idx").on(t.occurredAt),
}))

export const tickets = pgTable("tickets", {
  id: id(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  subject: varchar("subject", { length: 500 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("open"),
  priority: varchar("priority", { length: 10 }).notNull().default("medium"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const ticketMessages = pgTable("ticket_messages", {
  id: id(),
  ticketId: text("ticket_id").notNull().references(() => tickets.id, { onDelete: "cascade" }),
  sender: varchar("sender", { length: 50 }).notNull(),
  body: text("body").notNull(),
  isSupport: boolean("is_support").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const apiKeys = pgTable("api_keys", {
  id: id(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  label: varchar("label", { length: 100 }).notNull(),
  keyPrefix: varchar("key_prefix", { length: 12 }).notNull().unique(),
  keyHash: text("key_hash").notNull(),
  lastUsedAt: timestamp("last_used_at"),
  revokedAt: timestamp("revoked_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const webhookEvents = pgTable("webhook_events", {
  id: text("id").primaryKey(),
  type: varchar("type", { length: 100 }).notNull(),
  payload: jsonb("payload").notNull(),
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => ({
  processedIdx: index("we_processed_idx").on(t.processedAt),
  typeIdx: index("we_type_idx").on(t.type),
  createdIdx: index("we_created_idx").on(t.createdAt),
}))

// =============================================================================
// Contact form submissions (replaces fake setTimeout(1500) submissions)
// =============================================================================
export const contactSubmissions = pgTable("contact_submissions", {
  id: id(),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  interest: varchar("interest", { length: 100 }),
  message: text("message").notNull(),
  ipHash: varchar("ip_hash", { length: 64 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => ({
  emailIdx: index("contact_email_idx").on(t.email),
  createdIdx: index("contact_created_idx").on(t.createdAt),
}))

// =============================================================================
// Rate limit buckets (token-bucket-ish counter)
// =============================================================================
export const rateLimitBuckets = pgTable("rate_limit_buckets", {
  // Composite key: <bucket-name>:<identifier-hash>
  key: varchar("key", { length: 200 }).primaryKey(),
  count: integer("count").notNull().default(0),
  windowStart: timestamp("window_start").notNull().defaultNow(),
})
