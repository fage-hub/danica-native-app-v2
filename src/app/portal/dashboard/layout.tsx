import Link from "next/link"
import { redirect } from "next/navigation"
import { auth, signOut } from "@/auth"
import { DashboardSideNav, DashboardBottomNav } from "@/components/dashboard-nav"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect("/portal")

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b sticky top-0 bg-[var(--color-background)]/80 backdrop-blur z-20">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-semibold tracking-tight">
            <span className="text-[var(--color-accent)]">Danica</span> IT
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-[var(--color-muted-foreground)] hidden sm:inline">{session.user.email}</span>
            <form action={async () => { "use server"; await signOut({ redirectTo: "/" }) }}>
              <button className="rounded-md border px-3 py-1.5 hover:bg-[var(--color-muted)]">Sign out</button>
            </form>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 flex gap-8 pb-24 md:pb-6">
        <DashboardSideNav />
        <main className="flex-1 min-w-0">{children}</main>
      </div>

      <DashboardBottomNav />
    </div>
  )
}
