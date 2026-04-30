import { NextRequest, NextResponse } from "next/server"
import crypto from "node:crypto"
import { z } from "zod"
import { db } from "@/lib/db"
import { contactSubmissions } from "@/lib/db/schema"
import { auth } from "@/auth"
import { consume, clientIdentifier } from "@/lib/rate-limit"

export const runtime = "nodejs"

const schema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email().max(255),
  phone: z.string().max(50).optional().or(z.literal("")),
  interest: z.string().max(100).optional(),
  message: z.string().min(5).max(5000),
})

export async function POST(req: NextRequest) {
  const ip = clientIdentifier(req)
  const rl = await consume("contact", ip, 5, 60 * 60) // 5 / hour / IP
  if (!rl.ok) {
    return NextResponse.json(
      { error: "rate_limited", retryAfterSeconds: rl.retryAfterSeconds },
      { status: 429 },
    )
  }

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const { name, email, phone, interest, message } = parsed.data

  const session = await auth().catch(() => null)

  await db.insert(contactSubmissions).values({
    userId: session?.user?.id ?? null,
    name,
    email: email.toLowerCase(),
    phone: phone || null,
    interest: interest ?? null,
    message,
    ipHash: crypto.createHash("sha256").update(ip).digest("hex").slice(0, 32),
  })

  return NextResponse.json({ ok: true })
}
