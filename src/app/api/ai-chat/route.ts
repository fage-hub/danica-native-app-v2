import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

/**
 * AI chat fallback. The original Spark app called `spark.llm()` which routed
 * to whichever LLM Spark hosted. In our Next.js port we surface a simple
 * stub that returns canned content unless an OPENAI_API_KEY is configured.
 *
 * To enable real responses, add OPENAI_API_KEY (or wire any provider) and
 * uncomment the live-call branch below.
 */
export async function POST(req: NextRequest) {
  const { prompt } = (await req.json().catch(() => ({}))) as { prompt?: string }
  if (!prompt) {
    return NextResponse.json({ error: "prompt is required" }, { status: 400 })
  }

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

  // Fallback: canned response so the UI still works in test mode.
  return NextResponse.json({
    content:
      "Hi! I'm Danica's product assistant. To enable my full conversational abilities, the team is in the process of finalizing the LLM provider — please reach out to support@danica.it for product questions in the meantime, or browse the Compare tab for a feature comparison.",
  })
}
