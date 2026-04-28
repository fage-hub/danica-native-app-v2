import Link from "next/link"
import { eq, asc } from "drizzle-orm"
import { SiteHeader } from "@/components/site-header"
import { db } from "@/lib/db"
import { products } from "@/lib/db/schema"
import { formatMoney } from "@/lib/utils"

export const revalidate = 60

export default async function HomePage() {
  const catalog = await db.query.products.findMany({
    where: eq(products.active, true),
    orderBy: [asc(products.basePrice)],
  }).catch(() => [])

  const services = catalog.filter(p => p.type === "service")

  return (
    <>
      <SiteHeader />
      <main className="max-w-6xl mx-auto px-4 py-10 sm:py-16">
        <section className="text-center max-w-3xl mx-auto">
          <p className="inline-block rounded-full border px-3 py-1 text-xs uppercase tracking-wider text-[var(--color-muted-foreground)]">
            Built for the Philippines · pay with GCash / Maya / cards
          </p>
          <h1 className="mt-6 text-4xl sm:text-6xl font-semibold tracking-tight leading-tight">
            AI for the way <span className="text-[var(--color-accent)]">your business</span> already works
          </h1>
          <p className="mt-5 text-base sm:text-lg text-[var(--color-muted-foreground)]">
            Six production-ready AI products with local payments, local support, 50+ language coverage.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/portal" className="rounded-md bg-[var(--color-primary)] text-[var(--color-primary-foreground)] px-5 py-2.5 hover:opacity-90">
              Start free trial
            </Link>
            <Link href="#products" className="rounded-md border px-5 py-2.5 hover:bg-[var(--color-muted)]">
              Explore products
            </Link>
          </div>
        </section>

        <section id="products" className="mt-20 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map(p => (
            <article key={p.id} className="rounded-[var(--radius-lg)] border p-5 bg-[var(--color-card)] hover:shadow-lg transition">
              <h3 className="font-semibold text-lg">{p.name}</h3>
              <p className="mt-2 text-sm text-[var(--color-muted-foreground)] line-clamp-3">{p.description}</p>
              <ul className="mt-3 space-y-1 text-xs text-[var(--color-muted-foreground)]">
                {(p.features || []).slice(0, 3).map((f, i) => <li key={i}>• {f}</li>)}
              </ul>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-semibold">
                  {formatMoney(p.basePrice, p.currency)}{" "}
                  <span className="text-xs font-normal text-[var(--color-muted-foreground)]">/ mo</span>
                </span>
                <Link href={`/portal?next=/portal/dashboard/products`} className="text-sm text-[var(--color-accent)] hover:underline">
                  Subscribe →
                </Link>
              </div>
            </article>
          ))}
        </section>

        {services.length === 0 && (
          <p className="mt-10 text-center text-sm text-[var(--color-muted-foreground)]">
            Catalog is being seeded — run <code className="px-1 py-0.5 rounded bg-[var(--color-muted)]">npm run seed</code> after the database is connected.
          </p>
        )}
      </main>
    </>
  )
}
