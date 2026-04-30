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
    // Drizzle wraps postgres-js errors. Walk the cause chain looking for
    // SQLSTATE 23505 (unique violation), and also pattern-match the message
    // for `users_email_lower_idx` to be defensive against version drift.
    type Errish = { code?: string; constraint_name?: string; message?: string; cause?: unknown }
    function walk(e: unknown): boolean {
      let cur: Errish | null = e as Errish
      let depth = 0
      while (cur && depth < 5) {
        if (cur.code === "23505") return true
        if (cur.constraint_name === "users_email_lower_idx") return true
        if (typeof cur.message === "string" && cur.message.includes("users_email_lower_idx")) return true
        cur = cur.cause as Errish | null
        depth++
      }
      return false
    }
    if (walk(err)) {
      return NextResponse.json({ error: "email_already_registered" }, { status: 409 })
    }
    console.error("[register] insert failed:", err)
    return NextResponse.json({ error: "internal" }, { status: 500 })
  }
}
