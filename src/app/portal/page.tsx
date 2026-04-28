import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { SiteHeader } from "@/components/site-header"
import { AuthForm } from "./auth-form"

export default async function PortalPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const session = await auth()
  const { next } = await searchParams
  if (session?.user) {
    redirect(next || "/portal/dashboard")
  }
  return (
    <>
      <SiteHeader />
      <main className="max-w-md mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="text-sm text-[var(--color-muted-foreground)] mt-2">
            Sign in or create an account to manage your AI products.
          </p>
        </div>
        <AuthForm next={next} />
      </main>
    </>
  )
}
