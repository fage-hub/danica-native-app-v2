import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMoney(amount: number, currency: string = "PHP"): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 2,
  }).format(amount / 100)
}

/**
 * Compact token formatter — automatically converts to local units:
 *  en: 1,500,000 → "1.5M",  100,000 → "100K"
 *  zh: 1,500,000 → "150万",  100,000 → "10万"
 */
export function formatTokens(amount: number, language: "en" | "zh" = "en"): string {
  const locale = language === "zh" ? "zh-CN" : "en-US"
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount)
}

