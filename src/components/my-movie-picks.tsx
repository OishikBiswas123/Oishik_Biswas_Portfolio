"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import { moviePicks } from "@/lib/entertainment-data"

export function MyMoviePicks() {
  const [centerIndex, setCenterIndex] = useState(0)
  const swipeBarRef = useRef<HTMLDivElement>(null)

  const goTo = useCallback((index: number) => {
    setCenterIndex(((index % moviePicks.length) + moviePicks.length) % moviePicks.length)
  }, [])

  useEffect(() => {
    const bar = swipeBarRef.current
    if (!bar) return

    let startX = 0
    let startY = 0

    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
    }

    const onTouchEnd = (e: TouchEvent) => {
      const deltaX = e.changedTouches[0].clientX - startX
      const deltaY = e.changedTouches[0].clientY - startY
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        e.preventDefault()
        if (deltaX > 0) {
          goTo(centerIndex - 1)
        } else {
          goTo(centerIndex + 1)
        }
      }
    }

    bar.addEventListener('touchstart', onTouchStart, { passive: true })
    bar.addEventListener('touchend', onTouchEnd, { passive: false })

    return () => {
      bar.removeEventListener('touchstart', onTouchStart)
      bar.removeEventListener('touchend', onTouchEnd)
    }
  }, [centerIndex, goTo])

  const handleCardClick = useCallback((index: number) => {
    if (index === centerIndex) {
      window.open(moviePicks[index].url, "_blank", "noopener,noreferrer")
    } else {
      goTo(index)
    }
  }, [centerIndex, goTo])

  return (
    <section className="overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <span className="text-sm uppercase tracking-[0.25em] text-text-muted font-semibold">
          Frame by Frame
        </span>
        <p className="mt-3 text-lg text-text-secondary leading-relaxed max-w-md mx-auto">
          Stories that stayed with me.
        </p>
      </div>

      <div className="relative mt-16" style={{ perspective: "1700px" }}>
        <div className="relative mx-auto" style={{ height: "clamp(280px,45vw,420px)", maxWidth: "100vw" }}>
          <div ref={swipeBarRef} className="absolute inset-x-0 top-0 h-full z-30" />

          {moviePicks.map((item, i) => {
            const n = moviePicks.length
            const half = Math.floor(n / 2)
            let diff = i - centerIndex
            if (diff > half) diff -= n
            if (diff < -half) diff += n
            const isCenter = diff === 0
            const absDiff = Math.abs(diff)

            const xOffset = diff * 140
            const rotate = diff * 12
            const scale = 1 - absDiff * 0.12
            const zIndex = moviePicks.length - absDiff
            const opacity = 1 - absDiff * 0.12

            return (
              <motion.button
                key={i}
                onClick={() => handleCardClick(i)}
                className="absolute left-1/2 top-0 cursor-pointer select-none"
                style={{ width: "clamp(140px,22vw,200px)", zIndex }}
                animate={{
                  x: `calc(-50% + ${xOffset}px)`,
                  rotateY: `${rotate}deg`,
                  scale: Math.max(0.4, scale),
                  opacity: Math.max(0.15, opacity),
                }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                whileHover={!isCenter ? { y: -8 } : undefined}
              >
                <div className="relative w-full aspect-[2/3] overflow-hidden rounded-xl shadow-2xl">
                  <Image
                    src={item.poster}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 140px, 200px"
                    className="object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3 pt-8">
                    <p className="text-xs font-medium text-white text-left leading-tight line-clamp-2">
                      {item.title}
                    </p>
                    {isCenter && (
                      <span className="mt-1 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-text-muted">
                        <ExternalLink size={10} />
                        {item.platform}
                      </span>
                    )}
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={() => goTo(centerIndex - 1)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white/70 hover:text-white hover:bg-white/20 transition-all"
            aria-label="Previous"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm text-text-muted font-mono">
            {centerIndex + 1} / {moviePicks.length}
          </span>
          <button
            onClick={() => goTo(centerIndex + 1)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white/70 hover:text-white hover:bg-white/20 transition-all"
            aria-label="Next"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}
