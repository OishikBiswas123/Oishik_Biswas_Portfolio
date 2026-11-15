"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import CircularCarousel, { type CarouselItem } from "@/components/circular-carousel/circular-carousel"
import { useSkyTheme } from "@/components/sky-theme-provider"
import { musicTracks } from "@/lib/entertainment-data"

// Depth-fade color should match the section background in each sky theme
const FADE_COLORS: Record<string, string> = {
  dawn: "#faf5ed",
  day: "#1a3a5c",
  golden: "#faf5ed",
  night: "#0f1628",
}

const SPOTIFY_IFRAME_API_SRC = "https://open.spotify.com/embed/iframe-api/v1"

interface SpotifyPlaybackData {
  isPaused: boolean
  position: number
  duration: number
}

interface SpotifyController {
  loadUri(uri: string): void
  play(): void
  pause(): void
  addListener(event: string, callback: (e: { data?: SpotifyPlaybackData }) => void): void
  removeListener(event: string, callback: (e: { data?: SpotifyPlaybackData }) => void): void
  disconnect(): void
}

interface SpotifyIframeApi {
  createController(
    element: HTMLElement,
    options: { uri: string; width?: number; height?: number },
    callback: (controller: SpotifyController) => void
  ): void
}

type SpotifyWindow = Window & {
  __skySpotifyApiPromise?: Promise<SpotifyIframeApi>
  onSpotifyIframeApiReady?: (api: SpotifyIframeApi) => void
}

/** Loads (once) Spotify's IFrame API so the hidden player can be driven programmatically. */
function loadSpotifyIframeApi(): Promise<SpotifyIframeApi> {
  const w = window as SpotifyWindow
  if (!w.__skySpotifyApiPromise) {
    w.__skySpotifyApiPromise = new Promise<SpotifyIframeApi>(resolve => {
      if ((window as SpotifyWindow).__skySpotifyApiPromise) return
      w.onSpotifyIframeApiReady = api => resolve(api)
      const script = document.createElement("script")
      script.src = SPOTIFY_IFRAME_API_SRC
      script.async = true
      document.head.appendChild(script)
    })
  }
  return w.__skySpotifyApiPromise
}

const items: CarouselItem[] = musicTracks.map(track => ({
  src: track.art,
  alt: `${track.title} — ${track.artist}`,
  title: track.title,
  subtitle: track.artist,
}))

