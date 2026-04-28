import { auth } from "@/auth"
import { getDailyUsage } from "@/lib/queries"

export default async function UsagePage() {
  const session = await auth()
  const rows = await getDailyUsage(session!.user.id, 30)

  const byDay = new Map<string, number>()
  for (const r of rows) {
    byDay.set(r.day, (byDay.get(r.day) ?? 0) + Number(r.tokens))
  }
  const days = Array.from(byDay.entries()).sort()
  const max = Math.max(1, ...days.map(([, v]) => v))
  const total = days.reduce((sum, [, v]) => sum + v, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Usage</h1>
        <p className="text-sm text-[var(--color-muted-foreground)]">Token consumption across all products, last 30 days.</p>
      </div>

      <div className="rounded-[var(--radius-lg)] border bg-[var(--color-card)] p-5">
        <div className="flex items-baseline justify-between mb-4">
          <p className="text-3xl font-semibold">{total.toLocaleString()} <span className="text-sm font-normal text-[var(--color-muted-foreground)]">tokens</span></p>
          <p className="text-xs text-[var(--color-muted-foreground)]">last 30 days</p>
        </div>
        {days.length === 0 ? (
          <p className="text-sm text-[var(--color-muted-foreground)] py-12 text-center">No usage yet. Subscribe to a product to start tracking.</p>
        ) : (
          <div className="flex items-end gap-1 h-32">
            {days.map(([day, value]) => (
              <div key={day} className="flex-1 group relative">
                <div
                  className="bg-[var(--color-accent)] rounded-t-sm w-full"
                  style={{ height: `${(value / max) * 100}%` }}
                />
                <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-1 left-1/2 -translate-x-1/2 text-xs bg-[var(--color-foreground)] text-[var(--color-background)] px-2 py-1 rounded whitespace-nowrap">
                  {day}: {value.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
