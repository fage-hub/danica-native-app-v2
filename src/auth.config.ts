import type { NextAuthConfig } from "next-auth"
import { NextResponse } from "next/server"

const PROTECTED_PREFIXES = [
  "/portal/dashboard",
  "/api/me",
  "/api/subscriptions",
  "/api/paymongo/checkout",
]

export default {
  providers: [],
  pages: { signIn: "/?tab=portal" },
  callbacks: {
    authorized({ auth, request }) {
      const path = request.nextUrl.pathname
      const isProtected = PROTECTED_PREFIXES.some(p => path.startsWith(p))
      if (!isProtected) return true
      if (auth?.user) return true

      // For API paths, return a JSON 401 directly so callers (mobile shell,
      // fetch from inside the SPA) get a useful response instead of being
      // redirected to a login page they can't render.
      if (path.startsWith("/api/")) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 })
      }
      return false // page paths fall back to NextAuth's signIn redirect
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string
      }
      return session
    },
  },
} satisfies NextAuthConfig
