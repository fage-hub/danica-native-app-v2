import { auth } from "@/auth"
import { getUserOrders, getUserSubscriptions } from "@/lib/queries"
import { formatMoney } from "@/lib/utils"
import { CancelSubscriptionButton } from "@/components/cancel-subscription-button"

export default async function BillingPage({ searchParams }: { searchParams: Promise<{ order?: string; status?: string }> }) {
  const session = await auth()
  const [orders, subs] = await Promise.all([
    getUserOrders(session!.user.id),
    getUserSubscriptions(session!.user.id),
  ])
  const { status } = await searchParams

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
        <p className="text-sm text-[var(--color-muted-foreground)]">Order history, subscriptions, and payment methods.</p>
      </div>

      {status === "success" && (
        <div className="rounded-md bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 px-4 py-3 text-sm text-emerald-900 dark:text-emerald-200">
          Payment received. It may take up to a minute for activation.
        </div>
      )}
      {status === "cancelled" && (
        <div className="rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 px-4 py-3 text-sm text-amber-900 dark:text-amber-200">
          Checkout cancelled. No charge was made.
        </div>
      )}

      <section>
        <h2 className="font-semibold mb-3">Subscriptions</h2>
        {subs.length === 0 ? (
          <p className="text-sm text-[var(--color-muted-foreground)]">No subscriptions yet.</p>
        ) : (
          <div className="rounded-[var(--radius-lg)] border bg-[var(--color-card)] overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[var(--color-muted)]/40 text-xs uppercase tracking-wider text-[var(--color-muted-foreground)]">
                <tr>
                  <th className="text-left px-4 py-2">Product</th>
                  <th className="text-left px-4 py-2">Status</th>
                  <th className="text-left px-4 py-2">Next charge</th>
                  <th className="text-right px-4 py-2">Amount</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {subs.map(sub => (
                  <tr key={sub.id} className="border-t">
                    <td className="px-4 py-3">
                      <p className="font-medium">{sub.productName}</p>
                      <p className="text-xs text-[var(--color-muted-foreground)]">{sub.billingInterval}</p>
                    </td>
                    <td className="px-4 py-3"><StatusPill status={sub.status} /></td>
                    <td className="px-4 py-3 text-[var(--color-muted-foreground)]">
                      {sub.status === "active" ? new Date(sub.nextChargeAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">{formatMoney(sub.amount, sub.currency)}</td>
                    <td className="px-4 py-3 text-right">
                      {sub.status === "active" && <CancelSubscriptionButton subscriptionId={sub.id} productName={sub.productName ?? "subscription"} />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className="font-semibold mb-3">Orders</h2>
        {orders.length === 0 ? (
          <p className="text-sm text-[var(--color-muted-foreground)]">No orders yet.</p>
        ) : (
          <div className="rounded-[var(--radius-lg)] border bg-[var(--color-card)] overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[var(--color-muted)]/40 text-xs uppercase tracking-wider text-[var(--color-muted-foreground)]">
                <tr>
                  <th className="text-left px-4 py-2">Order</th>
                  <th className="text-left px-4 py-2">Date</th>
                  <th className="text-left px-4 py-2">Status</th>
                  <th className="text-right px-4 py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id} className="border-t">
                    <td className="px-4 py-3 font-mono text-xs">{o.id.slice(0, 8).toUpperCase()}</td>
                    <td className="px-4 py-3 text-[var(--color-muted-foreground)]">{new Date(o.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-3"><StatusPill status={o.status} /></td>
                    <td className="px-4 py-3 text-right font-mono">{formatMoney(o.total, o.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    paid: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    active: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    failed: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
    cancelled: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300",
    past_due: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
    refunded: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300",
  }
  return <span className={`inline-block rounded-full px-2 py-0.5 text-xs ${map[status] ?? "bg-[var(--color-muted)]"}`}>{status}</span>
}
