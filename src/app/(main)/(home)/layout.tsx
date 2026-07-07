import { SkyBackground } from "@/components/sky-background"

export default function HomeLayout({
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
