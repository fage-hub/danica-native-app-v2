import Link from "next/link"
import { auth } from "@/auth"
import { getUserOverview } from "@/lib/queries"
import { formatMoney } from "@/lib/utils"
import { Coins, TrendingUp, CalendarClock, ArrowRight } from "lucide-react"

export default async function OverviewPage() {
  const session = await auth()
  const data = await getUserOverview(session!.user.id)

  const nextCharge = data.activeSubs[0]?.nextChargeAt
  const totalMonthly = data.activeSubs
    .filter(s => s.billingInterval === "monthly")
    .reduce((sum, s) => sum + s.amount, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back{data.user?.name ? `, ${data.user.name.split(" ")[0]}` : ""}</h1>
        <p className="text-sm text-[var(--color-muted-foreground)]">Here is what is going on with your account today.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Token balance" value={data.user?.tokenBalance?.toLocaleString() ?? "0"} sub="Pay-as-you-go credits" icon={Coins} />
        <Stat label="Used last 30 days" value={data.usageLast30d.toLocaleString()} sub="Across all products" icon={TrendingUp} />
        <Stat
          label="Next charge"
          value={nextCharge ? new Date(nextCharge).toLocaleDateString("en-PH", { day: "numeric", month: "short" }) : "—"}
          sub={totalMonthly > 0 ? formatMoney(totalMonthly, "PHP") : "No active subscription"}
          icon={CalendarClock}
        />
      </div>

      <div className="rounded-[var(--radius-lg)] border bg-[var(--color-card)] p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Active subscriptions</h2>
          <Link href="/portal/dashboard/products" className="text-sm text-[var(--color-accent)] hover:underline inline-flex items-center gap-1">
            Manage <ArrowRight className="size-3.5" />
          </Link>
        </div>
        {data.activeSubs.length === 0 ? (
          <div className="text-center py-8 text-sm text-[var(--color-muted-foreground)]">
            <p>No active subscriptions.</p>
            <Link href="/portal/dashboard/products" className="inline-block mt-3 text-[var(--color-accent)] hover:underline">Browse products →</Link>
          </div>
        ) : (
          <ul className="divide-y">
            {data.activeSubs.map(sub => (
              <li key={sub.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium">{sub.productName}</p>
                  <p className="text-xs text-[var(--color-muted-foreground)]">
                    {sub.billingInterval} · next {new Date(sub.nextChargeAt).toLocaleDateString()} · ••••{sub.cardLast4 ?? "----"}
                  </p>
                </div>
                <span className="font-mono text-sm">{formatMoney(sub.amount, sub.currency)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-[var(--radius-lg)] border bg-[var(--color-card)] p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Recent orders</h2>
          <Link href="/portal/dashboard/billing" className="text-sm text-[var(--color-accent)] hover:underline inline-flex items-center gap-1">
            View all <ArrowRight className="size-3.5" />
          </Link>
        </div>
        {data.recentOrders.length === 0 ? (
          <p className="text-sm text-[var(--color-muted-foreground)] py-4 text-center">No orders yet.</p>
        ) : (
          <ul className="divide-y">
            {data.recentOrders.map(o => (
              <li key={o.id} className="py-3 flex items-center justify-between text-sm">
                <div>
                  <p className="font-mono text-xs">{o.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-xs text-[var(--color-muted-foreground)]">{new Date(o.createdAt).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono">{formatMoney(o.total, o.currency)}</p>
                  <StatusBadge status={o.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function Stat({ label, value, sub, icon: Icon }: { label: string; value: string; sub: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="rounded-[var(--radius-lg)] border bg-[var(--color-card)] p-5">
      <div className="flex items-start justify-between">
        <p className="text-xs uppercase tracking-wider text-[var(--color-muted-foreground)]">{label}</p>
        <Icon className="size-4 text-[var(--color-muted-foreground)]" />
      </div>
      <p className="mt-3 text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">{sub}</p>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const cls = status === "paid" ? "text-emerald-600" : status === "pending" ? "text-amber-600" : status === "failed" ? "text-[var(--color-destructive)]" : "text-[var(--color-muted-foreground)]"
  return <span className={`text-xs ${cls}`}>{status}</span>
}
