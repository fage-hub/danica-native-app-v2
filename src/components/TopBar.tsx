"use client"

import { LanguageSwitcher } from "./LanguageSwitcher"
import { useLanguage } from "@/contexts/LanguageContext"
import { Sparkle } from "@phosphor-icons/react"

export function TopBar() {
  const { language } = useLanguage()
  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border/40">
      <div className="max-w-2xl lg:max-w-5xl mx-auto h-14 px-4 sm:px-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-semibold tracking-tight">
          <Sparkle size={18} weight="fill" className="text-accent" />
          <span>
            <span className="text-accent">Danica</span>{" "}
            <span>IT</span>
          </span>
        </div>
        <LanguageSwitcher />
      </div>
    </header>
  )
}
