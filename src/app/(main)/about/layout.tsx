import { SkyBackground } from "@/components/sky-background"

export default function AboutLayout({
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
