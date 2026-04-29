"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import {
  Coins,
  TrendUp,
  CalendarBlank,
  ChartLine,
  Receipt,
  Lifebuoy,
  Key,
  Package,
  SignOut,
  House,
} from "@phosphor-icons/react"
import { useLanguage } from "@/contexts/LanguageContext"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Overview = {
  user: { id: string; email: string; name: string | null; tokenBalance: number; paymongoCustomerId: string | null }
  activeSubs: Array<{
    id: string
    productId: string
    productName: string | null
    amount: number
    currency: string
    billingInterval: string
    nextChargeAt: string
    cardLast4: string | null
    cardBrand: string | null
    status: string
  }>
  usageLast30d: number
  recentOrders: Array<{
    id: string
    total: number
    currency: string
    status: string
    paidAt: string | null
    createdAt: string
  }>
}

type Subscription = {
  id: string
  status: string
  productId: string
  productName: string | null
  productSlug: string | null
  amount: number
  currency: string
  billingInterval: string
  nextChargeAt: string
  lastChargedAt: string | null
  cardLast4: string | null
  cardBrand: string | null
  failureCount: number
  createdAt: string
}

type Order = {
  id: string
  total: number
  currency: string
  status: string
  paidAt: string | null
  createdAt: string
}

type Product = {
  id: string
  slug: string
  name: string
  description: string | null
  type: "service" | "token" | "bundle"
  basePrice: number
  currency: string
  tokenAmount: number | null
  features: string[]
}

function formatPHP(centavos: number, currency = "PHP") {
  return new Intl.NumberFormat("en-PH", { style: "currency", currency, minimumFractionDigits: 2 }).format(centavos / 100)
}

