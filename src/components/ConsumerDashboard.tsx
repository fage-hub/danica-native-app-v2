"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
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

function formatPHP(centavos: number, currency = "PHP", locale = "en-PH") {
  return new Intl.NumberFormat(locale, { style: "currency", currency, currencyDisplay: "narrowSymbol", minimumFractionDigits: 2 }).format(centavos / 100)
}

export function ConsumerDashboard({ onLogout }: { onLogout: () => void }) {
  const { data: session } = useSession()
  const { t, language } = useLanguage()
  const d = t.portal.dashboard
  const locale = language === "zh" ? "zh-CN" : "en-PH"
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
      toast.error(d.checkoutFailed, { description: detail || d.tryAgain })
      setBusy(null)
      return
    }
    const { checkoutUrl } = await res.json()
    window.location.href = checkoutUrl
  }

  async function cancelSub(id: string, name: string) {
    if (!confirm(d.cancelConfirm.replace("{name}", name))) return
    const res = await fetch(`/api/subscriptions/${id}/cancel`, { method: "POST" })
    if (!res.ok) {
      toast.error(d.cancelFailed)
      return
    }
    toast.success(d.cancelled)
    refresh()
  }

  const subscribed = new Set(subs.filter(s => s.status === "active").map(s => s.productId))

  function statusLabel(s: string) {
    if (s === "paid") return d.paid
    if (s === "pending") return d.pending
    if (s === "failed") return d.failed
    return s
  }

  function statusClass(s: string) {
    if (s === "paid" || s === "active") return "text-emerald-600"
    if (s === "pending") return "text-amber-600"
    if (s === "failed" || s === "past_due") return "text-destructive"
    return "text-muted-foreground"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pb-24"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight truncate">
            {session?.user?.name ? session.user.name.split(" ")[0] : t.portal.welcomeBack}
          </h1>
          <p className="text-sm text-muted-foreground truncate">{session?.user?.email}</p>
        </div>
        <Button variant="outline" size="sm" onClick={onLogout} className="shrink-0">
          <SignOut size={16} className="mr-2" />
          {t.portal.signOut}
        </Button>
      </div>

      <Tabs value={tab} onValueChange={v => setTab(v as typeof tab)}>
        <TabsList className="grid grid-cols-6 w-full h-auto p-1">
          <TabsTrigger value="overview" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-1.5 py-2 text-[11px] sm:text-xs">
            <House size={16} weight={tab === "overview" ? "fill" : "regular"} />
            <span>{d.overview}</span>
          </TabsTrigger>
          <TabsTrigger value="products" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-1.5 py-2 text-[11px] sm:text-xs">
            <Package size={16} weight={tab === "products" ? "fill" : "regular"} />
            <span>{d.products}</span>
          </TabsTrigger>
          <TabsTrigger value="usage" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-1.5 py-2 text-[11px] sm:text-xs">
            <ChartLine size={16} weight={tab === "usage" ? "fill" : "regular"} />
            <span>{d.usage}</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-1.5 py-2 text-[11px] sm:text-xs">
            <Receipt size={16} weight={tab === "billing" ? "fill" : "regular"} />
            <span>{d.billing}</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-1.5 py-2 text-[11px] sm:text-xs">
            <Key size={16} weight={tab === "api" ? "fill" : "regular"} />
            <span>{d.api}</span>
          </TabsTrigger>
          <TabsTrigger value="support" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-1.5 py-2 text-[11px] sm:text-xs">
            <Lifebuoy size={16} weight={tab === "support" ? "fill" : "regular"} />
            <span>{d.support}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat label={d.tokenBalance} value={(overview?.user.tokenBalance ?? 0).toLocaleString(locale)} sub={d.tokenBalanceSub} Icon={Coins} />
            <Stat label={d.usedLast30} value={(overview?.usageLast30d ?? 0).toLocaleString(locale)} sub={d.usedSub} Icon={TrendUp} />
            <Stat
              label={d.nextCharge}
              value={overview?.activeSubs[0]?.nextChargeAt ? new Date(overview.activeSubs[0].nextChargeAt).toLocaleDateString(locale, { day: "numeric", month: "short" }) : "—"}
              sub={(overview?.activeSubs.length ?? 0) > 0 ? formatPHP(overview!.activeSubs.reduce((s, x) => s + x.amount, 0), "PHP", locale) : d.noActiveSub}
              Icon={CalendarBlank}
            />
          </div>

          <Card>
            <CardHeader><CardTitle className="text-base">{d.activeSubscriptions}</CardTitle></CardHeader>
            <CardContent>
              {(overview?.activeSubs.length ?? 0) === 0 ? (
                <div className="text-sm text-muted-foreground py-4 text-center">
                  {d.noSubscriptions} <button className="text-accent hover:underline ml-1" onClick={() => setTab("products")}>{d.browseProducts}</button>
                </div>
              ) : (
                <ul className="divide-y">
                  {overview!.activeSubs.map(s => (
                    <li key={s.id} className="py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium truncate">{s.productName}</p>
                        <p className="text-xs text-muted-foreground">
                          {s.billingInterval} · {d.next} {new Date(s.nextChargeAt).toLocaleDateString(locale)}
                          {s.cardLast4 ? ` · ••••${s.cardLast4}` : ""}
                        </p>
                      </div>
                      <span className="font-mono text-sm shrink-0">{formatPHP(s.amount, s.currency, locale)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">{d.recentOrders}</CardTitle></CardHeader>
            <CardContent>
              {(overview?.recentOrders.length ?? 0) === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">{d.noOrdersYet}</p>
              ) : (
                <ul className="divide-y">
                  {overview!.recentOrders.map(o => (
                    <li key={o.id} className="py-3 flex items-center justify-between text-sm gap-3">
                      <div className="min-w-0">
                        <p className="font-mono text-xs">{o.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleString(locale)}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-mono">{formatPHP(o.total, o.currency, locale)}</p>
                        <span className={`text-xs ${statusClass(o.status)}`}>{statusLabel(o.status)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <h2 className="font-semibold">{d.myAiProducts}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {products.filter(p => p.type === "service").map(p => (
              <Card key={p.id} className="h-full flex flex-col">
                <CardContent className="p-5 flex flex-col flex-1">
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2 flex-1">{p.description}</p>
                  <p className="mt-3 font-semibold">{formatPHP(p.basePrice, p.currency, locale)} <span className="text-xs font-normal text-muted-foreground">/ {language === "zh" ? "月" : "mo"}</span></p>
                  <div className="mt-3">
                    {subscribed.has(p.id) ? (
                      <span className="text-xs text-emerald-600 font-medium">{d.subscribed}</span>
                    ) : (
                      <Button size="sm" disabled={busy === p.id} onClick={() => startCheckout(p.id, true)} className="w-full sm:w-auto">
                        {busy === p.id ? d.redirecting : d.subscribeMonthly}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <h2 className="font-semibold mt-6">{d.tokenPacks}</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {products.filter(p => p.type === "token").map(p => (
              <Card key={p.id}>
                <CardContent className="p-5 text-center">
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="mt-2 text-xl font-semibold">{formatPHP(p.basePrice, p.currency, locale)}</p>
                  <p className="text-xs text-muted-foreground">{(p.tokenAmount ?? 0).toLocaleString(locale)} {d.tokens}</p>
                  <div className="mt-3">
                    <Button size="sm" variant="outline" disabled={busy === p.id} onClick={() => startCheckout(p.id, false)} className="w-full">
                      {busy === p.id ? d.redirecting : d.buy}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="usage">
          <Card>
            <CardHeader><CardTitle className="text-base">{d.last30Days}</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{(overview?.usageLast30d ?? 0).toLocaleString(locale)} <span className="text-sm font-normal text-muted-foreground">{d.tokens}</span></p>
              <p className="text-xs text-muted-foreground mt-3">{d.chartSoon}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">{d.subscriptions}</CardTitle></CardHeader>
            <CardContent>
              {subs.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">{d.noSubs}</p>
              ) : (
                <ul className="divide-y">
                  {subs.map(s => (
                    <li key={s.id} className="py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{s.productName}</p>
                        <p className="text-xs text-muted-foreground">
                          <span className={statusClass(s.status)}>{s.status}</span> · {s.billingInterval} · {formatPHP(s.amount, s.currency, locale)}
                          {s.cardLast4 ? ` · ••••${s.cardLast4}` : ""}
                        </p>
                      </div>
                      {s.status === "active" && (
                        <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive shrink-0" onClick={() => cancelSub(s.id, s.productName ?? "")}>
                          {d.cancel}
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">{d.orders}</CardTitle></CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">{d.noOrdersYet}</p>
              ) : (
                <ul className="divide-y">
                  {orders.map(o => (
                    <li key={o.id} className="py-3 flex items-center justify-between text-sm gap-3">
                      <div className="min-w-0">
                        <p className="font-mono text-xs">{o.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleString(locale)}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-mono">{formatPHP(o.total, o.currency, locale)}</p>
                        <span className={`text-xs ${statusClass(o.status)}`}>{statusLabel(o.status)}</span>
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
              {d.apiSoon}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="support">
          <Card>
            <CardContent className="p-6 text-center text-sm text-muted-foreground">
              {d.supportInfo} <a href="mailto:support@danica.it" className="text-accent hover:underline">support@danica.it</a>.
              <br />
              {d.supportSoon}
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
