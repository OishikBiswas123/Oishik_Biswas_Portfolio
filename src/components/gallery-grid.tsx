"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface GalleryItem {
  src: string
  alt: string
  type: "image" | "video"
}

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [selected, setSelected] = useState<GalleryItem | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => setSelected(item)}
            className="group aspect-square overflow-hidden border border-border-light hover:border-text-muted transition-colors"
          >
            {item.type === "image" ? (
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
              />
            ) : (
              <video
                src={item.src}
                className="w-full h-full object-cover"
                muted
                loop
                onMouseEnter={(e) => e.currentTarget.play()}
                onMouseLeave={(e) => {
                  e.currentTarget.pause()
                  e.currentTarget.currentTime = 0
                }}
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
              className="absolute top-4 right-4 p-2 text-white hover:opacity-70 transition-opacity"
              aria-label="Close"
            >
              <X size={24} />
            </button>
            {selected.type === "image" ? (
              <img
                src={selected.src}
                alt={selected.alt}
                className="max-w-full max-h-[90vh] object-contain"
              />
            ) : (
              <video
                src={selected.src}
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
