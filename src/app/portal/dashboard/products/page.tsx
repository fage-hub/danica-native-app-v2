import { auth } from "@/auth"
import { getActiveProducts, getUserSubscriptions } from "@/lib/queries"
import { formatMoney } from "@/lib/utils"
import { CheckoutButton } from "@/components/subscribe-button"
import { CancelSubscriptionButton } from "@/components/cancel-subscription-button"

export default async function ProductsPage() {
  const session = await auth()
  const [allProducts, subs] = await Promise.all([
    getActiveProducts(),
    getUserSubscriptions(session!.user.id),
  ])
  const subscribedProductIds = new Set(subs.filter(s => s.status === "active").map(s => s.productId))
  const services = allProducts.filter(p => p.type === "service")
  const tokenPacks = allProducts.filter(p => p.type === "token")

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My products</h1>
        <p className="text-sm text-[var(--color-muted-foreground)]">Manage subscriptions and buy token packs.</p>
      </div>

      {subs.length > 0 && (
        <section>
          <h2 className="font-semibold mb-3">Active subscriptions</h2>
          <ul className="space-y-3">
            {subs.filter(s => s.status === "active").map(sub => (
              <li key={sub.id} className="rounded-[var(--radius-lg)] border bg-[var(--color-card)] p-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium">{sub.productName}</p>
                  <p className="text-xs text-[var(--color-muted-foreground)]">
                    {sub.billingInterval} · {formatMoney(sub.amount, sub.currency)} · next charge {new Date(sub.nextChargeAt).toLocaleDateString()}
                  </p>
                  {sub.cardLast4 && <p className="text-xs text-[var(--color-muted-foreground)]">Card {sub.cardBrand?.toUpperCase()} ••••{sub.cardLast4}</p>}
                </div>
                <CancelSubscriptionButton subscriptionId={sub.id} productName={sub.productName ?? "this plan"} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="font-semibold mb-3">AI products</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {services.map(p => (
            <article key={p.id} className="rounded-[var(--radius-lg)] border bg-[var(--color-card)] p-5">
              <h3 className="font-semibold">{p.name}</h3>
              <p className="text-xs text-[var(--color-muted-foreground)] mt-1 line-clamp-2">{p.description}</p>
              <p className="mt-3 font-semibold">
                {formatMoney(p.basePrice, p.currency)} <span className="text-xs font-normal text-[var(--color-muted-foreground)]">/ mo</span>
              </p>
              <div className="mt-4">
                {subscribedProductIds.has(p.id) ? (
                  <span className="text-xs text-emerald-600 font-medium">✓ Subscribed</span>
                ) : (
                  <CheckoutButton productId={p.id} isSubscription billingInterval="monthly" className="rounded-md bg-[var(--color-primary)] text-[var(--color-primary-foreground)] px-3 py-1.5 text-sm hover:opacity-90 disabled:opacity-50">
                    Subscribe monthly
                  </CheckoutButton>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-semibold mb-3">Token packs</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {tokenPacks.map(p => (
            <article key={p.id} className="rounded-[var(--radius-lg)] border bg-[var(--color-card)] p-5 text-center">
              <h3 className="font-semibold">{p.name}</h3>
              <p className="mt-2 text-2xl font-semibold">{formatMoney(p.basePrice, p.currency)}</p>
              <p className="text-xs text-[var(--color-muted-foreground)]">{(p.tokenAmount ?? 0).toLocaleString()} tokens</p>
              <div className="mt-4">
                <CheckoutButton productId={p.id} className="w-full rounded-md border px-3 py-1.5 text-sm hover:bg-[var(--color-muted)]">
                  Buy
                </CheckoutButton>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
