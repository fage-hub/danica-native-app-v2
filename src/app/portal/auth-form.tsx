"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { toast } from "sonner"

type Mode = "signin" | "signup"

export function AuthForm({ next }: { next?: string }) {
  const [mode, setMode] = useState<Mode>("signin")
  const [pending, startTransition] = useTransition()
  const router = useRouter()
  const target = next || "/portal/dashboard"

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const email = String(fd.get("email") ?? "")
    const password = String(fd.get("password") ?? "")
    const name = String(fd.get("name") ?? "")
    const company = String(fd.get("company") ?? "")
    const phone = String(fd.get("phone") ?? "")

    startTransition(async () => {
      if (mode === "signup") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name, company, phone }),
        })
        if (!res.ok) {
          const { error } = await res.json().catch(() => ({ error: "register_failed" }))
          toast.error(typeof error === "string" ? error : "Registration failed")
          return
        }
      }
      const result = await signIn("credentials", { email, password, redirect: false })
      if (result?.error) {
        toast.error("Invalid email or password")
        return
      }
      toast.success(mode === "signup" ? "Account created" : "Signed in")
      router.push(target)
      router.refresh()
    })
  }

  return (
    <div className="rounded-[var(--radius-lg)] border bg-[var(--color-card)] p-6">
      <div className="grid grid-cols-2 gap-1 mb-6 p-1 bg-[var(--color-muted)] rounded-md text-sm">
        <button onClick={() => setMode("signin")} className={`py-2 rounded ${mode === "signin" ? "bg-[var(--color-card)] shadow-sm font-medium" : "text-[var(--color-muted-foreground)]"}`}>Sign in</button>
        <button onClick={() => setMode("signup")} className={`py-2 rounded ${mode === "signup" ? "bg-[var(--color-card)] shadow-sm font-medium" : "text-[var(--color-muted-foreground)]"}`}>Sign up</button>
      </div>
      <form onSubmit={onSubmit} className="space-y-3">
        {mode === "signup" && (
          <>
            <Field label="Full name" name="name" required />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Company" name="company" />
              <Field label="Phone" name="phone" type="tel" placeholder="+63 9XX..." />
            </div>
          </>
        )}
        <Field label="Email" name="email" type="email" required autoComplete="email" />
        <Field label="Password" name="password" type="password" required autoComplete={mode === "signup" ? "new-password" : "current-password"} minLength={mode === "signup" ? 8 : undefined} />
        <button type="submit" disabled={pending} className="w-full rounded-md bg-[var(--color-primary)] text-[var(--color-primary-foreground)] py-2.5 font-medium disabled:opacity-50">
          {pending ? "Working…" : mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </form>
    </div>
  )
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...rest } = props
  return (
    <label className="block">
      <span className="block text-sm mb-1">{label}{rest.required && <span className="text-[var(--color-destructive)]"> *</span>}</span>
      <input {...rest} className="w-full rounded-md border bg-[var(--color-background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" />
    </label>
  )
}