export function ConsumerDashboard({ onLogout }: { onLogout: () => void }) {
  const { data: session } = useSession()
  const { t } = useLanguage()
  const router = useRouter()
  const [tab, setTab] = useState<"overview" | "products" | "usage" | "billing" | "api" | "support">("overview")
  const [overview, setOverview] = useState<Overview | null>(null)
  const [subs, setSubs] = useState<Subscription[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [busy, setBusy] = useState<string | null>(null)

  async function refresh() {
    const [ov, sb, od, pr] = await Promise.all([
      fetch("/api/me/overview").then(r => (r.ok ? r.json() : null)),
      fetch("/api/me/subscriptions").then(r => (r.ok ? r.json() : { items: [] })),
      fetch("/api/me/orders").then(r => (r.ok ? r.json() : { items: [] })),
      fetch("/api/products").then(r => (r.ok ? r.json() : { items: [] })),
    ])
    setOverview(ov)
    setSubs(sb.items ?? [])
    setOrders(od.items ?? [])
    setProducts(pr.items ?? [])
  }

  useEffect(() => {
    refresh()
  }, [])

  async function startCheckout(productId: string, isSubscription: boolean) {
    setBusy(productId)
    const res = await fetch("/api/paymongo/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [{ productId, quantity: 1 }],
        isSubscription,
        billingInterval: isSubscription ? "monthly" : undefined,
      }),
    })
    if (!res.ok) {
      const { detail } = await res.json().catch(() => ({}))
      toast.error("Checkout failed", { description: detail || "Please try again." })
      setBusy(null)
      return
    }
    const { checkoutUrl } = await res.json()
    window.location.href = checkoutUrl
  }

  async function cancelSub(id: string, name: string) {
    if (!confirm(`Cancel subscription to ${name}?`)) return
    const res = await fetch(`/api/subscriptions/${id}/cancel`, { method: "POST" })
    if (!res.ok) {
      toast.error("Cancellation failed")
      return
    }
    toast.success("Subscription cancelled")
    refresh()
  }

  const subscribed = new Set(subs.filter(s => s.status === "active").map(s => s.productId))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pb-24"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {session?.user?.name ? `${session.user.name.split(" ")[0]}` : t.portal.welcomeBack}
          </h1>
          <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
        </div>
        <Button variant="outline" size="sm" onClick={onLogout}>
          <SignOut size={16} className="mr-2" />
          Sign out
        </Button>
      </div>

      <Tabs value={tab} onValueChange={v => setTab(v as typeof tab)}>
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="overview"><House size={16} /></TabsTrigger>
          <TabsTrigger value="products"><Package size={16} /></TabsTrigger>
          <TabsTrigger value="usage"><ChartLine size={16} /></TabsTrigger>
          <TabsTrigger value="billing"><Receipt size={16} /></TabsTrigger>
          <TabsTrigger value="api"><Key size={16} /></TabsTrigger>
          <TabsTrigger value="support"><Lifebuoy size={16} /></TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat label="Token balance" value={(overview?.user.tokenBalance ?? 0).toLocaleString()} sub="Pay-as-you-go credits" Icon={Coins} />
            <Stat label="Used last 30 days" value={(overview?.usageLast30d ?? 0).toLocaleString()} sub="Across all products" Icon={TrendUp} />
            <Stat
              label="Next charge"
              value={overview?.activeSubs[0]?.nextChargeAt ? new Date(overview.activeSubs[0].nextChargeAt).toLocaleDateString("en-PH", { day: "numeric", month: "short" }) : "—"}
              sub={(overview?.activeSubs.length ?? 0) > 0 ? formatPHP(overview!.activeSubs.reduce((s, x) => s + x.amount, 0)) : "No active subscription"}
              Icon={CalendarBlank}
            />
          </div>

          <Card>
            <CardHeader><CardTitle className="text-base">Active subscriptions</CardTitle></CardHeader>
            <CardContent>
              {(overview?.activeSubs.length ?? 0) === 0 ? (
                <div className="text-sm text-muted-foreground py-4 text-center">
                  No active subscriptions. <button className="text-accent hover:underline" onClick={() => setTab("products")}>Browse products →</button>
                </div>
              ) : (
                <ul className="divide-y">
                  {overview!.activeSubs.map(s => (
                    <li key={s.id} className="py-3 flex items-center justify-between">
                      <div>
                        <p className="font-medium">{s.productName}</p>
                        <p className="text-xs text-muted-foreground">
                          {s.billingInterval} · next {new Date(s.nextChargeAt).toLocaleDateString()}
                          {s.cardLast4 ? ` · ••••${s.cardLast4}` : ""}
                        </p>
                      </div>
                      <span className="font-mono text-sm">{formatPHP(s.amount, s.currency)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Recent orders</CardTitle></CardHeader>
            <CardContent>
              {(overview?.recentOrders.length ?? 0) === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No orders yet.</p>
              ) : (
                <ul className="divide-y">
                  {overview!.recentOrders.map(o => (
                    <li key={o.id} className="py-3 flex items-center justify-between text-sm">
                      <div>
                        <p className="font-mono text-xs">{o.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono">{formatPHP(o.total, o.currency)}</p>
                        <span className={`text-xs ${o.status === "paid" ? "text-emerald-600" : o.status === "pending" ? "text-amber-600" : "text-muted-foreground"}`}>{o.status}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <h2 className="font-semibold">AI products</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {products.filter(p => p.type === "service").map(p => (
              <Card key={p.id}>
                <CardContent className="p-5">
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.description}</p>
                  <p className="mt-3 font-semibold">{formatPHP(p.basePrice, p.currency)} <span className="text-xs font-normal text-muted-foreground">/ mo</span></p>
                  <div className="mt-3">
                    {subscribed.has(p.id) ? (
                      <span className="text-xs text-emerald-600 font-medium">✓ Subscribed</span>
                    ) : (
                      <Button size="sm" disabled={busy === p.id} onClick={() => startCheckout(p.id, true)}>
                        {busy === p.id ? "Redirecting…" : "Subscribe monthly"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <h2 className="font-semibold mt-6">Token packs</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {products.filter(p => p.type === "token").map(p => (
              <Card key={p.id}>
                <CardContent className="p-5 text-center">
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="mt-2 text-xl font-semibold">{formatPHP(p.basePrice, p.currency)}</p>
                  <p className="text-xs text-muted-foreground">{(p.tokenAmount ?? 0).toLocaleString()} tokens</p>
                  <div className="mt-3">
                    <Button size="sm" variant="outline" disabled={busy === p.id} onClick={() => startCheckout(p.id, false)}>
                      {busy === p.id ? "Redirecting…" : "Buy"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="usage">
          <Card>
            <CardHeader><CardTitle className="text-base">Last 30 days</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{(overview?.usageLast30d ?? 0).toLocaleString()} <span className="text-sm font-normal text-muted-foreground">tokens</span></p>
              <p className="text-xs text-muted-foreground mt-3">Detailed per-day chart ships in the next iteration.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Subscriptions</CardTitle></CardHeader>
            <CardContent>
              {subs.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No subscriptions.</p>
              ) : (
                <ul className="divide-y">
                  {subs.map(s => (
                    <li key={s.id} className="py-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-sm">{s.productName}</p>
                        <p className="text-xs text-muted-foreground">
                          {s.status} · {s.billingInterval} · {formatPHP(s.amount, s.currency)}
                          {s.cardLast4 ? ` · ••••${s.cardLast4}` : ""}
                        </p>
                      </div>
                      {s.status === "active" && (
                        <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => cancelSub(s.id, s.productName ?? "this plan")}>
                          Cancel
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Orders</CardTitle></CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No orders yet.</p>
              ) : (
                <ul className="divide-y">
                  {orders.map(o => (
                    <li key={o.id} className="py-3 flex items-center justify-between text-sm">
                      <div>
                        <p className="font-mono text-xs">{o.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono">{formatPHP(o.total, o.currency)}</p>
                        <span className={`text-xs ${o.status === "paid" ? "text-emerald-600" : o.status === "pending" ? "text-amber-600" : "text-muted-foreground"}`}>{o.status}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardContent className="p-6 text-center text-sm text-muted-foreground">
              API key generation ships in the next iteration. Reach out via Support if you need a key now.
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="support">
          <Card>
            <CardContent className="p-6 text-center text-sm text-muted-foreground">
              For urgent issues email <a href="mailto:support@danica.it" className="text-accent hover:underline">support@danica.it</a>.
              <br />
              Full ticketing UI ships in the next iteration.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}

function Stat({ label, value, sub, Icon }: { label: string; value: string; sub: string; Icon: React.ElementType }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
          <Icon size={16} className="text-muted-foreground" />
        </div>
        <p className="mt-2 text-xl font-bold">{value}</p>
        <p className="mt-1 text-[11px] text-muted-foreground">{sub}</p>
      </CardContent>
    </Card>
  )
}
