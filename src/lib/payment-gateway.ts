/**
 * Compatibility shim. Original Spark exported a fake `paymentGateway`
 * singleton that pretended to charge cards client-side. The real flow now
 * lives in /api/paymongo/checkout (PayMongo hosted Checkout Sessions).
 *
 * Only the type names are kept here so legacy components compile. If a
 * legacy method is invoked it falls back to redirecting via the API.
 */

export type PaymentMethod = "stripe" | "paypal" | "alipay" | "wechat" | "card" | "gcash" | "paymaya" | "grab_pay"
export type PaymentStatus = "pending" | "processing" | "completed" | "failed" | "refunded"

export type PaymentItem = {
  id: string
  name: string
  price: number
  quantity: number
  type: "token" | "bundle" | "service"
}

export type PaymentSession = {
  id: string
  items: PaymentItem[]
  total: number
  currency: string
  method: PaymentMethod
  status: PaymentStatus
  createdAt: Date
  completedAt?: Date
  metadata?: Record<string, unknown>
}

async function startCheckout(items: PaymentItem[], isSubscription: boolean): Promise<{ ok: boolean; url?: string; error?: string }> {
  if (typeof window === "undefined") return { ok: false, error: "client_only" }
  const res = await fetch("/api/paymongo/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items: items.map(i => ({ productId: i.id, quantity: i.quantity })),
      isSubscription,
      billingInterval: isSubscription ? "monthly" : undefined,
    }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    return { ok: false, error: err.detail || err.error || `HTTP ${res.status}` }
  }
  const { checkoutUrl } = await res.json()
  return { ok: true, url: checkoutUrl }
}

export const paymentGateway = {
  async createPaymentSession() {
    throw new Error("createPaymentSession is deprecated. Use the /api/paymongo/checkout endpoint.")
  },
  async processPayment() {
    throw new Error("processPayment is deprecated. Hosted Checkout flow.")
  },
  async getPurchaseHistory(): Promise<unknown[]> {
    if (typeof window === "undefined") return []
    const r = await fetch("/api/me/orders").catch(() => null)
    if (!r?.ok) return []
    const data = await r.json()
    return data.items ?? []
  },
  async getTokenBalance(): Promise<number> {
    if (typeof window === "undefined") return 0
    const r = await fetch("/api/me/overview").catch(() => null)
    if (!r?.ok) return 0
    const data = await r.json()
    return data.user?.tokenBalance ?? 0
  },
  async getActiveBundles(): Promise<string[]> {
    return []
  },
  async getActiveServices(): Promise<string[]> {
    return []
  },
  getSupportedMethods(): PaymentMethod[] {
    return ["card", "gcash", "paymaya", "grab_pay"]
  },
  startCheckout,
}
