"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Send, Volume2, VolumeX, X } from "lucide-react"

/**
 * Ask-AI chat widget (gauravi-inspired, rebuilt in the sky theme).
 * - Floating sparkle launcher, bottom-right
 * - Chat panel streaming from /api/chat (SSE: data: {"text": …} → data: [DONE])
 * - Optional voice read-aloud via the browser's speechSynthesis (no backend)
 * - Everything styled from the --sky / --text CSS vars, so it follows
 *   the day/night theme automatically. position:fixed — never touches layout.
 */

interface Msg {
  role: "user" | "assistant"
  content: string
}

const STARTERS = [
  "Which project should I start with?",
  "Tell me about your games",
  "How do I reach you?",
]

const FOLLOW_UPS = ["What skills does he have?", "What has he written?", "How do I hire him?"]

const MAX_HISTORY = 12

/** Strip things that read badly aloud (urls, emoji, symbols). */
function speakable(text: string): string {
  return text
    .replace(/https?:\/\/\S+/g, "the link on screen")
    .replace(/[^\p{L}\p{N}\s.,!?'"-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
}

export function AskAI() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState("")
  const [streaming, setStreaming] = useState(false)
  const [voiceOn, setVoiceOn] = useState(true)
  const [speaking, setSpeaking] = useState(false)

  const panelRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  /* ── scroll chat to bottom on new content ── */
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, streaming])

  /* ── stop speech when closing / unmounting / leaving ── */
  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel()
    setSpeaking(false)
  }, [])

  useEffect(() => {
    const onHide = () => stopSpeaking()
    window.addEventListener("beforeunload", onHide)
    return () => {
      window.removeEventListener("beforeunload", onHide)
      window.speechSynthesis?.cancel()
      abortRef.current?.abort()
    }
  }, [stopSpeaking])

  /* ── voice read-aloud (browser built-in, free) ── */
  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return
    const clean = speakable(text)
    if (!clean) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(clean)
    u.rate = 1
    u.pitch = 1
    u.onend = () => setSpeaking(false)
    u.onerror = () => setSpeaking(false)
    setSpeaking(true)
    window.speechSynthesis.speak(u)
  }, [])

  /* ── send a message and stream the reply ── */
  const send = useCallback(
    async (text: string) => {
      const content = text.trim()
      if (!content || streaming) return
      setInput("")

      const history = [...messages, { role: "user" as const, content }]
      setMessages([...history, { role: "assistant", content: "" }])
      setStreaming(true)
      if (voiceOn) stopSpeaking()

      const controller = new AbortController()
      abortRef.current = controller

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history.slice(-MAX_HISTORY) }),
          signal: controller.signal,
        })

        if (!res.ok || !res.body) throw new Error("no stream")

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ""
        let reply = ""

        for (;;) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split("\n")
          buffer = lines.pop() ?? ""
          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed.startsWith("data:")) continue
            const payload = trimmed.slice(5).trim()
            if (!payload || payload === "[DONE]") continue
            try {
              const { text: chunk } = JSON.parse(payload) as { text?: string }
              if (chunk) {
                reply += chunk
                setMessages([...history, { role: "assistant", content: reply }])
              }
            } catch {
              // partial frame — keep reading
            }
          }
        }

        if (!reply) {
          setMessages([...history, { role: "assistant", content: "…the clouds swallowed that one. Try again?" }])
        } else if (voiceOn) {
          speak(reply)
        }
      } catch (err) {
        if ((err as Error)?.name !== "AbortError") {
          setMessages([
            ...history,
            { role: "assistant", content: "The assistant drifted offline for a second — try again. ☁️" },
          ])
        }
      } finally {
        setStreaming(false)
        abortRef.current = null
      }
    },
    [messages, streaming, voiceOn, speak, stopSpeaking]
  )

  /* ── make bare URLs tappable inside replies ── */
  const linkify = (text: string) => {
    const parts = text.split(/(https?:\/\/[^\s)]+)/g)
    return parts.map((part, i) =>
      /^https?:\/\//.test(part) ? (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:opacity-70 transition-opacity break-all"
          style={{ color: "var(--text-primary)" }}
        >
          {part.replace(/^https?:\/\//, "").replace(/\/$/, "")}
        </a>
      ) : (
        <span key={i}>{part}</span>
      )
    )
  }

  const showStarters = !streaming && messages.length === 0
  const showFollowUps =
    !streaming && messages.length > 0 && messages[messages.length - 1]?.role === "assistant" && messages[messages.length - 1]?.content

  const launcher = (
    <motion.button
      type="button"
      onClick={() => setOpen(true)}
      aria-label="Ask Oishik's AI"
      className="group fixed right-5 bottom-[5.5rem] md:bottom-5 z-50 flex items-center rounded-full px-5 py-3 shadow-lg cursor-pointer select-none"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        background: "linear-gradient(135deg, color-mix(in srgb, var(--sky2) 85%, transparent), color-mix(in srgb, var(--sky1) 90%, transparent))",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid color-mix(in srgb, var(--text-primary) 18%, transparent)",
        color: "var(--text-primary)",
        textShadow: "var(--hero-shadow)",
      }}
    >
      <span className="text-sm font-medium tracking-wide">ask Oishik&apos;s AI</span>
    </motion.button>
  )

  return (
    <>
      <AnimatePresence>{!open && launcher}</AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            data-lenis-prevent
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              e.stopPropagation()
              if (e.key === "Escape") {
                setOpen(false)
                stopSpeaking()
              }
            }}
            className="fixed z-50 flex flex-col overflow-hidden shadow-2xl rounded-3xl right-5 bottom-[5.5rem] md:right-[17.75rem] md:bottom-5"
            role="dialog"
            aria-label="Chat with Oishik's AI assistant"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: "min(380px, calc(100vw - 2.5rem))",
              height: "min(560px, calc(100dvh - 6.5rem))",
              background:
                "linear-gradient(165deg, color-mix(in srgb, var(--sky3) 26%, transparent), color-mix(in srgb, var(--sky1) 30%, transparent) 55%, color-mix(in srgb, var(--bg-base) 88%, transparent))",
              backdropFilter: "blur(22px)",
              WebkitBackdropFilter: "blur(22px)",
              border: "1px solid color-mix(in srgb, var(--text-primary) 16%, transparent)",
              color: "var(--text-primary)",
              transformOrigin: "bottom right",
            }}
          >
            {/* header */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{
                borderBottomColor: "color-mix(in srgb, var(--text-primary) 12%, transparent)",
                background: "color-mix(in srgb, var(--bg-base) 30%, transparent)",
              }}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ fontFamily: "var(--font-display)" }}>
                    Oishik&apos;s assistant
                  </p>
                  <p className="text-[11px] truncate" style={{ color: "var(--text-muted)" }}>
                    here for the daydreamers
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    const next = !voiceOn
                    setVoiceOn(next)
                    if (!next) stopSpeaking()
                  }}
                  aria-pressed={voiceOn}
                  title={voiceOn ? "Voice read-aloud: on" : "Voice read-aloud: off"}
                  className="rounded-full p-2 transition-colors cursor-pointer"
                  style={{
                    background: voiceOn ? "color-mix(in srgb, var(--sun-mid) 35%, transparent)" : "transparent",
                    color: "var(--text-secondary)",
                  }}
                >
                  {voiceOn ? <Volume2 size={17} /> : <VolumeX size={17} />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    stopSpeaking()
                  }}
                  aria-label="Close chat"
                  className="rounded-full p-2 transition-colors cursor-pointer hover:opacity-70"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {showStarters && (
                <div className="space-y-3">
                  <div
                    className="rounded-2xl rounded-tl-md px-3.5 py-3 text-sm leading-relaxed max-w-[85%]"
                    style={{
                      background: "color-mix(in srgb, var(--bg-base) 55%, transparent)",
                      border: "1px solid color-mix(in srgb, var(--text-primary) 10%, transparent)",
                    }}
                  >
                    Hello, daydreamer. I know all of Oishik&apos;s projects, his blog, his skills — ask me anything
                    about his work.
                  </div>
                  <div className="flex flex-col items-start gap-2 pt-1">
                    {STARTERS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => send(s)}
                        className="text-left text-[13px] rounded-full px-3.5 py-2 transition-colors cursor-pointer hover:opacity-80"
                        style={{
                          background: "color-mix(in srgb, var(--sky2) 35%, transparent)",
                          border: "1px solid color-mix(in srgb, var(--text-primary) 14%, transparent)",
                          color: "var(--text-primary)",
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
                  <div
                    className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed max-w-[88%] break-words ${
                      m.role === "user" ? "rounded-tr-md" : "rounded-tl-md"
                    }`}
                    style={
                      m.role === "user"
                        ? {
                            background: "color-mix(in srgb, var(--sky2) 65%, transparent)",
                            color: "var(--text-primary)",
                          }
                        : {
                            background: "color-mix(in srgb, var(--bg-base) 55%, transparent)",
                            border: "1px solid color-mix(in srgb, var(--text-primary) 10%, transparent)",
                          }
                    }
                  >
                    {m.role === "assistant" ? linkify(m.content) : m.content}
                    {m.role === "assistant" && streaming && i === messages.length - 1 && !m.content && (
                      <span className="inline-flex gap-1 py-1" aria-label="Assistant is typing">
                        {[0, 1, 2].map((d) => (
                          <motion.span
                            key={d}
                            className="w-1.5 h-1.5 rounded-full inline-block"
                            style={{ background: "var(--text-muted)" }}
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1, repeat: Infinity, delay: d * 0.18 }}
                          />
                        ))}
                      </span>
                    )}
                  </div>
                  {m.role === "assistant" && m.content && !streaming && (
                    <button
                      type="button"
                      onClick={() => (speaking ? stopSpeaking() : speak(m.content))}
                      className="mt-1 text-[11px] inline-flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                      style={{ color: "var(--text-secondary)" }}
                      title={speaking ? "Stop reading" : "Read aloud"}
                    >
                      {speaking ? <VolumeX size={13} /> : <Volume2 size={13} />}
                      {speaking ? "stop" : "listen"}
                    </button>
                  )}
                </div>
              ))}

              {showFollowUps && !speaking && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {FOLLOW_UPS.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => send(f)}
                      className="text-left text-[12px] rounded-full px-3 py-1.5 opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                      style={{
                        background: "color-mix(in srgb, var(--sky2) 25%, transparent)",
                        border: "1px solid color-mix(in srgb, var(--text-primary) 12%, transparent)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* input */}
            <form
              className="flex items-center gap-2 px-3 py-3 border-t"
              style={{ borderTopColor: "color-mix(in srgb, var(--text-primary) 12%, transparent)" }}
              onSubmit={(e) => {
                e.preventDefault()
                send(input)
              }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={streaming ? "streaming…" : "Ask about Oishik's work…"}
                disabled={streaming}
                className="flex-1 rounded-full px-4 py-2.5 text-sm outline-none min-w-0"
                style={{
                  background: "color-mix(in srgb, var(--bg-base) 60%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--text-primary) 14%, transparent)",
                  color: "var(--text-primary)",
                }}
              />
              <button
                type="submit"
                disabled={streaming || !input.trim()}
                aria-label="Send message"
                className="rounded-full p-2.5 transition-opacity cursor-pointer disabled:opacity-40 hover:opacity-80"
                style={{
                  background: "linear-gradient(135deg, var(--sky2), var(--sky1))",
                  color: "var(--text-primary)",
                }}
              >
                <Send size={16} />
              </button>
            </form>

            {speaking && (
              <button
                type="button"
                onClick={stopSpeaking}
                className="absolute bottom-[4.7rem] right-4 text-[11px] inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 cursor-pointer shadow"
                style={{
                  background: "color-mix(in srgb, var(--bg-base) 80%, transparent)",
                  color: "var(--text-secondary)",
                  border: "1px solid color-mix(in srgb, var(--text-primary) 14%, transparent)",
                }}
              >
                <VolumeX size={12} /> stop voice
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
