import crypto from "node:crypto"

/**
 * PayMongo webhook signature verification.
 *
 * Header `Paymongo-Signature` looks like:
 *   t=1700000000,te=test_sig_hex,li=live_sig_hex
 *
 * The signed payload is `${timestamp}.${rawBody}`, HMAC-SHA256 with the
 * webhook secret. `te` is the test-mode signature, `li` the live-mode one.
 *
 * Docs: https://developers.paymongo.com/docs/webhooks
 */

export type WebhookVerifyResult =
  | { ok: true; timestamp: number; mode: "test" | "live" }
  | { ok: false; reason: string }

export function verifyPayMongoSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string,
  toleranceSeconds: number = 300,
): WebhookVerifyResult {
  if (!signatureHeader) return { ok: false, reason: "missing_signature_header" }
  if (!secret) return { ok: false, reason: "missing_webhook_secret" }

  const parts = signatureHeader.split(",").reduce<Record<string, string>>((acc, part) => {
    const [k, v] = part.split("=")
    if (k && v) acc[k.trim()] = v.trim()
    return acc
  }, {})

  const timestampStr = parts.t
  if (!timestampStr) return { ok: false, reason: "missing_timestamp" }

  const timestamp = parseInt(timestampStr, 10)
  if (isNaN(timestamp)) return { ok: false, reason: "invalid_timestamp" }

  const nowSec = Math.floor(Date.now() / 1000)
  if (Math.abs(nowSec - timestamp) > toleranceSeconds) {
    return { ok: false, reason: "timestamp_out_of_tolerance" }
  }

  const testSig = parts.te
  const liveSig = parts.li
  if (!testSig && !liveSig) return { ok: false, reason: "no_signatures_present" }

  const data = `${timestamp}.${rawBody}`
  const computed = crypto.createHmac("sha256", secret).update(data).digest("hex")
  const computedBuf = Buffer.from(computed, "hex")

  for (const [mode, sig] of [["test", testSig], ["live", liveSig]] as const) {
    if (!sig) continue
    let sigBuf: Buffer
    try {
      sigBuf = Buffer.from(sig, "hex")
    } catch {
      continue
    }
    if (sigBuf.length === computedBuf.length && crypto.timingSafeEqual(computedBuf, sigBuf)) {
      return { ok: true, timestamp, mode }
    }
  }

  return { ok: false, reason: "signature_mismatch" }
}
