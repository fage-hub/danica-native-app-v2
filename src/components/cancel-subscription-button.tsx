"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function CancelSubscriptionButton({ subscriptionId, productName }: { subscriptionId: string; productName: string }) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function cancel() {
    if (!confirm(`Cancel subscription to ${productName}? It will remain active until the next charge date.`)) return
    startTransition(async () => {
      const res = await fetch(`/api/subscriptions/${subscriptionId}/cancel`, { method: "POST" })
      if (!res.ok) {
        toast.error("Cancellation failed")
        return
      }
      toast.success("Subscription cancelled")
      router.refresh()
    })
  }

  return (
    <button onClick={cancel} disabled={pending} className="text-xs text-[var(--color-destructive)] hover:underline disabled:opacity-50">
      {pending ? "Cancelling…" : "Cancel"}
    </button>
  )
}
