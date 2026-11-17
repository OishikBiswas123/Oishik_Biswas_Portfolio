"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { curtainPhrases } from "@/lib/data"

type Phase = "idle" | "covered" | "closing" | "opening"

const CLOSE_S = 0.5
const HOLD_MS = 450
const OPEN_S = 0.65
const LANDING_HOLD_MS = 1600
const ROUTE_WAIT_MS = 1200

let navigateFn: ((href: string) => void) | null = null

/** Navigate with the curtain animation — for programmatic navigation. */
export function curtainNavigate(href: string) {
  if (navigateFn) navigateFn(href)
  else window.location.href = href
}

function phraseFor(pathname: string): string {
  const clean = (pathname || "/").split("#")[0].split("?")[0]
  const normalized = clean.length > 1 && clean.endsWith("/") ? clean.slice(0, -1) : clean
  for (const item of curtainPhrases) {
    if (item.prefix === "/") continue
    if (normalized === item.prefix || normalized.startsWith(`${item.prefix}/`)) {
      return item.phrase
    }
  }
  return curtainPhrases.find((item) => item.prefix === "/")?.phrase ?? "hello, daydreamer."
}

export function CurtainTransition() {
  const router = useRouter()
  const pathname = usePathname()
  // Start covered so the very first paint (SSR included) shows the curtain —
  // gauravi-style landing reveal. The page beneath is already rendering.
  const [phase, setPhase] = useState<Phase>("covered")
  const [initialY, setInitialY] = useState<"0%" | "-102%">("0%")
  const [phrase, setPhrase] = useState(() => phraseFor(pathname))

  const prefersReducedMotion = () =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

  const busyRef = useRef(false)
  const targetPathRef = useRef<string | null>(null)
  const timersRef = useRef<number[]>([])

  const clearTimers = useCallback(() => {
    for (const t of timersRef.current) window.clearTimeout(t)
    timersRef.current = []
  }, [])

  useEffect(() => clearTimers, [clearTimers])

  // Landing hold: curtain is covering at mount; lift it after a beat.
  // (Reduced-motion visitors never see it — globals.css hides the overlay.)
  useEffect(() => {
    busyRef.current = true
    const t = window.setTimeout(() => {
      busyRef.current = false
      setPhase("opening")
    }, LANDING_HOLD_MS)
    return () => window.clearTimeout(t)
  }, [])

  // Route resolution: once the destination has rendered, hold a beat, then lift.
  useEffect(() => {
    if (phase !== "covered" || !targetPathRef.current) return
    if (pathname !== targetPathRef.current) return
    targetPathRef.current = null
    const t = window.setTimeout(() => {
      busyRef.current = false
      setPhase("opening")
    }, HOLD_MS)
    return () => window.clearTimeout(t)
  }, [pathname, phase])

  const start = useCallback(
    (href: string) => {
      if (busyRef.current) return
      const url = new URL(href, window.location.href)
      // Same-page anchors never get the curtain — Lenis / native scroll handles them.
      if (url.pathname === window.location.pathname) {
        router.push(`${url.pathname}${url.search}${url.hash}`)
        return
      }
      busyRef.current = true
      setInitialY("-102%")
      setPhrase(phraseFor(url.pathname))
      targetPathRef.current = url.pathname
      setPhase("closing")
      router.push(`${url.pathname}${url.search}${url.hash}`)
      // Once the panels have closed, hold the phrase before lifting.
      const covered = window.setTimeout(() => setPhase("covered"), CLOSE_S * 1000)
      timersRef.current.push(covered)
      // Stuck-guard: never leave the visitor under a covered curtain.
      const safety = window.setTimeout(() => {
        if (busyRef.current && targetPathRef.current === url.pathname) {
          busyRef.current = false
          targetPathRef.current = null
          setPhase("opening")
        }
      }, CLOSE_S * 1000 + ROUTE_WAIT_MS)
      timersRef.current.push(safety)
    },
    [router],
  )

  // Register the programmatic-navigation hook.
  useEffect(() => {
    navigateFn = start
    return () => {
      navigateFn = null
    }
  }, [start])

  // Intercept internal <a> clicks (capture phase, before Lenis / default nav).
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (prefersReducedMotion()) return
      if (e.defaultPrevented) return
      if (e.button !== 0 || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return
      const anchor = (e.target as HTMLElement | null)?.closest?.("a")
      if (!anchor) return
      if (anchor.target && anchor.target !== "_self") return
      if (anchor.hasAttribute("download")) return
      const href = anchor.getAttribute("href")
      if (!href) return
      if (href.startsWith("#")) return
      if (/^(mailto:|tel:|javascript:)/i.test(href)) return
      const url = new URL(anchor.href, window.location.href)
      if (url.origin !== window.location.origin) return
      // Same page (incl. /#projects, /#contact while on "/") → no curtain.
      if (url.pathname === window.location.pathname) return
      if (busyRef.current) {
        e.preventDefault()
        return
      }
      e.preventDefault()
      start(`${url.pathname}${url.search}${url.hash}`)
    }
    document.addEventListener("click", onClick, true)
    return () => document.removeEventListener("click", onClick, true)
  }, [start])

  // Browser back/forward: cover instantly, reveal when the route settles.
  useEffect(() => {
    const onPop = () => {
      if (prefersReducedMotion()) return
      if (busyRef.current) return
      busyRef.current = true
      setInitialY("0%")
      setPhrase(phraseFor(window.location.pathname))
      targetPathRef.current = window.location.pathname
      setPhase("covered")
      const safety = window.setTimeout(() => {
        if (busyRef.current) {
          busyRef.current = false
          targetPathRef.current = null
          setPhase("opening")
        }
      }, ROUTE_WAIT_MS)
      timersRef.current.push(safety)
    }
    window.addEventListener("popstate", onPop)
    return () => window.removeEventListener("popstate", onPop)
  }, [])

  if (phase === "idle") return null

  return (
    <motion.div
      className="curtain-overlay fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, var(--sky1) 0%, var(--sky2) 38%, var(--sky3) 64%, var(--sky4) 84%)",
        boxShadow: "0 30px 80px rgba(0, 0, 0, 0.35)",
      }}
      initial={{ y: initialY }}
      animate={{ y: phase === "opening" ? "-102%" : "0%" }}
      transition={{
        duration: phase === "opening" ? OPEN_S : CLOSE_S,
        ease: [0.76, 0, 0.24, 1],
      }}
      onAnimationComplete={() => {
        if (phase === "opening") {
          busyRef.current = false
          setPhase("idle")
        }
      }}
    >
      {/* Fabric-fold shading */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0px, rgba(0,0,0,0.05) 28px, rgba(255,255,255,0.06) 56px)",
        }}
      />
      {/* Bottom hem shadow */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/15 to-transparent" />

      <motion.p
        className="px-6 text-center font-display text-3xl italic sm:text-5xl md:text-6xl"
        style={{ color: "var(--text-primary)" }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: phase === "covered" ? 1 : 0, y: phase === "covered" ? 0 : 16 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {phrase}
      </motion.p>

      <span
        className="absolute bottom-7 left-1/2 -translate-x-1/2 font-display text-sm italic tracking-[0.35em]"
        style={{ color: "var(--text-primary)", opacity: 0.55 }}
      >
        ob
      </span>
    </motion.div>
  )
}
