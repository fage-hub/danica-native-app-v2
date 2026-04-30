import { NextRequest, NextResponse } from "next/server"
import { resolveUser } from "@/lib/native-auth"
import { getUserSubscriptions } from "@/lib/queries"

export async function GET(req: NextRequest) {
  const user = await resolveUser(req)
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  const items = await getUserSubscriptions(user.id)
  return NextResponse.json({ items })
}