export function MyMusicPicks({ resetKey = 0, onTrackChange }: { resetKey?: number; onTrackChange?: () => void }) {
  const { theme } = useSkyTheme()
  const [selected, setSelected] = useState(0)
  const [playing, setPlaying] = useState(false)

  const holderRef = useRef<HTMLDivElement | null>(null)
  const controllerRef = useRef<SpotifyController | null>(null)
  const selectedRef = useRef(0)
  const playingRef = useRef(false)
  const pendingSelectRef = useRef<number | null>(null)
  const heardBackRef = useRef(false)
  const onTrackChangeRef = useRef(onTrackChange)

  useEffect(() => {
    onTrackChangeRef.current = onTrackChange
  }, [onTrackChange])

  // Create the hidden Spotify controller once
  useEffect(() => {
    let cancelled = false
    let controller: SpotifyController | null = null
    const update = (e: { data?: SpotifyPlaybackData }) => {
      const data = e?.data
      if (!data) return
      heardBackRef.current = true
      playingRef.current = !data.isPaused
      setPlaying(!data.isPaused)
    }
    loadSpotifyIframeApi().then(api => {
      if (cancelled || !holderRef.current) return
      // NOTE: do NOT pass width/height here — a 1x1 iframe silently refuses to
      // play. The iframe renders at its natural size and is kept invisible by
      // the 1px overflow-hidden wrapper around it.
      api.createController(
        holderRef.current,
        { uri: `spotify:track:${musicTracks[selectedRef.current].spotifyId}` },
        created => {
          if (cancelled) return
          controller = created
          controllerRef.current = created
          created.addListener("playback_update", update)
          // If a poster was clicked before the controller was ready, honor it now
          if (pendingSelectRef.current !== null) {
            const index = pendingSelectRef.current
            pendingSelectRef.current = null
            if (selectedRef.current !== index) {
              created.loadUri(`spotify:track:${musicTracks[index].spotifyId}`)
              selectedRef.current = index
              setSelected(index)
            }
            heardBackRef.current = false
            created.play()
            playingRef.current = true
            setPlaying(true)
            onTrackChangeRef.current?.()
          }
        }
      )
    })
    return () => {
      cancelled = true
      try {
        controller?.removeListener("playback_update", update)
        controller?.disconnect()
      } catch {
        /* controller already gone */
      }
      controllerRef.current = null
      playingRef.current = false
    }
  }, [])

  /** Select a poster (switching track if needed) and start playing it. */
  const selectAndPlay = useCallback((index: number) => {
    const controller = controllerRef.current
    if (!controller) {
      pendingSelectRef.current = index
      return
    }
    const switched = selectedRef.current !== index
    if (switched) {
      controller.loadUri(`spotify:track:${musicTracks[index].spotifyId}`)
      selectedRef.current = index
      setSelected(index)
    }
    heardBackRef.current = false
    controller.play()
    if (switched) {
      // The play command can race the track loading inside the embed and be
      // dropped. If we still haven't heard any playback event shortly after,
      // nudge it once more.
      window.setTimeout(() => {
        if (controllerRef.current === controller && selectedRef.current === index && playingRef.current && !heardBackRef.current) {
          controller.play()
        }
      }, 800)
    }
    playingRef.current = true
    setPlaying(true)
    onTrackChangeRef.current?.()
  }, [])

  /** Resume/pause the currently selected track. */
  const togglePlay = useCallback(() => {
    const controller = controllerRef.current
    if (!controller) return
    if (playingRef.current) {
      controller.pause()
      playingRef.current = false
      setPlaying(false)
    } else {
      controller.play()
      playingRef.current = true
      setPlaying(true)
      onTrackChangeRef.current?.()
    }
  }, [])

  // Poster click behavior:
  //  - front card that is already selected → toggle play/pause
  //  - anything else → bring it front and play it
  const handleItemClick = useCallback((_item: CarouselItem, index: number) => {
    if (index === selectedRef.current) {
      togglePlay()
    } else {
      selectAndPlay(index)
    }
  }, [selectAndPlay, togglePlay])

  // A hobby audio player started → pause the music
  useEffect(() => {
    if (!resetKey) return
    const controller = controllerRef.current
    if (controller && playingRef.current) {
      controller.pause()
      playingRef.current = false
      setPlaying(false)
    }
  }, [resetKey])

  const track = musicTracks[selected]

  return (
    <section className="overflow-hidden py-24 sm:py-32">
      {/* Hidden Spotify player — driven by poster clicks via the IFrame API.
          Spotify's API creates the iframe with loading="lazy", so it MUST stay
          inside the viewport or Chrome never loads it. We keep it on-screen but
          effectively invisible (1% opacity, behind everything, click-through). */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          left: 0,
          bottom: 0,
          width: 320,
          height: 152,
          overflow: "hidden",
          opacity: 0.01,
          pointerEvents: "none",
          zIndex: -1,
        }}
      >
        <div ref={holderRef} />
      </div>

      <div className="mx-auto max-w-6xl px-6 text-center">
        <span className="text-sm uppercase tracking-[0.25em] text-text-muted font-semibold">
          The Soundtrack of My Life
        </span>
        <p className="mt-3 text-lg text-text-secondary leading-relaxed max-w-md mx-auto">
          {playing && track ? `Now playing — tap the poster to pause.` : "Songs that define moments."}
        </p>
      </div>

      <div className="mx-auto mt-14 max-w-6xl px-4">
        <CircularCarousel
          items={items}
          preset="cylinder"
          intro="rise"
          cardWidth={190}
          aspectRatio={1}
          gap={28}
          captions
          autoplay="drift"
          speed={8}
          draggable
          snap
          pauseOnHover
          focusOnClick
          cornerRadius={14}
          fadeColor={FADE_COLORS[theme] ?? FADE_COLORS.night}
          onItemClick={handleItemClick}
          style={{ height: "clamp(240px, 42vw, 440px)" }}
        />
      </div>
    </section>
  )
}
