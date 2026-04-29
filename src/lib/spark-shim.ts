"use client"

/**
 * Spark API compatibility shim.
 *
 * The original codebase used GitHub Spark's runtime (`@github/spark/hooks`,
 * `window.spark.*`). In our Next.js port we replace those with:
 *  - useKV     → localStorage-backed React state (per-browser persistence)
 *  - spark.kv  → same, callable from non-React code
 *  - spark.user → no-op stub (real auth comes from next-auth's useSession)
 *  - spark.llm → POST to /api/ai-chat
 *
 * Marketing components that don't need cross-device sync work fine with
 * localStorage. Anything that needs server persistence should call our
 * REST APIs directly (see /api/* routes).
 */

import { useEffect, useState } from "react"

const PREFIX = "danica.kv."

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = window.localStorage.getItem(PREFIX + key)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    /* quota or private mode */
  }
}

function remove(key: string): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.removeItem(PREFIX + key)
  } catch {
    /* ignore */
  }
}

export function useKV<T>(
  key: string,
  defaultValue: T,
): [T, (next: T | ((prev: T | undefined) => T)) => void, () => void] {
  const [value, setValue] = useState<T>(defaultValue)

  useEffect(() => {
    setValue(read(key, defaultValue))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const update = (next: T | ((prev: T | undefined) => T)) => {
    setValue(prev => {
      const resolved = typeof next === "function" ? (next as (p: T | undefined) => T)(prev) : next
      write(key, resolved)
      return resolved
    })
  }

  const del = () => {
    remove(key)
    setValue(defaultValue)
  }

  return [value, update, del]
}

// Synchronous KV used by non-React modules (PaymentGateway, etc.)
const kv = {
  async get<T>(key: string): Promise<T | undefined> {
    if (typeof window === "undefined") return undefined
    return read<T | undefined>(key, undefined)
  },
  async set<T>(key: string, value: T): Promise<void> {
    write(key, value)
  },
  async delete(key: string): Promise<void> {
    remove(key)
  },
  async keys(): Promise<string[]> {
    if (typeof window === "undefined") return []
    return Object.keys(window.localStorage).filter(k => k.startsWith(PREFIX)).map(k => k.slice(PREFIX.length))
  },
}

type SparkUser = { login?: string; email?: string; isOwner?: boolean; avatarUrl?: string }

const spark = {
  kv,
  async user(): Promise<SparkUser> {
    // The real authenticated user is exposed by next-auth's useSession in
    // client components and `auth()` in server components. This is a stub
    // for legacy Spark code paths that just want to know "do we have a name".
    return {}
  },
  llmPrompt(strings: TemplateStringsArray, ...values: unknown[]): string {
    return strings.reduce((acc, s, i) => acc + s + (i < values.length ? String(values[i]) : ""), "")
  },
  async llm(prompt: string, model: string = "gpt-4o-mini", jsonMode: boolean = false): Promise<string> {
    const res = await fetch("/api/ai-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, model, jsonMode }),
    })
    if (!res.ok) {
      throw new Error(`LLM request failed: ${res.status}`)
    }
    const data = (await res.json()) as { content: string }
    return data.content
  },
}

export { spark }

// Make `spark` available globally for legacy code that calls `spark.kv.*`
// or `spark.llm` without importing.
if (typeof window !== "undefined") {
  ;(window as unknown as { spark: typeof spark }).spark = spark
}
