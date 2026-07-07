"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"

const images = [
  { src: "/pfp/photo-1.jpg", alt: "Oishik" },
  { src: "/cartoon/avatar-1.svg", alt: "Oishik avatar" },
  { src: "/pfp/photo-2.jpg", alt: "Oishik" },
  { src: "/cartoon/avatar-2.svg", alt: "Oishik avatar" },
  { src: "/pfp/photo-3.jpg", alt: "Oishik" },
  { src: "/cartoon/avatar-3.svg", alt: "Oishik avatar" },
  { src: "/pfp/photo-4.jpg", alt: "Oishik" },
  { src: "/cartoon/avatar-4.svg", alt: "Oishik avatar" },
  { src: "/pfp/photo-5.jpg", alt: "Oishik" },
  { src: "/cartoon/avatar-5.svg", alt: "Oishik avatar" },
]

const stickerGifs = [
  "/Gif/sticker-1.gif",
  "/Gif/sticker-2.gif",
  "/Gif/sticker-3.gif",
  "/Gif/sticker-4.gif",
  "/Gif/sticker-5.gif",
]

type AnimKey = "flip" | "scale" | "slide" | "blur" | "spin" | "shrink" | "wipe" | "elastic" | "fade" | "glitch"
const ANIMS: AnimKey[] = ["flip", "scale", "slide", "blur", "spin", "shrink", "wipe", "elastic", "fade", "glitch"]

export function PfpSwitcher() {
  const btnRef = useRef<HTMLButtonElement>(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const [current, setCurrent] = useState(0)
  const [next, setNext] = useState<number | null>(null)
  const [anim, setAnim] = useState<AnimKey | null>(null)
  const [phase, setPhase] = useState<"idle" | "exiting" | "entering">("idle")
  const [gifIdx, setGifIdx] = useState(0)
  const [burst, setBurst] = useState<{ idx: number; x: number; y: number } | null>(null)

  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const resetToDefault = useCallback(() => {
    setCurrent(0)
    setNext(null)
    setAnim(null)
    setPhase("idle")
    setBurst(null)
  }, [])

  const startResetTimer = useCallback(() => {
    if (resetTimer.current) clearTimeout(resetTimer.current)
    resetTimer.current = setTimeout(resetToDefault, 20000)
  }, [resetToDefault])

  useEffect(() => {
    startResetTimer()
    return () => { if (resetTimer.current) clearTimeout(resetTimer.current) }
  }, [current, startResetTimer])

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (phase !== "idle") return

      const rect = e.currentTarget.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const n = (current + 1) % images.length
      const a = ANIMS[n % ANIMS.length]
      const g = gifIdx % stickerGifs.length

      setNext(n)
      setAnim(a)
      setGifIdx((i) => i + 1)
      setPhase("exiting")
      setBurst({ idx: g, x: cx, y: cy })

      setTimeout(() => setPhase("entering"), 250)
      setTimeout(() => {
        setCurrent(n)
        setNext(null)
        setAnim(null)
        setPhase("idle")
      }, 550)
      setTimeout(() => setBurst(null), 1200)
    },
    [current, phase, gifIdx],
  )

  return (
    <>
      {mounted && burst !== null && createPortal(
        <div
          className="pfp-burst-overlay"
          style={{ position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none" }}
        >
          <img
            src={stickerGifs[burst.idx]}
            alt=""
            className="pfp-sticker-burst"
            style={{
              position: "absolute",
              left: burst.x,
              top: burst.y,
              width: "min(500px, 80vw)",
              height: "auto",
              maxHeight: "80vh",
              objectFit: "contain",
            }}
            draggable={false}
          />
        </div>,
        document.body,
      )}

      <button
        ref={btnRef}
        onClick={handleClick}
        className="flex-shrink-0 relative w-12 h-12 rounded-xl overflow-hidden border-2 border-text-primary/30 hover:border-text-primary/60 transition-colors outline-none focus-visible:ring-2 ring-text-primary/40"
        title="Click to switch"
      >
        <img
          src={images[current].src}
          alt={images[current].alt}
          className={cn(
            "absolute inset-0 w-full h-full object-cover rounded-xl select-none pointer-events-none",
            phase === "exiting" && anim && `pfp-exit-${anim}`,
          )}
          style={{ zIndex: phase === "idle" || phase === "exiting" ? 1 : 0 }}
        />

        {next !== null && (
          <img
            src={images[next].src}
            alt={images[next].alt}
            className={cn(
              "absolute inset-0 w-full h-full object-cover rounded-xl select-none pointer-events-none",
              phase === "entering" && anim && `pfp-enter-${anim}`,
            )}
            style={{ zIndex: 2 }}
          />
        )}
      </button>
    </>
  )
}
