"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

const stats = [
  { value: "10+", label: "Projects Completed" },
  { value: "5+", label: "Technologies Explored" },
  { value: "∞", label: "Curiosity Always Growing" },
  { value: "100%", label: "Self-Learning" },
  { value: "Always", label: "Building Something New" },
]

export function StatsStrip() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <div ref={ref} className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
      <div className="flex flex-wrap items-center justify-center gap-y-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.value}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.12 }}
            className="flex items-center gap-6"
          >
            {i > 0 && (
              <div className="hidden sm:block w-px h-10 bg-white/10" />
            )}
            <div className="flex flex-col items-center px-4 min-w-[120px]">
              <span className="text-3xl sm:text-4xl font-bold text-text-primary leading-none">
                {stat.value}
              </span>
              <span className="mt-1.5 text-xs sm:text-sm text-text-muted leading-tight text-center whitespace-nowrap">
                {stat.label}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
