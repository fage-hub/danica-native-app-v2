import type { NextAuthConfig } from "next-auth"

const PROTECTED_PREFIXES = ["/portal/dashboard", "/api/me", "/api/billing", "/api/subscriptions"]

export default {
  providers: [],
  pages: { signIn: "/portal" },
  callbacks: {
    authorized({ auth, request }) {
      const path = request.nextUrl.pathname
      const isProtected = PROTECTED_PREFIXES.some(p => path.startsWith(p))
      if (!isProtected) return true
      return !!auth?.user
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
