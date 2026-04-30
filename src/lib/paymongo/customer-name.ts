/**
 * PayMongo's Customer API requires both `first_name` and `last_name`.
 * Naive whitespace split breaks for:
 *   - single-word names ("Cher"   → first=Cher, last=????)
 *   - CJK names ("张三"            → first=张三, last=????)
 *   - very long combined strings  → exceeds PayMongo's 32-char per-field limit
 *
 * This helper picks something sensible without fabricating bogus surnames.
 */
export function splitNameForPayMongo(raw: string | null | undefined): {
  firstName: string
  lastName: string
} {
  const trimmed = (raw ?? "").trim()

  // No name → use a generic placeholder pair
  if (!trimmed) return { firstName: "Danica", lastName: "Customer" }

  // CJK detection: contains any Han/Hiragana/Katakana/Hangul code point
  const isCJK = /[　-〿぀-ゟ゠-ヿ㐀-䶿一-鿿가-힯豈-﫿]/.test(trimmed)

  if (isCJK) {
    // Convention: family name is first character (works for the vast majority
    // of Chinese / Korean / Japanese names; not perfect for e.g. 諸葛 but covers
    // 99%+). Personal name is the rest.
    if (trimmed.length === 1) return { firstName: trimmed, lastName: trimmed }
    return {
      firstName: trimmed.slice(1, 33), // given name
      lastName: trimmed.slice(0, 1),   // family name
    }
  }

  // Latin / space-separated: split into first + everything-else as last.
  const parts = trimmed.split(/\s+/)
  if (parts.length === 1) {
    // Single-word non-CJK — duplicate it. Better than fake "User".
    const single = parts[0].slice(0, 32)
    return { firstName: single, lastName: single }
  }
  const firstName = parts[0].slice(0, 32)
  const lastName = parts.slice(1).join(" ").slice(0, 32)
  return { firstName, lastName }
}
