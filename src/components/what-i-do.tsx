"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

const items = [
  {
    num: "01",
    title: "Web Development",
    tags: "Responsive · Modern · Fast",
    desc: "Building websites with clean code, smooth interactions, and performance in mind.",
  },
  {
    num: "02",
    title: "Android Development",
    tags: "Native Apps · Kotlin · Java",
    desc: "Creating Android applications with intuitive interfaces and reliable functionality.",
  },
  {
    num: "03",
    title: "AI & Automation",
    tags: "LLMs · Prompt Engineering · AI Tools",
    desc: "Exploring AI-powered workflows and integrating intelligent features into digital products.",
  },
  {
    num: "04",
    title: "UI/UX Design",
    tags: "Wireframes · Interfaces · Prototypes",
    desc: "Designing clean, user-friendly experiences that balance aesthetics with usability.",
  },
  {
    num: "05",
    title: "Game Development",
    tags: "Unity · 2.5D · Interactive Systems",
    desc: "Building immersive gameplay mechanics, environments, and interactive experiences.",
  },
  {
    num: "06",
    title: "Branding & Digital Experiences",
    tags: "Identity · Websites · Creative Direction",
    desc: "Helping businesses establish a strong online presence through thoughtful design and development.",
  },
]

function Card({
  item,
  index,
  activeIndex,
}: {
  item: (typeof items)[number]
  index: number
  activeIndex: ReturnType<typeof useScroll>["scrollYProgress"]
}) {
  const scale = useTransform(activeIndex, (active) => {
    const dist = Math.abs(index - active)
    return 1 - Math.min(dist / 2.5, 1) * 0.25
  })

  const opacity = useTransform(activeIndex, (active) => {
    const dist = Math.abs(index - active)
    return 1 - Math.min(dist / 2.5, 1) * 0.5
  })

  const y = useTransform(activeIndex, (active) => {
    const dist = index - active
    return Math.max(-6, Math.min(6, dist * 3))
  })

  return (
    <motion.div
      style={{ scale, opacity, y }}
      className="w-full py-1 border-b border-text-muted/40 last:border-b-0"
    >
      <div className="grid grid-cols-[auto_1fr_300px] gap-x-6 gap-y-0">
        <span className="col-[1] row-[1/3] text-base font-black text-text-muted/30 leading-none pt-1 select-none">
          {item.num}
        </span>
        <h3 className="col-[2] text-5xl sm:text-6xl font-bold text-text-primary leading-[1.1] tracking-tight">
          {item.title}
        </h3>
        <span className="col-[3] text-[10px] uppercase tracking-[0.15em] text-text-muted text-right pt-1.5 leading-snug">
          {item.tags}
        </span>
        <p className="col-[3] text-xs text-text-secondary leading-relaxed text-right pt-0.5">
          {item.desc}
        </p>
      </div>
    </motion.div>
  )
}

export function WhatIDo() {
  const cardsRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    container: cardsRef,
  })

  const activeIndex = useTransform(scrollYProgress, [0, 1], [0, items.length - 1])

  const dreamScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.6, 1.2, 2.5])
  const dreamOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [0, 0.04, 0.04, 0],
  )

  return (
    <section id="what-i-do" className="relative h-screen">
      <motion.span
        style={{ scale: dreamScale, opacity: dreamOpacity, letterSpacing: "-0.05em" }}
        className="fixed inset-0 flex items-center justify-center text-[20vw] sm:text-[18vw] font-black text-text-primary leading-none select-none pointer-events-none"
      >
        dream
      </motion.span>

      <div className="flex h-full relative z-10">
        <div className="w-[35%] flex items-center justify-end pl-16 pr-0 py-12">
          <div className="max-w-sm">
            <span className="text-xs uppercase tracking-[0.25em] text-text-muted">
              what i do
            </span>
            <h2 className="mt-4 text-5xl lg:text-6xl font-bold tracking-tight text-text-primary leading-tight">
              the full loop.
            </h2>
            <p className="mt-4 text-base text-text-secondary leading-relaxed">
              Research, design, and the code to ship it — one set of hands, no
              handoffs, from the first user interview to production.
            </p>
          </div>
        </div>

        <div
          ref={cardsRef}
          className="flex-1 overflow-y-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
        >
          <div className="flex flex-col pl-12 pr-8 pt-[25vh] pb-[50vh]">
            <div className="w-full max-w-xl">
              {items.map((item, i) => (
                <Card
                  key={item.num}
                  item={item}
                  index={i}
                  activeIndex={activeIndex}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
