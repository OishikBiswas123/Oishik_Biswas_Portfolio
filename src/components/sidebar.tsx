"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "./theme-toggle"
import {
  Home,
  FolderOpen,
  User,
  Image,
  PenLine,
  Mail,
} from "lucide-react"

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/projects", label: "Projects", icon: FolderOpen },
  { href: "/about", label: "About", icon: User },
  { href: "/gallery", label: "Gallery", icon: Image },
  { href: "/blog", label: "Blog", icon: PenLine },
  { href: "/contact", label: "Contact", icon: Mail },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop: right sidebar */}
      <aside className="hidden md:flex fixed right-0 top-0 h-screen w-64 border-l border-border-light bg-bg-base z-50 flex-col justify-between py-8 px-6">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-text-primary"
        >
          Oishik Biswas
        </Link>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2.5 text-sm transition-colors rounded",
                  isActive
                    ? "text-text-primary bg-bg-muted font-medium"
                    : "text-text-muted hover:text-text-primary hover:bg-bg-muted"
                )}
              >
                <Icon size={16} />
                <span className="tracking-wide">{item.label}</span>
                {isActive && (
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-full bg-text-primary" />
                )}
              </Link>
            )
          })}
        </nav>

        <ThemeToggle />
      </aside>

      {/* Mobile: bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 h-16 border-t border-border-light bg-bg-base/90 backdrop-blur-lg z-50 flex items-center justify-around px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 p-2 transition-colors",
                isActive
                  ? "text-text-primary"
                  : "text-text-muted hover:text-text-primary"
              )}
            >
              <Icon size={18} />
              <span className="text-[10px] uppercase tracking-wider">
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
