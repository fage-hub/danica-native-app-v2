"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, BarChart3, Receipt, LifeBuoy, KeyRound } from "lucide-react"

const links = [
  { href: "/portal/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/portal/dashboard/products", label: "My Products", icon: Package },
  { href: "/portal/dashboard/usage", label: "Usage", icon: BarChart3 },
  { href: "/portal/dashboard/billing", label: "Billing", icon: Receipt },
  { href: "/portal/dashboard/api-keys", label: "API Keys", icon: KeyRound },
  { href: "/portal/dashboard/support", label: "Support", icon: LifeBuoy },
]

export function DashboardSideNav() {
  const path = usePathname()
  return (
    <nav className="hidden md:flex flex-col gap-1 w-56 shrink-0">
      {links.map(l => {
        const Active = path === l.href || (l.href !== "/portal/dashboard" && path.startsWith(l.href))
        const Icon = l.icon
        return (
          <Link key={l.href} href={l.href} className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${Active ? "bg-[var(--color-muted)] font-medium" : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)]/60"}`}>
            <Icon className="size-4" />
            {l.label}
          </Link>
        )
      })}
    </nav>
  )
}

export function DashboardBottomNav() {
  const path = usePathname()
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-[var(--color-card)] border-t z-30 grid grid-cols-5 text-[10px]">
      {links.slice(0, 5).map(l => {
        const Active = path === l.href || (l.href !== "/portal/dashboard" && path.startsWith(l.href))
        const Icon = l.icon
        return (
          <Link key={l.href} href={l.href} className={`flex flex-col items-center justify-center gap-1 py-2 ${Active ? "text-[var(--color-accent)]" : "text-[var(--color-muted-foreground)]"}`}>
            <Icon className="size-5" />
            {l.label}
          </Link>
        )
      })}
    </nav>
  )
}
