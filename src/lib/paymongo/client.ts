/**
 * PayMongo REST client. All amounts are in centavos (smallest currency unit).
 * 100 PHP = 10000.
 *
 * Auth: HTTP Basic, secret_key as username, empty password.
 * Docs: https://developers.paymongo.com/reference/
 */

const PAYMONGO_BASE = "https://api.paymongo.com/v1"

export class PayMongoError extends Error {
  constructor(public status: number, public errors: PayMongoApiError[], public raw: unknown) {
    super(errors.map(e => e.detail).join("; ") || `PayMongo HTTP ${status}`)
    this.name = "PayMongoError"
  }
}

export type PayMongoApiError = {
  code: string
  detail: string
  source?: { pointer: string; attribute: string }
}

type PayMongoResource<TAttrs> = {
  id: string
  type: string
  attributes: TAttrs
}

async function paymongoFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const secret = process.env.PAYMONGO_SECRET_KEY
  if (!secret) throw new Error("PAYMONGO_SECRET_KEY is not set")

  const auth = Buffer.from(`${secret}:`).toString("base64")
  const res = await fetch(`${PAYMONGO_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init?.headers || {}),
    },
  })

  const json = (await res.json().catch(() => ({}))) as { data?: T; errors?: PayMongoApiError[] }

  if (!res.ok) {
    throw new PayMongoError(res.status, json.errors || [], json)
  }
  if (json.data === undefined) {
    throw new PayMongoError(res.status, [{ code: "no_data", detail: "PayMongo returned no data" }], json)
  }
  return json.data
}

export const PAYMENT_METHODS_ALL = [
  "card",
  "gcash",
  "paymaya",
  "grab_pay",
  "qrph",
  "billease",
  "dob",
] as const

export type PaymentMethodType = typeof PAYMENT_METHODS_ALL[number]

export type CheckoutLineItem = {
  name: string
  amount: number
  currency: string
  quantity: number
  description?: string
  images?: string[]
}

export type CheckoutSessionAttrs = {
  checkout_url: string
  client_key: string
  status: "active" | "expired" | "paid"
  payment_intent: PayMongoResource<PaymentIntentAttrs> | null
  payments: PayMongoResource<PaymentAttrs>[]
  reference_number: string
  metadata: Record<string, string> | null
  line_items: CheckoutLineItem[]
  customer_email: string | null
}

export type PaymentIntentAttrs = {
  amount: number
  currency: string
  status: "awaiting_payment_method" | "awaiting_next_action" | "processing" | "succeeded" | "cancelled"
  client_key: string
  payments: PayMongoResource<PaymentAttrs>[]
  next_action: { type: string; redirect: { url: string } } | null
  payment_method_allowed: string[]
  payment_method_options: Record<string, unknown>
  description: string | null
  statement_descriptor: string | null
  metadata: Record<string, string> | null
  last_payment_error: { code: string; detail: string } | null
}

export type PaymentAttrs = {
  amount: number
  currency: string
  status: "paid" | "failed" | "refunded"
  source: { id: string; type: string }
  description: string | null
  fee: number
  net_amount: number
  paid_at: number | null
  payment_intent_id: string | null
  payout: unknown
  taxes: unknown[]
  refunds: unknown[]
}

export type CustomerAttrs = {
  first_name: string
  last_name: string
  phone: string | null
  email: string
  default_device: string | null
  default_payment_method_id: string | null
}

export type PaymentMethodAttrs = {
  type: string
  details: { card_number?: string; last4?: string; exp_month?: number; exp_year?: number; brand?: string } | null
  billing: { name?: string; email?: string; phone?: string; address?: Record<string, string> } | null
  metadata: Record<string, string> | null
}

export const paymongo = {
  async createCheckoutSession(params: {
    lineItems: CheckoutLineItem[]
    paymentMethodTypes: PaymentMethodType[]
    successUrl: string
    cancelUrl: string
    customerEmail?: string
    referenceNumber?: string
    description?: string
    metadata?: Record<string, string>
    sendEmailReceipt?: boolean
  }): Promise<PayMongoResource<CheckoutSessionAttrs>> {
    return paymongoFetch("/checkout_sessions", {
      method: "POST",
      body: JSON.stringify({
        data: {
          attributes: {
            line_items: params.lineItems,
            payment_method_types: params.paymentMethodTypes,
            success_url: params.successUrl,
            cancel_url: params.cancelUrl,
            customer_email: params.customerEmail,
            reference_number: params.referenceNumber,
            description: params.description,
            metadata: params.metadata,
            send_email_receipt: params.sendEmailReceipt ?? true,
            show_description: true,
            show_line_items: true,
          },
        },
      }),
    })
  },

  async retrieveCheckoutSession(sessionId: string): Promise<PayMongoResource<CheckoutSessionAttrs>> {
    return paymongoFetch(`/checkout_sessions/${sessionId}`)
  },

  async expireCheckoutSession(sessionId: string): Promise<PayMongoResource<CheckoutSessionAttrs>> {
    return paymongoFetch(`/checkout_sessions/${sessionId}/expire`, { method: "POST" })
  },

  async retrievePaymentIntent(intentId: string): Promise<PayMongoResource<PaymentIntentAttrs>> {
    return paymongoFetch(`/payment_intents/${intentId}`)
  },

  async createPaymentIntent(params: {
    amount: number
    currency: string
    paymentMethodAllowed: string[]
    description?: string
    statementDescriptor?: string
    metadata?: Record<string, string>
  }): Promise<PayMongoResource<PaymentIntentAttrs>> {
    return paymongoFetch("/payment_intents", {
      method: "POST",
      body: JSON.stringify({
        data: {
          attributes: {
            amount: params.amount,
            currency: params.currency,
            payment_method_allowed: params.paymentMethodAllowed,
            payment_method_options: { card: { request_three_d_secure: "any" } },
            description: params.description,
            statement_descriptor: params.statementDescriptor,
            metadata: params.metadata,
          },
        },
      }),
    })
  },

  async attachPaymentIntent(intentId: string, params: {
    paymentMethodId: string
    returnUrl?: string
    clientKey?: string
  }): Promise<PayMongoResource<PaymentIntentAttrs>> {
    return paymongoFetch(`/payment_intents/${intentId}/attach`, {
      method: "POST",
      body: JSON.stringify({
        data: {
          attributes: {
            payment_method: params.paymentMethodId,
            return_url: params.returnUrl,
            client_key: params.clientKey,
          },
        },
      }),
    })
  },

  async createCustomer(params: {
    firstName: string
    lastName: string
    email: string
    phone?: string
    defaultDevice?: "email" | "phone"
  }): Promise<PayMongoResource<CustomerAttrs>> {
    return paymongoFetch("/customers", {
      method: "POST",
      body: JSON.stringify({
        data: {
          attributes: {
            first_name: params.firstName,
            last_name: params.lastName,
            email: params.email,
            phone: params.phone,
            default_device: params.defaultDevice ?? "email",
          },
        },
      }),
    })
  },

  async retrievePaymentMethod(pmId: string): Promise<PayMongoResource<PaymentMethodAttrs>> {
    return paymongoFetch(`/payment_methods/${pmId}`)
  },

  async refundPayment(params: {
    paymentId: string
    amount: number
    reason: "duplicate" | "fraudulent" | "requested_by_customer" | "others"
    notes?: string
  }): Promise<PayMongoResource<unknown>> {
    return paymongoFetch("/refunds", {
      method: "POST",
      body: JSON.stringify({
        data: {
          attributes: {
            amount: params.amount,
            payment_id: params.paymentId,
            reason: params.reason,
            notes: params.notes,
          },
        },
      }),
    })
  },
}
