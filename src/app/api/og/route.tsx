import { ImageResponse } from "next/og"
import { personalInfo } from "@/lib/data"

/**
 * Explicit Open Graph image endpoint — renders a newspaper-style cream card
 * from query params. Used instead of the opengraph-image file convention for
 * nested segments, which Next 16 fails to resolve at clean URLs (hashed
 * internal routes only).
 *
 * Usage: /api/og?title=...&date=... (title required, defaults to the site card)
 */
export const contentType = "image/png"

export function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get("title") ?? `${personalInfo.name} — Software Engineer`
  const date = searchParams.get("date") ?? ""

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#f6f1e3",
          color: "#1f1a14",
          padding: 60,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", height: 10, backgroundColor: "#1f1a14" }} />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 16,
              fontSize: 26,
              letterSpacing: 8,
              color: "#2b251d",
              textTransform: "uppercase",
            }}
          >
            <div style={{ display: "flex" }}>{date || "Oishik Biswas"}</div>
            <div style={{ display: "flex" }}>{date ? "Personal Essay" : "Portfolio"}</div>
          </div>
          <div style={{ display: "flex", height: 3, backgroundColor: "#1f1a14", marginTop: 16 }} />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: title.length > 60 ? 56 : 72,
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: -1,
              lineClamp: 3,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 28,
              letterSpacing: 8,
              textTransform: "uppercase",
              color: "#2b251d",
            }}
          >
            By Oishik Biswas
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", height: 3, backgroundColor: "#1f1a14" }} />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 18,
              fontSize: 26,
              letterSpacing: 6,
              color: "#2b251d",
              textTransform: "uppercase",
            }}
          >
            oishikbiswas.vercel.app
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
