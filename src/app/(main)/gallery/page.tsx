"use client"

import { useState, useMemo, useRef, useEffect, useCallback } from "react"
import { motion, useMotionValue, animate } from "framer-motion"
import { GalleryGrid } from "@/components/gallery-grid"
import { PhoneReel } from "@/components/phone-reel"
import { galleryItems } from "@/lib/data"
import { onLenisScroll } from "@/components/smooth-scroll-provider"

export default function GalleryPage() {
  const [isRotated, setIsRotated] = useState(false)
  const [phoneLocked, setPhoneLocked] = useState(true)
  const [phoneIndex, setPhoneIndex] = useState(0)
  const [phoneLeft, setPhoneLeft] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)
  const phoneTop = useMotionValue(0)

  const updatePhoneLeft = useCallback(() => {
    if (contentRef.current) {
      const rect = contentRef.current.getBoundingClientRect()
      setPhoneLeft(rect.right + 24)
    }
  }, [])

  useEffect(() => {
    phoneTop.set(window.innerHeight / 2)
    updatePhoneLeft()
    window.addEventListener("resize", updatePhoneLeft)
    return () => window.removeEventListener("resize", updatePhoneLeft)
  }, [updatePhoneLeft, phoneTop])

  useEffect(() => {
    requestAnimationFrame(updatePhoneLeft)
  }, [isRotated, updatePhoneLeft])

  useEffect(() => {
    if (isRotated) {
      const gapEl = document.querySelector("[data-gallery-gap]")
      if (gapEl) phoneTop.set(gapEl.getBoundingClientRect().top)

      requestAnimationFrame(() => {
        const gapEl = document.querySelector("[data-gallery-gap]")
        if (gapEl) {
          const rect = gapEl.getBoundingClientRect()
          const target = window.scrollY + rect.top - window.innerHeight / 2
          window.scrollTo({ top: target, behavior: "smooth" })
        }
      })
    } else {
      animate(phoneTop, window.innerHeight / 2, {
        type: "spring",
        stiffness: 80,
        damping: 15,
      })
    }
  }, [isRotated, phoneTop])

  useEffect(() => {
    if (!isRotated) return

    const unsub = onLenisScroll(() => {
      const gapEl = document.querySelector("[data-gallery-gap]")
      if (gapEl) phoneTop.set(gapEl.getBoundingClientRect().top)
    })

    return unsub
  }, [isRotated, phoneTop])

  const verticalVideos = useMemo(
    () =>
      galleryItems.filter(
        (i) => i.type === "video" && !i.alt.toLowerCase().includes("college performance"),
      ),
    [],
  )

  const horizontalVideo = useMemo(
    () =>
      galleryItems.find(
        (i) => i.type === "video" && i.alt.toLowerCase().includes("college performance"),
      )!,
    [],
  )

  const phoneProps = {
    verticalVideos,
    horizontalVideo,
    isRotated,
    onRotate: setIsRotated,
    locked: phoneLocked,
    onLockChange: setPhoneLocked,
    currentIndex: phoneIndex,
    onIndexChange: setPhoneIndex,
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="mx-auto max-w-6xl px-6 pt-24 relative z-10">
        <div className="max-w-2xl mb-10">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-text-primary leading-tight">
            Spotlight
          </h1>
          <p className="mt-4 text-base sm:text-lg text-text-secondary max-w-xl leading-relaxed">
            Moments frozen in time — from projects and events to everyday life,
            here&apos;s a visual diary of what I&apos;ve been up to.
          </p>
        </div>

        <div className={isRotated ? "" : "md:pr-[340px]"}>
          <div ref={contentRef}>
            <GalleryGrid
              items={galleryItems}
              isRotated={isRotated}
            />
          </div>
        </div>
      </div>

      <motion.div
        className="fixed z-50"
        animate={{
          left: isRotated ? "50%" : `${phoneLeft}px`,
          x: isRotated ? "-50%" : 0,
          y: "-50%",
        }}
        style={{ top: phoneTop }}
        transition={{
          left: { type: "spring", stiffness: 80, damping: 15 },
          x: { type: "spring", stiffness: 80, damping: 15 },
        }}
      >
        <PhoneReel {...phoneProps} />
      </motion.div>
    </div>
  )
}