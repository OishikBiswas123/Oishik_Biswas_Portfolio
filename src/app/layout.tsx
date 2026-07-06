import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/sidebar"
import { Footer } from "@/components/footer"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Oishik Biswas — Full-Stack Developer",
  description:
    "Portfolio of Oishik Biswas, a full-stack developer specializing in modern web technologies.",
  keywords: [
    "Oishik Biswas",
    "full-stack developer",
    "web developer",
    "portfolio",
  ],
  openGraph: {
    title: "Oishik Biswas — Full-Stack Developer",
    description:
      "Portfolio of Oishik Biswas, a full-stack developer specializing in modern web technologies.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Oishik Biswas — Full-Stack Developer",
    description:
      "Portfolio of Oishik Biswas, a full-stack developer specializing in modern web technologies.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Sidebar />
          <div className="md:mr-64 pb-16 md:pb-0">
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
