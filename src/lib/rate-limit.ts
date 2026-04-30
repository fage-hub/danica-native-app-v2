import crypto from "node:crypto"
import { sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { rateLimitBuckets } from "@/lib/db/schema"

/**
 * Postgres-backed sliding-window rate limiter. No external dependency
 * (Upstash / Redis), at the cost of one INSERT...ON CONFLICT per call.
 *
 * For a serverless app at small/medium scale this is good enough; if you
 * need 1000+ RPS sustained on a single endpoint, swap to Upstash by
 * implementing the same `consume()` signature against `@upstash/ratelimit`.
 */

export type RateLimitResult = { ok: true } | { ok: false; retryAfterSeconds: number }

function hashIdentifier(id: string): string {
  return crypto.createHash("sha256").update(id).digest("hex").slice(0, 32)
}

export async function consume(
  bucket: string,
  identifier: string,
  limit: number,
  windowSeconds: number,
): Promise<RateLimitResult> {
  const key = `${bucket}:${hashIdentifier(identifier)}`
  const now = new Date()
  const windowStart = new Date(now.getTime() - windowSeconds * 1000)

  // Atomic upsert: if window expired, reset count to 1; otherwise increment.
  const result = await db.execute(sql`
    INSERT INTO rate_limit_buckets (key, count, window_start)
    VALUES (${key}, 1, ${now})
    ON CONFLICT (key) DO UPDATE SET
      count = CASE
        WHEN rate_limit_buckets.window_start < ${windowStart} THEN 1
        ELSE rate_limit_buckets.count + 1
      END,
      window_start = CASE
        WHEN rate_limit_buckets.window_start < ${windowStart} THEN ${now}
        ELSE rate_limit_buckets.window_start
      END
    RETURNING count, window_start
  `)

  const row = (result as unknown as Array<{ count: number; window_start: Date }>)[0]
  if (!row) return { ok: true } // shouldn't happen; fail-open if it does

  if (row.count > limit) {
    const elapsed = Math.floor((now.getTime() - new Date(row.window_start).getTime()) / 1000)
    const retryAfterSeconds = Math.max(1, windowSeconds - elapsed)
    return { ok: false, retryAfterSeconds }
  }
  return { ok: true }
}

export function clientIdentifier(req: Request): string {
  // Vercel forwards the real client IP in `x-forwarded-for`; fall back to
  // x-real-ip and finally a static "unknown" so we still rate-limit.
  const xff = req.headers.get("x-forwarded-for")
  if (xff) return xff.split(",")[0].trim()
  const xri = req.headers.get("x-real-ip")
  if (xri) return xri
  return "unknown"
}
