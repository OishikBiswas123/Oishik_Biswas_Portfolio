"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

const greetings = [
  "hello",
  "hi",
  "bonjour",
  "hola",
  "ciao",
  "hallo",
  "olá",
  "namaste",
  "নমস্কার",
  "こんにちは",
  "你好",
  "merhaba",
]

const HOLD_MS = 2000
const ROLL_S = 0.5
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/**
 * Rolling greeting word (gauravi-style): a fixed-height window where the word
 * slides up and out while the next slides up and in, anchored to the right
 * edge. The window's width tweens to each word's real measured width, so the
 * line glides like the reference site — no transform scaling, no flicker.
 * Static "hello" for visitors who prefer reduced motion.
 */
export function GreetingCycler() {
  const [index, setIndex] = useState(0)
  const [widths, setWidths] = useState<number[] | null>(null)
  const measurersRef = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const t = window.setInterval(() => {
      setIndex((i) => (i + 1) % greetings.length)
    }, HOLD_MS)
    return () => window.clearInterval(t)
  }, [])

  // Measure every word once fonts are ready (system fonts render the
  // non-Latin greetings), so each width tween lands exactly.
  useEffect(() => {
    let cancelled = false
    const measure = () => {
      if (cancelled) return
      setWidths(measurersRef.current.map((el) => (el ? el.getBoundingClientRect().width : 0)))
    }
    if (typeof document !== "undefined" && document.fonts && document.fonts.status !== "loaded") {
      document.fonts.ready.then(measure)
    } else {
      measure()
    }
    return () => {
      cancelled = true
    }
  }, [])

  const word = greetings[index]
  const measured = widths !== null

  return (
    <motion.span
      className="relative inline-block overflow-hidden align-bottom"
      style={{ height: "1.45em" }}
      animate={widths ? { width: widths[index] } : undefined}
      transition={{ duration: ROLL_S, ease: EASE }}
    >
      {/* hidden measurers holding every word at its true rendered width */}
      <span aria-hidden className="pointer-events-none absolute left-0 top-0 invisible">
        {greetings.map((g, i) => (
          <span
            key={g}
            ref={(el) => {
              measurersRef.current[i] = el
            }}
            className="font-display font-semibold whitespace-pre"
          >
            {g}
          </span>
        ))}
      </span>

      {/* until fonts are measured, render the word plainly (same metrics, no jump) */}
      {!measured && <span className="font-display font-semibold whitespace-pre">{word}</span>}

      {/* measured mode: words roll through, anchored to the right edge */}
      {measured && (
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={word}
            className="absolute right-0 bottom-0 whitespace-nowrap font-display font-semibold will-change-transform"
            initial={{ y: "115%" }}
            animate={{ y: 0 }}
            exit={{ y: "-115%" }}
            transition={{ duration: ROLL_S, ease: EASE }}
          >
            {word}
          </motion.span>
        </AnimatePresence>
      )}
    </motion.span>
  )
}
