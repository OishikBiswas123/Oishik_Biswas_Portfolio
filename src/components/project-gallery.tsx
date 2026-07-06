"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

export function ProjectGallery({
  images,
  videos,
}: {
  images: string[]
  videos: string[]
}) {
  const [selected, setSelected] = useState<string | null>(null)

  const items = [
    ...images.map((src) => ({ src, type: "image" as const })),
    ...videos.map((src) => ({ src, type: "video" as const })),
  ]

  if (items.length === 0) return null

  return (
    <>
      <h3 className="text-xs uppercase tracking-[0.25em] text-text-muted mb-6">
        Gallery
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => setSelected(item.src)}
            className="group aspect-[16/10] overflow-hidden border border-border-light hover:border-text-muted transition-colors"
          >
            {item.type === "image" ? (
              <img
                src={item.src}
                alt={`Gallery ${i + 1}`}
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
              />
            ) : (
              <video
                src={item.src}
                className="w-full h-full object-cover"
                muted
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 p-2 text-white hover:opacity-70"
              aria-label="Close"
            >
              <X size={24} />
            </button>
            {items.find((i) => i.src === selected)?.type === "image" ? (
              <img
                src={selected}
                alt=""
                className="max-w-full max-h-[90vh] object-contain"
              />
            ) : (
              <video
                src={selected}
                className="max-w-full max-h-[90vh]"
                controls
                autoPlay
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
