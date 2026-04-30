"use client"

import { createContext, useContext, useMemo, ReactNode } from 'react'
import { useKV } from '@/lib/spark-shim'
import { Language, getTranslation } from '@/lib/i18n'

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: ReturnType<typeof getTranslation>
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useKV<Language>('app-language', 'zh')
  const currentLanguage = language || 'zh'

  // Stable context value — without useMemo every consumer re-renders on every
  // parent render because the {language, setLanguage, t} object identity
  // changes each time.
  const value = useMemo(
    () => ({
      language: currentLanguage,
      setLanguage,
      t: getTranslation(currentLanguage),
    }),
    [currentLanguage, setLanguage],
  )

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
