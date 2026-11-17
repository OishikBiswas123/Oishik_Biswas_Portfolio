import type { Metadata } from "next"
import { Inter, Playfair_Display, PT_Serif } from "next/font/google"
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider"
import { CurtainTransition } from "@/components/curtain-transition"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
})

const ptSerif = PT_Serif({
  variable: "--font-ptserif",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
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
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
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
    creator: "@TheOishiKBiswas",
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
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon-180.png", sizes: "180x180", type: "image/png" }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${ptSerif.variable} theme-day`}>
      <body className="min-h-screen font-sans antialiased">
        <SmoothScrollProvider>
          <CurtainTransition />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
