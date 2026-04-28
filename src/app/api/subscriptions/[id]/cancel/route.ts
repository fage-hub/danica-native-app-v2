import { NextRequest, NextResponse } from "next/server"
import { and, eq } from "drizzle-orm"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { subscriptions } from "@/lib/db/schema"

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  const { id } = await ctx.params

  const updated = await db.update(subscriptions).set({
    status: "cancelled",
    cancelledAt: new Date(),
  }).where(and(eq(subscriptions.id, id), eq(subscriptions.userId, session.user.id))).returning()

  if (updated.length === 0) {
    return NextResponse.json({ error: "not_found" }, { status: 404 })
  }
  return NextResponse.json({ ok: true })
}
