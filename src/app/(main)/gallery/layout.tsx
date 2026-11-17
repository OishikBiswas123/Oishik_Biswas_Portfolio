import type { Metadata } from "next"
import { SkyBackground } from "@/components/sky-background"

export const metadata: Metadata = {
  title: "Gallery — Oishik Biswas",
  description:
    "Photos and moments from the life of Oishik Biswas — developer, creator, and daydreamer.",
  alternates: { canonical: "https://oishikbiswas.vercel.app/gallery" },
}

export default function GalleryLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <SkyBackground />
      {children}
    </>
  )
}
