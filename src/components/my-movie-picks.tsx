"use client"

import { useCallback, useRef } from "react"
import CircularCarousel, { type CarouselItem } from "@/components/circular-carousel/circular-carousel"
import { useSkyTheme } from "@/components/sky-theme-provider"
import { moviePicks } from "@/lib/entertainment-data"

// Depth-fade color should match the section background in each sky theme
const FADE_COLORS: Record<string, string> = {
  dawn: "#faf5ed",
  day: "#1a3a5c",
  golden: "#faf5ed",
  night: "#0f1628",
}

const items: CarouselItem[] = moviePicks.map(movie => ({
  src: movie.poster,
  alt: movie.title,
  title: movie.title,
  subtitle: movie.platform,
}))

export function MyMoviePicks() {
  const { theme } = useSkyTheme()
  const activeRef = useRef(0)

  const handleChange = useCallback((index: number) => {
    activeRef.current = index
  }, [])

  const handleItemClick = useCallback((_item: CarouselItem, index: number) => {
    // Clicking the front card opens the streaming link; clicking a back card just
    // focuses it (handled inside the carousel).
    if (index === activeRef.current) {
      window.open(moviePicks[index].url, "_blank", "noopener,noreferrer")
    }
  }, [])

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

      <div className="mx-auto mt-14 max-w-6xl px-4">
        <CircularCarousel
          items={items}
          preset="cylinder"
          intro="rise"
          cardWidth={170}
          aspectRatio={2 / 3}
          gap={22}
          captions
          autoplay="drift"
          speed={8}
          draggable
          snap
          pauseOnHover
          focusOnClick
          cornerRadius={12}
          fadeColor={FADE_COLORS[theme] ?? FADE_COLORS.night}
          onChange={handleChange}
          onItemClick={handleItemClick}
          style={{ height: "clamp(260px, 46vw, 480px)" }}
        />
      </div>
    </section>
  )
}
