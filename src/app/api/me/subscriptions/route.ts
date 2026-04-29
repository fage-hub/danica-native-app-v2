import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { getUserSubscriptions } from "@/lib/queries"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  const items = await getUserSubscriptions(session.user.id)
  return NextResponse.json({ items })
}
