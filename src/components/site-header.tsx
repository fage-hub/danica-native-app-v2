import Link from "next/link"
import { auth, signOut } from "@/auth"

export async function SiteHeader() {
  const session = await auth()
  return (
    <header className="border-b border-[var(--color-border)] sticky top-0 bg-[var(--color-background)]/80 backdrop-blur z-30">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight text-lg">
          <span className="text-[var(--color-accent)]">Danica</span> IT
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/products" className="hover:text-[var(--color-accent)]">Products</Link>
          <Link href="/pricing" className="hover:text-[var(--color-accent)]">Pricing</Link>
          {session?.user ? (
            <>
              <Link href="/portal/dashboard" className="hover:text-[var(--color-accent)]">Dashboard</Link>
              <form action={async () => { "use server"; await signOut({ redirectTo: "/" }) }}>
                <button type="submit" className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <Link href="/portal" className="rounded-md bg-[var(--color-primary)] text-[var(--color-primary-foreground)] px-3 py-1.5 hover:opacity-90">
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
