import { projects, skills, blogPosts, personalInfo } from "@/lib/data"

/**
 * Ask-AI endpoint — streams answers as SSE frames, gauravi-style:
 *   data: {"text": "..."}  (many of them, word batches)
 *   data: [DONE]
 *
 * POST body: { messages: [{ role: "user" | "assistant", content: string }] }
 * The Gemini key lives server-side only (env var GEMINI_API_KEY).
 * No database, nothing stored — the client sends the rolling history each time.
 */

export const dynamic = "force-dynamic"

const MODEL = "gemini-3.5-flash-lite"
const GEMINI_URL = (key: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?alt=sse&key=${key}`

const MAX_HISTORY = 12 // turns sent to the model (client may send more, we trim)
const MAX_TOKENS = 400 // keeps answers chat-sized (and read-aloud short)

/* ── gentle free-tier guard: ~20 messages per IP per 5 minutes ── */
const WINDOW_MS = 5 * 60 * 1000
const MAX_PER_WINDOW = 20
const hits = new Map<string, number[]>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent)
    return true
  }
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 500) {
    // keep the map from growing forever on a busy day
    for (const [k, v] of hits) if (v.every((t) => now - t > WINDOW_MS)) hits.delete(k)
  }
  return false
}

/* ── the assistant's brain: Oishik's real portfolio facts ── */
function buildSystemPrompt(): string {
  const projectList = projects
    .map(
      (p) =>
        `- ${p.title} (${p.category}): ${p.description} Built with ${p.techStack.join(", ")}.` +
        (p.liveUrl ? ` Live: ${p.liveUrl}.` : "") +
        (p.githubUrl ? ` Code: ${p.githubUrl}.` : "")
    )
    .join("\n")

  const blog = blogPosts
    .map((b) => `- "${b.title}" (${b.date}, ${b.readTime} min read): ${b.excerpt}`)
    .join("\n")

  return `You are Oishik Biswas's portfolio assistant, helping visitors explore his work. You are warm, a little playful (the site's vibe is a daydreamer's sky), and concise.

ABOUT OISHIK
- ${personalInfo.name}, ${personalInfo.title}. Based in ${personalInfo.location}.
- He builds games, apps and websites end-to-end: Unity games, Kotlin Android apps with Node.js backends, and Next.js websites. He also handles branding, SEO, Play Store publishing and deployment himself.
- Skills: ${skills.join(", ")}.

PROJECTS (link pages at https://oishikbiswas.vercel.app/projects)
${projectList}

WRITING (https://oishikbiswas.vercel.app/blog)
${blog}

OTHER PAGES
- Gallery: https://oishikbiswas.vercel.app/gallery — photos and videos of Oishik
- About: https://oishikbiswas.vercel.app/about — the human behind the code
- Contact: https://oishikbiswas.vercel.app/#contact — email ${personalInfo.email}, WhatsApp ${personalInfo.social.whatsapp}, also on GitHub (${personalInfo.social.github}), LinkedIn (${personalInfo.social.linkedin}), Instagram (${personalInfo.social.instagram}), X (${personalInfo.social.x})

RULES
- Only answer questions about Oishik, his projects, skills, blog, gallery, or how to reach/hire him. If asked anything else (homework, general knowledge, coding help, other people), politely steer back: you can only talk about Oishik and his work, then offer a starter topic.
- Keep answers short and conversational: 1–3 sentences unless the visitor clearly wants detail. They may be read aloud, so write for listening: no markdown, no bullet lists, no emojis — plain spoken sentences.
- Speak of Oishik in the third person ("Oishik built...") like a friendly guide, never impersonate him.
- When a project fits the question, name it and point to its page. Never invent projects, numbers, dates or links — only use the facts above.
- If you don't know something about Oishik, say so honestly and suggest the contact page.`
}

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-real-ip")?.split(",")[0]?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "local"

  if (rateLimited(ip)) {
    return streamText("The assistant is catching its breath — try again in a few minutes. ☁️")
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return streamText("The assistant isn't connected yet — Oishik still needs to add its API key on the server.")
  }

  let messages: ChatMessage[]
  try {
    const body = (await request.json()) as { messages?: ChatMessage[] }
    messages = (body.messages ?? [])
      .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .slice(-MAX_HISTORY)
      .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }))
  } catch {
    return streamText("Hmm, that message arrived scrambled — try again?")
  }

  if (messages.length === 0) {
    return streamText("Say anything and I'll tell you about Oishik's work.")
  }

  const geminiMessages = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }))

  let upstream: Response
  try {
    upstream = await fetch(GEMINI_URL(apiKey), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: buildSystemPrompt() }] },
        contents: geminiMessages,
        generationConfig: {
          maxOutputTokens: MAX_TOKENS,
          temperature: 0.7,
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
        ],
      }),
    })
  } catch {
    return streamText("The assistant couldn't reach its brain just now — try again in a moment.")
  }

  if (!upstream.ok || !upstream.body) {
    const status = upstream.status
    if (status === 429) {
      return streamText("The assistant is catching its breath — try again in a few minutes. ☁️")
    }
    return streamText("Something went wrong inside the clouds. Try again in a moment.")
  }

  // Re-stream: parse Gemini's SSE frames, emit our own simple text frames.
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()
  const reader = upstream.body.getReader()
  let buffer = ""

  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      const { done, value } = await reader.read()
      if (done) {
        controller.enqueue(encoder.encode("data: [DONE]\n\n"))
        controller.close()
        return
      }
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split("\n")
      buffer = lines.pop() ?? ""
      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed.startsWith("data:")) continue
        const payload = trimmed.slice(5).trim()
        if (!payload) continue
        try {
          const json = JSON.parse(payload) as {
            candidates?: { content?: { parts?: { text?: string }[] } }[]
          }
          const text = json.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? ""
          if (text) controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`))
        } catch {
          // partial or non-JSON frame — skip
        }
      }
    },
    cancel() {
      reader.cancel()
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  })
}

/** Small helper: wrap a one-off string as a proper SSE response. */
function streamText(text: string): Response {
  const encoder = new TextEncoder()
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`))
      controller.enqueue(encoder.encode("data: [DONE]\n\n"))
      controller.close()
    },
  })
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
    },
  })
}
