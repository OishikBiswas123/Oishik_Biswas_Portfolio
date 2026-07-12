import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Oishik Biswas — Software Engineer",
  description:
    "Web developer, app developer, game developer, product designer, and AI enthusiast — building across Unity, Android, and the web.",
  keywords: [
    "Oishik Biswas",
    "web developer",
    "app developer",
    "game developer",
    "product designer",
    "AI enthusiast",
    "Kolkata",
    "India",
    "portfolio",
  ],
  authors: [{ name: "Oishik Biswas" }],
  creator: "Oishik Biswas",
  publisher: "Oishik Biswas",
  metadataBase: new URL("https://oishikbiswas.vercel.app"),
  openGraph: {
    title: "Oishik Biswas — Software Engineer",
    description:
      "Web developer, app developer, game developer, product designer, and AI enthusiast — building across Unity, Android, and the web.",
    url: "https://oishikbiswas.vercel.app",
    siteName: "Oishik Biswas Portfolio",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Oishik Biswas — Software Engineer",
    description:
      "Web developer, app developer, game developer, product designer, and AI enthusiast — building across Unity, Android, and the web.",
    creator: "@oishikbiswas",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google1fa75ac2c5b97232",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} theme-day`}>
      <body className="min-h-screen font-sans antialiased">
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
