"use client"

import { useTransition } from "react"
import { toast } from "sonner"

type Props = {
  productId: string
  isSubscription?: boolean
  billingInterval?: "monthly" | "quarterly" | "yearly"
  quantity?: number
  className?: string
  children?: React.ReactNode
}

export function CheckoutButton({ productId, isSubscription = false, billingInterval = "monthly", quantity = 1, className, children }: Props) {
  const [pending, startTransition] = useTransition()

  function start() {
    startTransition(async () => {
      const res = await fetch("/api/paymongo/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ productId, quantity }],
          isSubscription,
          billingInterval: isSubscription ? billingInterval : undefined,
        }),
      })
      if (!res.ok) {
        const { detail, error } = await res.json().catch(() => ({}))
        toast.error(typeof error === "string" ? error : "Checkout failed", {
          description: detail || "Please try again or contact support.",
        })
        return
      }
      const { checkoutUrl } = await res.json()
      window.location.href = checkoutUrl
    })
  }

  return (
    <button onClick={start} disabled={pending} className={className ?? "rounded-md bg-[var(--color-primary)] text-[var(--color-primary-foreground)] px-4 py-2 text-sm hover:opacity-90 disabled:opacity-50"}>
      {pending ? "Redirecting…" : (children ?? (isSubscription ? "Subscribe" : "Buy now"))}
    </button>
  )
}
