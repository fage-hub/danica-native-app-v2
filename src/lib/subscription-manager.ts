/**
 * Compatibility shim for legacy Spark `subscriptionManager`. Real subscription
 * lifecycle is server-side: created via webhook in /api/paymongo/webhook,
 * renewed daily by /api/cron/renewals, queried via /api/me/subscriptions.
 */

export type SubscriptionStatus = "active" | "cancelled" | "expired" | "paused" | "past_due"
export type BillingInterval = "monthly" | "quarterly" | "yearly"

export type Subscription = {
  id: string
  packageId: string
  packageName: string
  packageType: "token" | "bundle" | "service"
  tokenAmount: number
  price: number
  billingInterval: BillingInterval
  status: SubscriptionStatus
  createdAt: Date
  renewsAt: Date
  lastRenewalAt?: Date
  cancelledAt?: Date
  autoRenew: boolean
  paymentMethod: string
  paymentDetails: { cardLast4?: string; email?: string }
  totalRenewals: number
  nextChargeDate: Date
}

export type SubscriptionHistory = {
  subscriptionId: string
  renewalDate: Date
  amount: number
  tokensAdded: number
  status: "success" | "failed"
  failureReason?: string
}

export const subscriptionManager = {
  async getSubscriptions(): Promise<Subscription[]> {
    if (typeof window === "undefined") return []
    const r = await fetch("/api/me/subscriptions").catch(() => null)
    if (!r?.ok) return []
    const { items } = await r.json()
    return (items ?? []).map((s: Record<string, unknown>) => ({
      id: s.id as string,
      packageId: s.productId as string,
      packageName: (s.productName as string) ?? "",
      packageType: "service" as const,
      tokenAmount: 0,
      price: s.amount as number,
      billingInterval: s.billingInterval as BillingInterval,
      status: s.status as SubscriptionStatus,
      createdAt: new Date(s.createdAt as string),
      renewsAt: new Date(s.nextChargeAt as string),
      lastRenewalAt: s.lastChargedAt ? new Date(s.lastChargedAt as string) : undefined,
      autoRenew: s.status === "active",
      paymentMethod: "card",
      paymentDetails: { cardLast4: (s.cardLast4 as string) ?? undefined },
      totalRenewals: 0,
      nextChargeDate: new Date(s.nextChargeAt as string),
    }))
  },
  async cancelSubscription(id: string): Promise<{ success: boolean; error?: string }> {
    if (typeof window === "undefined") return { success: false, error: "client_only" }
    const r = await fetch(`/api/subscriptions/${id}/cancel`, { method: "POST" })
    if (!r.ok) return { success: false, error: `HTTP ${r.status}` }
    return { success: true }
  },
  async pauseSubscription() {
    return { success: false, error: "Pause flow not yet implemented in this iteration." }
  },
  async resumeSubscription() {
    return { success: false, error: "Resume flow not yet implemented in this iteration." }
  },
  async getRenewalHistory(): Promise<SubscriptionHistory[]> {
    return []
  },
  async getActiveSubscriptionsCount(): Promise<number> {
    const subs = await this.getSubscriptions()
    return subs.filter(s => s.status === "active").length
  },
  async getTotalSubscriptionValue(): Promise<number> {
    const subs = await this.getSubscriptions()
    return subs.filter(s => s.status === "active").reduce((sum, s) => sum + s.price, 0)
  },
  async getUpcomingRenewals(days: number = 7): Promise<Subscription[]> {
    const subs = await this.getSubscriptions()
    const now = Date.now()
    const window = days * 24 * 60 * 60 * 1000
    return subs.filter(s => s.status === "active" && s.nextChargeDate.getTime() - now <= window)
  },
  async updateSubscriptionPaymentMethod() {
    return { success: false, error: "Update via Vercel dashboard for now." }
  },
}
