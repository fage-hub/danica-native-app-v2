import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { hash } from "bcryptjs"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { consume, clientIdentifier } from "@/lib/rate-limit"

const schema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(100),
  name: z.string().min(1).max(100),
  company: z.string().max(100).optional().or(z.literal("")),
  phone: z
    .string()
    .max(20)
    .regex(/^[+0-9 ()\-]*$/, "phone must contain only digits, spaces, +, (, ), -")
    .optional()
    .or(z.literal("")),
})

export async function POST(req: NextRequest) {
  // Rate limit BEFORE bcrypt (bcrypt-12 is expensive — don't let attackers
  // burn your CPU). 5 registrations per hour per IP is plenty for legit use.
  const rl = await consume("register", clientIdentifier(req), 5, 60 * 60)
  if (!rl.ok) {
    return NextResponse.json(
      { error: "rate_limited", retryAfterSeconds: rl.retryAfterSeconds },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } },
    )
  }

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const { email, password, name, company, phone } = parsed.data
  const emailLower = email.toLowerCase()

  const passwordHash = await hash(password, 12)

  // Atomic insert. The unique index is on lower(email), so we catch the
  // 23505 constraint violation rather than using onConflictDoNothing(target)
  // (which expects a column-level unique, not a functional one).
  try {
    const inserted = await db
      .insert(users)
      .values({
        email: emailLower,
        passwordHash,
        name,
        company: company || null,
        phone: phone || null,
      })
      .returning({ id: users.id, email: users.email })

    if (inserted.length === 0) {
      return NextResponse.json({ error: "internal" }, { status: 500 })
    }
    return NextResponse.json({ id: inserted[0].id, email: inserted[0].email }, { status: 201 })
  } catch (err) {
    // Postgres unique-violation = 23505. postgres-js exposes it as `.code`.
    const code = (err as { code?: string })?.code
    if (code === "23505") {
      return NextResponse.json({ error: "email_already_registered" }, { status: 409 })
    }
    console.error("[register] insert failed:", err)
    return NextResponse.json({ error: "internal" }, { status: 500 })
  }
}
