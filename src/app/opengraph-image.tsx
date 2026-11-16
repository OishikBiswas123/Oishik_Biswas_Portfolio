import { ImageResponse } from "next/og"

/** Site-wide Open Graph card — newspaper-style cream sheet. */
export const alt = "Oishik Biswas — Software Engineer"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function Image() {
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
            <div style={{ display: "flex" }}>Oishik Biswas</div>
            <div style={{ display: "flex" }}>Portfolio</div>
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
              fontSize: 84,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: -2,
            }}
          >
            Oishik Biswas
          </div>
          <div style={{ display: "flex", marginTop: 24, fontSize: 36, color: "#2b251d" }}>
            Software Engineer · Developer &amp; Creator
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
    size
  )
}
