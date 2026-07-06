"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { LetterHoverText } from "@/components/letter-hover-text"

export function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col justify-center px-8 md:px-16 lg:px-24">
      <div className="max-w-3xl">
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-xs uppercase tracking-[0.3em] text-text-muted mb-6"
        >
          Developer & Creator
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight text-text-primary leading-none"
        >
          <LetterHoverText text="Oishik" />
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="h-px bg-border-light my-4 origin-left"
          style={{ maxWidth: "12rem" }}
        />

        <motion.h1
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight text-text-primary leading-none"
        >
          <LetterHoverText text="Biswas" />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
          className="mt-8 text-lg text-text-secondary max-w-md leading-relaxed"
        >
          I build games, websites, and interactive experiences — from Unity
          titles on the Play Store to full client deliveries.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
          className="mt-10 flex flex-col sm:flex-row items-start gap-4"
        >
          <Link
            href="/projects"
            className="px-8 py-3 bg-text-primary text-bg-base text-sm uppercase tracking-widest hover:opacity-90 transition-opacity"
          >
            View Projects
          </Link>
          <Link
            href="/contact"
            className="px-8 py-3 border border-border-light text-text-primary text-sm uppercase tracking-widest hover:bg-bg-muted transition-colors"
          >
            Get in Touch
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
