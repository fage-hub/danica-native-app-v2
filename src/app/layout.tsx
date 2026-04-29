import type { Metadata, Viewport } from "next"
import "./globals.css"
import { Toaster } from "sonner"
import { Providers } from "@/components/providers"

export const metadata: Metadata = {
  title: "Danica IT — AI products for the Philippines",
  description: "AI Assistant, Content Generator, Automation Suite, Predictive Analytics, Sentiment Analysis, AI Recommendations.",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1020" },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  )
}
