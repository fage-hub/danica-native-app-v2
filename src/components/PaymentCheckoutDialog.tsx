"use client"

/**
 * Stub: original Spark PaymentCheckoutDialog took card numbers in the
 * browser via a fake gateway. We now redirect to PayMongo's hosted
 * Checkout Sessions page (PCI compliant).
 *
 * This component preserves the props shape so existing call sites compile,
 * but on `open` it triggers `/api/paymongo/checkout` and navigates to
 * PayMongo immediately — no in-app form.
 */

import { useEffect } from "react"
import { toast } from "sonner"
import type { PaymentItem } from "@/lib/payment-gateway"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: PaymentItem[]
  onSuccess?: () => void
  enableSubscription?: boolean
}

export function PaymentCheckoutDialog({ open, onOpenChange, items, enableSubscription = false }: Props) {
  useEffect(() => {
    if (!open || items.length === 0) return
    const isSubscription = enableSubscription && items.length === 1 && items[0].type === "token"
    fetch("/api/paymongo/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map(i => ({ productId: i.id, quantity: i.quantity })),
        isSubscription,
        billingInterval: isSubscription ? "monthly" : undefined,
      }),
    })
      .then(async r => {
        if (!r.ok) {
          const err = await r.json().catch(() => ({}))
          if (err.error === "unauthorized") {
            toast.error("Please sign in first", { description: "Open the Portal tab to sign in or create an account." })
          } else {
            toast.error("Checkout failed", { description: err.detail || "Please try again." })
          }
          onOpenChange(false)
          return
        }
        const { checkoutUrl } = await r.json()
        window.location.href = checkoutUrl
      })
      .catch(() => {
        toast.error("Network error")
        onOpenChange(false)
      })
  }, [open, items, enableSubscription, onOpenChange])

  return null
}
