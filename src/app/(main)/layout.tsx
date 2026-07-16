import { SkyThemeProvider } from "@/components/sky-theme-provider"
import { Sidebar } from "@/components/sidebar"
import { Footer } from "@/components/footer"

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SkyThemeProvider>
      <Sidebar />
      <div className="md:mr-72 pb-24 md:pb-0 overflow-x-hidden md:overflow-x-visible">
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </SkyThemeProvider>
  )
}
