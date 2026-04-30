import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { compare } from "bcryptjs"
import { eq, sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { signNativeToken } from "@/lib/native-auth"
import { consume, clientIdentifier } from "@/lib/rate-limit"

export const runtime = "nodejs"

const schema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(1).max(200),
})

export async function POST(req: NextRequest) {
  // 10 attempts per minute per IP — bcrypt is cheap-ish but not free.
  const rl = await consume("native-login", clientIdentifier(req), 10, 60)
  if (!rl.ok) {
    return NextResponse.json(
      { error: "rate_limited", retryAfterSeconds: rl.retryAfterSeconds },
      { status: 429 },
    )
  }

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 400 })
  }
  const { email, password } = parsed.data

  // Case-insensitive lookup against the lower(email) functional index.
  const user = await db.query.users.findFirst({
    where: sql`lower(${users.email}) = ${email.toLowerCase()}`,
  })
  if (!user || !user.passwordHash) {
    // Identical response shape for "no user" and "wrong password" → no enumeration.
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 })
  }

  const ok = await compare(password, user.passwordHash)
  if (!ok) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 })
  }

  const token = await signNativeToken({ id: user.id, email: user.email, name: user.name })

  return NextResponse.json({
    token,
    user: { id: user.id, email: user.email, name: user.name },
    expiresInSeconds: 60 * 60 * 24 * 30,
  })
}
