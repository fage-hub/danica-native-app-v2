import { SignJWT, jwtVerify } from "jose"
import { auth } from "@/auth"

const ISSUER = "danica.it"
const NATIVE_AUDIENCE = "danica.native"

function getSecret(): Uint8Array {
  const s = process.env.AUTH_SECRET
  if (!s) throw new Error("AUTH_SECRET not set")
  return new TextEncoder().encode(s)
}

export type NativeUser = {
  id: string
  email: string
  name?: string | null
}

/**
 * Sign a JWT for the mobile/native client. Stored in expo-secure-store on
 * the device; sent on every request as `Authorization: Bearer <token>`.
 */
export async function signNativeToken(user: NativeUser, ttlSeconds = 60 * 60 * 24 * 30): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  return await new SignJWT({ email: user.email, name: user.name ?? null })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuer(ISSUER)
    .setAudience(NATIVE_AUDIENCE)
    .setIssuedAt(now)
    .setExpirationTime(now + ttlSeconds)
    .sign(getSecret())
}

export async function verifyNativeToken(token: string): Promise<NativeUser | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      issuer: ISSUER,
      audience: NATIVE_AUDIENCE,
    })
    if (typeof payload.sub !== "string" || typeof payload.email !== "string") return null
    return {
      id: payload.sub,
      email: payload.email,
      name: typeof payload.name === "string" ? payload.name : null,
    }
  } catch {
    return null
  }
}

/**
 * Resolve the current user from EITHER an Auth.js cookie session OR a
 * `Authorization: Bearer <native-jwt>` header. Use this in API routes that
 * need to support both browsers and the React Native shell.
 */
export async function resolveUser(req: Request): Promise<NativeUser | null> {
  // 1. Try Auth.js session (cookie-based — works for browser).
  const session = await auth().catch(() => null)
  if (session?.user?.id && session.user.email) {
    return { id: session.user.id, email: session.user.email, name: session.user.name ?? null }
  }
  // 2. Fall back to Bearer JWT (native shell, future API consumers).
  const authHeader = req.headers.get("authorization")
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice("Bearer ".length).trim()
    if (token) {
      const user = await verifyNativeToken(token)
      if (user) return user
    }
  }
  return null
}
