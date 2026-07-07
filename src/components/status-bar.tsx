"use client"

import { useState, useEffect } from "react"

function getIndianTime(): string {
  const now = new Date()
  const formatter = new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  })
  return formatter.format(now)
}

export function StatusBar() {
  const [time, setTime] = useState("")

  useEffect(() => {
    setTime(getIndianTime())
    const interval = setInterval(() => setTime(getIndianTime()), 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-text-muted">
      <span className="flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        open to new work
      </span>
      <span className="hidden sm:inline text-border-light">·</span>
      <span>based in kolkata, india</span>
      <span className="hidden sm:inline text-border-light">·</span>
      <span>local time {time}</span>
    </div>
  )
}
