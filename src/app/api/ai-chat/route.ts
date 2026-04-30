import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/auth"
import { consume, clientIdentifier } from "@/lib/rate-limit"

export const runtime = "nodejs"

const schema = z.object({
  prompt: z.string().min(1).max(4000),
  model: z.string().max(50).optional(),
})

/**
 * AI chat fallback. The original Spark app called `spark.llm()` which routed
 * to whichever LLM Spark hosted. In our Next.js port we surface a simple
 * stub that returns canned content unless an OPENAI_API_KEY is configured.
 */
export async function POST(req: NextRequest) {
  // Strict rate limit — even if the user is authed, AI calls cost money.
  const session = await auth().catch(() => null)
  const identity = session?.user?.id ?? clientIdentifier(req)
  const rl = await consume("ai-chat", identity, 20, 60) // 20 / minute
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
  const { prompt } = parsed.data

  const apiKey = process.env.OPENAI_API_KEY
  if (apiKey) {
    try {
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 400,
          temperature: 0.7,
        }),
      })
      const data = await r.json()
      const content = data.choices?.[0]?.message?.content as string | undefined
      if (content) return NextResponse.json({ content })
    } catch (err) {
      console.error("ai-chat openai error:", err)
    }
  }

  return NextResponse.json({
    content:
      "Hi! I'm Danica's product assistant. To enable my full conversational abilities, the team is in the process of finalizing the LLM provider — please reach out to support@danica.it for product questions in the meantime, or browse the Compare tab for a feature comparison.",
  })
}
