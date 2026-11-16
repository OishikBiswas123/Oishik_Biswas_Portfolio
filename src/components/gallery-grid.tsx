"use client"

/* eslint-disable @next/next/no-img-element */

import { motion, LayoutGroup } from "framer-motion"
import galleryMedia from "@/lib/gallery-media.json"

interface GalleryItem {
  src: string
  alt: string
  type: "image" | "video"
}

interface GalleryGridProps {
  items: GalleryItem[]
  isRotated: boolean
}

type MediaInfo = { thumb: string; blur: string; w: number; h: number }

const media = galleryMedia as Record<string, MediaInfo | undefined>

function GalleryCard({ item, index }: { item: GalleryItem; index: number }) {
  const info = media[item.src]
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.3), duration: 0.4, ease: "easeOut" }}
      className="break-inside-avoid mb-3"
    >
      <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/[8] hover:border-white/30 transition-all cursor-pointer">
        {/* Blur-up placeholder: fixed aspect ratio box (no layout shift) with a
            tiny inline blur behind the image while it loads */}
        <div
          className="relative w-full"
          style={{
            aspectRatio: info ? `${info.w} / ${info.h}` : undefined,
            backgroundImage: info ? `url(${info.blur})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <img
            src={info?.thumb ?? item.src}
            alt={item.alt}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </motion.div>
  )
}

export function GalleryGrid({
  items,
  isRotated,
}: GalleryGridProps) {
  const images = items.filter((i) => i.type === "image")
  const splitIndex = Math.ceil(images.length / 2)
  const topImages = images.slice(0, splitIndex)
  const bottomImages = images.slice(splitIndex)

  const colClass = isRotated
    ? "columns-3 sm:columns-4 lg:columns-6 gap-4"
    : "columns-2 sm:columns-3 lg:columns-4 gap-4"

  return (
    <LayoutGroup>
      <div className={colClass}>
        {topImages.map((item, i) => (
          <GalleryCard key={item.src} item={item} index={i} />
        ))}

        {isRotated && (
          <div data-gallery-gap className="h-[340px]" style={{ columnSpan: "all" }} />
        )}

        {bottomImages.map((item, i) => (
          <GalleryCard key={item.src} item={item} index={i + splitIndex} />
        ))}
      </div>
    </LayoutGroup>
  )
}
