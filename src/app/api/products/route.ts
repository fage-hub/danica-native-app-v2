import { NextResponse } from "next/server"
import { getActiveProducts } from "@/lib/queries"

export const revalidate = 60

export async function GET() {
  const items = await getActiveProducts()
  return NextResponse.json({ items })
}
