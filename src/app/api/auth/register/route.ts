import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { hash } from "bcryptjs"
import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  name: z.string().min(1).max(100),
  company: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
})

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const { email, password, name, company, phone } = parsed.data
  const emailLower = email.toLowerCase()

  const existing = await db.query.users.findFirst({ where: eq(users.email, emailLower) })
  if (existing) {
    return NextResponse.json({ error: "email_already_registered" }, { status: 409 })
  }

  const passwordHash = await hash(password, 12)
  const [user] = await db.insert(users).values({
    email: emailLower,
    passwordHash,
    name,
    company: company || null,
    phone: phone || null,
  }).returning({ id: users.id, email: users.email })

  return NextResponse.json({ id: user.id, email: user.email }, { status: 201 })
}
