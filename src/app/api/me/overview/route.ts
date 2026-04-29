import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { getUserOverview } from "@/lib/queries"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  const data = await getUserOverview(session.user.id)
  return NextResponse.json(data)
}
