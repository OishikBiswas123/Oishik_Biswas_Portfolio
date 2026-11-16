"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Mail, Link2, Share2, MessageCircle } from "lucide-react"

/** X (Twitter) logo — lucide dropped brand icons, so inline it. */
function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

/** WhatsApp logo — inline SVG (not in lucide). */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.347-.347.52-.52.174-.174.232-.298.347-.497.115-.198.058-.372-.03-.52-.086-.15-.665-1.6-.91-2.191-.24-.581-.483-.587-.67-.596-.173-.008-.372-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" />
    </svg>
  )
}

export function BlogActions() {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  const shareUrl = () => window.location.href
  const shareText = () => "The Daydreamer's Gravity — a personal essay by Oishik Biswas"

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl())
    } catch {
      // Clipboard API needs a secure context; fall back for http://localhost
      const el = document.createElement("textarea")
      el.value = shareUrl()
      document.body.appendChild(el)
      el.select()
      document.execCommand("copy")
      el.remove()
    }
    setCopied(true)
    setOpen(false)
    setTimeout(() => setCopied(false), 2200)
  }

  const menuOptions = [
    {
      label: "WhatsApp",
      icon: <WhatsAppIcon className="h-4 w-4" />,
      href: () =>
        `https://wa.me/?text=${encodeURIComponent(`${shareText()}\n${shareUrl()}`)}`,
    },
    {
      label: "X / Twitter",
      icon: <XIcon className="h-4 w-4" />,
      href: () =>
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText())}&url=${encodeURIComponent(shareUrl())}`,
    },
    {
      label: "Email",
      icon: <Mail className="h-4 w-4" />,
      href: () =>
        `mailto:?subject=${encodeURIComponent("The Daydreamer's Gravity")}&body=${encodeURIComponent(`${shareText()}\n${shareUrl()}`)}`,
    },
    {
      label: "Copy link",
      icon: <Link2 className="h-4 w-4" />,
      onClick: copyLink,
    },
  ]

  return (
    <div className="mt-14">
      <div className="flex flex-wrap items-center justify-center gap-3 border-y border-[#2b251d]/40 py-5">
        {/* Share button + dropdown menu */}
        <div ref={wrapRef} className="relative">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="inline-flex items-center gap-2 border border-[#2b251d]/60 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#1f1a14] transition-colors hover:bg-[#1f1a14] hover:text-[#f6f1e3]"
          >
            <Share2 className="h-4 w-4" />
            Share
          </button>

          {open && (
            <div className="absolute left-1/2 top-full z-20 mt-2 w-48 -translate-x-1/2 border border-[#2b251d]/40 bg-[#f6f1e3] shadow-lg">
              {menuOptions.map((opt) =>
                opt.onClick ? (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={opt.onClick}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left font-newsprint text-sm text-[#2b251d] transition-colors hover:bg-[#1f1a14]/10"
                  >
                    {opt.icon}
                    {opt.label}
                  </button>
                ) : (
                  <a
                    key={opt.label}
                    href={opt.href()}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center gap-3 px-4 py-2.5 font-newsprint text-sm text-[#2b251d] transition-colors hover:bg-[#1f1a14]/10"
                  >
                    {opt.icon}
                    {opt.label}
                  </a>
                )
              )}
            </div>
          )}

          {copied && (
            <span className="absolute left-1/2 top-full z-20 mt-2 -translate-x-1/2 whitespace-nowrap border border-[#1f1a14] bg-[#1f1a14] px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-[#f6f1e3]">
              Link copied!
            </span>
          )}
        </div>

        {/* Connect with the author */}
        <Link
          href="/#contact"
          className="inline-flex items-center gap-2 border border-[#2b251d]/60 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#1f1a14] transition-colors hover:bg-[#1f1a14] hover:text-[#f6f1e3]"
        >
          <MessageCircle className="h-4 w-4" />
          Connect with Oishik Biswas
        </Link>
      </div>

      <p className="mt-3 text-center font-newsprint text-sm italic text-[#2b251d]/80">
        Enjoyed the essay? Share it with a fellow daydreamer — or reach out, I always reply.
      </p>
    </div>
  )
}
