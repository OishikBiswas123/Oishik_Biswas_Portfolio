"use client"

import { useState, useEffect, useMemo } from "react"
import { useSkyTheme } from "./sky-theme-provider"

interface CloudConfig {
  id: number
  topPct: number
  leftPct: number
  w: number
  h: number
  opacity: number
  depth: number
  driftIdx: number
  delay: number
  duration: number
}

const CLOUDS: CloudConfig[] = [
  { id: 1,  topPct: 4,  leftPct: -18, w: 620, h: 178, opacity: 0.80, depth: 0.55, driftIdx: 1, delay: -66, duration: 108 },
  { id: 2,  topPct: 11, leftPct: -12, w: 560, h: 165, opacity: 0.92, depth: 0.35, driftIdx: 1, delay: -12, duration: 90  },
  { id: 3,  topPct: 19, leftPct: -14, w: 480, h: 148, opacity: 0.74, depth: 0.45, driftIdx: 3, delay: -30, duration: 120 },
  { id: 4,  topPct: 26, leftPct: -22, w: 820, h: 230, opacity: 0.80, depth: 0.28, driftIdx: 2, delay: -58, duration: 120 },
  { id: 5,  topPct: 37, leftPct: -22, w: 740, h: 210, opacity: 0.66, depth: 0.42, driftIdx: 2, delay: -95, duration: 136 },
  { id: 6,  topPct: 43, leftPct: -10, w: 400, h: 124, opacity: 0.72, depth: 0.32, driftIdx: 3, delay: -20, duration: 132 },
  { id: 7,  topPct: 52, leftPct: -12, w: 420, h: 130, opacity: 0.86, depth: 0.38, driftIdx: 3, delay: -34, duration: 100 },
  { id: 8,  topPct: 57, leftPct: -16, w: 540, h: 160, opacity: 0.74, depth: 0.48, driftIdx: 4, delay: -50, duration: 126 },
  { id: 9,  topPct: 67, leftPct: -24, w: 660, h: 188, opacity: 0.74, depth: 0.30, driftIdx: 4, delay: -80, duration: 140 },
  { id: 10, topPct: 73, leftPct: -12, w: 440, h: 138, opacity: 0.70, depth: 0.44, driftIdx: 1, delay: -88, duration: 114 },
  { id: 11, topPct: 83, leftPct: -14, w: 520, h: 152, opacity: 0.84, depth: 0.36, driftIdx: 2, delay: -46, duration: 110 },
  { id: 12, topPct: 89, leftPct: -20, w: 600, h: 174, opacity: 0.64, depth: 0.40, driftIdx: 3, delay: -16, duration: 142 },
]

const DRIFT_KEYS = [
  "cfDrift1",
  "cfDrift2",
  "cfDrift3",
  "cfDrift4",
]

export function SkyBackground() {
  const { theme } = useSkyTheme()
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      })
    }
    window.addEventListener("mousemove", handle)
    return () => window.removeEventListener("mousemove", handle)
  }, [])

  const stars = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        left: `${(i * 19 + 3) % 100}%`,
        top: `${(i * 13 + 7) % 65}%`,
        delay: `${(i * 0.4) % 4}s`,
        duration: `${2 + (i % 3)}s`,
        size: i % 5 === 0 ? 3 : 2,
        opacity: 0.3 + ((i * 0.1) % 0.7),
      })),
    [],
  )

  const dayCloudBg =
    "radial-gradient(62% 100% at 50% 54%, rgba(255,255,255,.98) 0%, rgba(255,255,255,.85) 34%, rgba(255,255,255,.4) 60%, rgba(255,255,255,0) 80%)"
  const nightCloudBg =
    "radial-gradient(62% 100% at 50% 54%, rgba(156,176,216,.9) 0%, rgba(156,176,216,.55) 38%, rgba(156,176,216,0) 78%)"

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-b from-[var(--sky1)] via-[var(--sky2)] to-[var(--sky3)] transition-colors duration-1000">

      {/* Stars — night only */}
      {theme === "night" && (
        <div className="absolute inset-0 pointer-events-none">
          {stars.map((s, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white animate-twinkle"
              style={{
                left: s.left,
                top: s.top,
                width: s.size,
                height: s.size,
                opacity: s.opacity,
                animationDelay: s.delay,
                animationDuration: s.duration,
              }}
            />
          ))}
        </div>
      )}

      {/* Sun / Moon with glow + rays */}
      <div
        className="absolute top-[12%] right-[15%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          transform: `translate(calc(-50% + ${mouse.x * 8}px), calc(-50% + ${mouse.y * 4}px))`,
        }}
      >
        {/* Glow */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[440px] h-[440px] rounded-full"
          style={{
            background: `radial-gradient(circle, var(--sun-glow) 0%, transparent 62%)`,
            animation: "glowPulse 4s ease-in-out infinite alternate",
          }}
        />
        {/* Rays */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px]"
          style={{
            background: `
              radial-gradient(42% 48% at 44% 40%, rgba(255,236,172,.30) 0%, rgba(255,236,172,0) 70%),
              radial-gradient(54% 40% at 60% 58%, rgba(255,212,138,.22) 0%, rgba(255,212,138,0) 72%),
              radial-gradient(46% 54% at 52% 58%, rgba(255,244,205,.26) 0%, rgba(255,244,205,0) 74%)
            `,
            filter: "blur(22px)",
            mixBlendMode: "soft-light",
            WebkitMaskImage: "radial-gradient(circle, black 8%, transparent 72%)",
            maskImage: "radial-gradient(circle, black 8%, transparent 72%)",
            animation: "raysSpin 90s linear infinite",
          }}
        />
        {/* Core */}
        <div
          className="relative w-[140px] h-[140px] rounded-full"
          style={{
            background: `radial-gradient(circle, var(--sun-core) 0%, var(--sun-mid) 52%, rgba(251,194,59,0) 72%)`,
            animation: "sunFloat 4.5s ease-in-out infinite alternate",
          }}
        />
      </div>

      {/* 3D Volumetric Clouds with parallax */}
      {CLOUDS.map((c) => {
        const px = mouse.x * c.depth * 30
        const py = mouse.y * c.depth * 15
        return (
          <div
            key={c.id}
            className="absolute pointer-events-none"
            style={{
              top: `${c.topPct}%`,
              left: `${c.leftPct}%`,
              width: c.w,
              height: c.h,
              opacity: theme === "night" ? c.opacity * 0.4 : c.opacity,
              background: theme === "night" ? nightCloudBg : dayCloudBg,
              filter: "blur(16px)",
              borderRadius: 0,
              animation: `${DRIFT_KEYS[c.driftIdx - 1]} ${c.duration}s linear infinite`,
              animationDelay: `${c.delay}s`,
              transform: `translate(${px}px, ${py}px)`,
              transition: "opacity 1.5s ease, background 1.5s ease",
            }}
          />
        )
      })}

    </div>
  )
}
