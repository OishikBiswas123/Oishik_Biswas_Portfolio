"use client"

import { useState, type FormEvent, useRef } from "react"
import emailjs from "@emailjs/browser"
import { Send } from "lucide-react"

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus("sending")

    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      await emailjs.sendForm(
        "service_id",
        "template_id",
        form,
        "public_key"
      )
      setStatus("success")
      form.reset()
    } catch {
      setStatus("error")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="name"
            className="block text-xs uppercase tracking-widest text-text-muted mb-2"
          >
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            className="w-full px-4 py-3 bg-transparent border border-border-light text-text-primary text-sm focus:outline-none focus:border-text-muted transition-colors"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-xs uppercase tracking-widest text-text-muted mb-2"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            className="w-full px-4 py-3 bg-transparent border border-border-light text-text-primary text-sm focus:outline-none focus:border-text-muted transition-colors"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="subject"
          className="block text-xs uppercase tracking-widest text-text-muted mb-2"
        >
          Subject
        </label>
        <input
          type="text"
          name="subject"
          id="subject"
          required
          className="w-full px-4 py-3 bg-transparent border border-border-light text-text-primary text-sm focus:outline-none focus:border-text-muted transition-colors"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-xs uppercase tracking-widest text-text-muted mb-2"
        >
          Message
        </label>
        <textarea
          name="message"
          id="message"
          rows={5}
          required
          className="w-full px-4 py-3 bg-transparent border border-border-light text-text-primary text-sm focus:outline-none focus:border-text-muted transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex items-center gap-2 px-6 py-3 bg-text-primary text-bg-base text-sm uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        <Send size={16} />
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>

      {status === "success" && (
        <p className="text-sm text-green-600 dark:text-green-400">
          Message sent successfully!
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-600 dark:text-red-400">
          Failed to send. Please try again or email me directly.
        </p>
      )}
    </form>
  )
}
