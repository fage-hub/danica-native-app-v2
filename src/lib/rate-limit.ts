import crypto from "node:crypto"
import { sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { rateLimitBuckets } from "@/lib/db/schema"

/**
 * Postgres-backed sliding-window rate limiter using Drizzle's typed
 * upsert. One INSERT...ON CONFLICT DO UPDATE per call.
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

  try {
    const [row] = await db
      .insert(rateLimitBuckets)
      .values({ key, count: 1, windowStart: now })
      .onConflictDoUpdate({
        target: rateLimitBuckets.key,
        set: {
          count: sql`CASE
            WHEN ${rateLimitBuckets.windowStart} < ${windowStart}
            THEN 1
            ELSE ${rateLimitBuckets.count} + 1
          END`,
          windowStart: sql`CASE
            WHEN ${rateLimitBuckets.windowStart} < ${windowStart}
            THEN ${now}
            ELSE ${rateLimitBuckets.windowStart}
          END`,
        },
      })
      .returning()

    if (!row) return { ok: true } // fail-open

    if (row.count > limit) {
      const elapsed = Math.floor((now.getTime() - row.windowStart.getTime()) / 1000)
      const retryAfterSeconds = Math.max(1, windowSeconds - elapsed)
      return { ok: false, retryAfterSeconds }
    }
    return { ok: true }
  } catch (err) {
    console.error("[rate-limit] consume failed, failing open:", err)
    return { ok: true }
  }
}

export function clientIdentifier(req: Request): string {
  const xff = req.headers.get("x-forwarded-for")
  if (xff) return xff.split(",")[0].trim()
  const xri = req.headers.get("x-real-ip")
  if (xri) return xri
  return "unknown"
}
