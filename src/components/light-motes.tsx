"use client"

import { useEffect, useState } from "react"

interface Mote {
  left: string
  top: string
  dur: string
  delay: string
}

function makeMotes(): Mote[] {
  return Array.from({ length: 12 }, () => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    dur: `${6 + Math.random() * 7}s`,
    delay: `${-Math.random() * 13}s`,
  }))
}

export function LightMotes() {
  const [motes, setMotes] = useState<Mote[]>([])

  useEffect(() => {
    setMotes(makeMotes())
  }, [])

  return (
    <div
      className="absolute inset-0 z-[4] pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {motes.map((m, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: m.left,
            top: m.top,
            width: 4,
            height: 4,
            background: "rgba(255,255,255,.95)",
            boxShadow: "0 0 7px 2px rgba(255,255,255,.5)",
            animation: `sfMote ${m.dur} linear infinite`,
            animationDelay: m.delay,
          }}
        />
      ))}
    </div>
  )
}
