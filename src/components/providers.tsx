"use client"

import { SessionProvider } from "next-auth/react"
import { LanguageProvider } from "@/contexts/LanguageContext"
import "@/lib/spark-shim"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LanguageProvider>{children}</LanguageProvider>
    </SessionProvider>
  )
}
