import { ContactForm } from "@/components/contact-form"
import { personalInfo } from "@/lib/data"
import { Mail, MapPin, Phone, MessageCircle } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="pt-24 pb-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-text-primary">
            Contact
          </h1>
          <p className="mt-4 text-text-secondary max-w-lg">
            Have a project in mind or just want to say hi? Drop me a message.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
          <div className="lg:col-span-3">
            <ContactForm />
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-xs uppercase tracking-[0.25em] text-text-muted mb-6">
              Contact Info
            </h2>
            <div className="space-y-4">
              <a
                href={`mailto:${personalInfo.email}`}
                className="flex items-center gap-3 text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                <Mail size={16} />
                {personalInfo.email}
              </a>
              <a
                href={`tel:${personalInfo.phone}`}
                className="flex items-center gap-3 text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                <Phone size={16} />
                {personalInfo.phone}
              </a>
              <a
                href={`https://wa.me/${personalInfo.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                className="flex items-center gap-3 text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                <MessageCircle size={16} />
                WhatsApp
              </a>
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <MapPin size={16} />
                {personalInfo.location}
              </div>
            </div>

            <h2 className="text-xs uppercase tracking-[0.25em] text-text-muted mt-10 mb-4">
              Social
            </h2>
            <div className="flex gap-4">
              <a
                href={personalInfo.social.github}
                target="_blank"
                className="p-2 border border-border-light text-text-muted hover:text-text-primary hover:border-text-muted transition-colors"
                aria-label="GitHub"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>
              <a
                href={personalInfo.social.linkedin}
                target="_blank"
                className="p-2 border border-border-light text-text-muted hover:text-text-primary hover:border-text-muted transition-colors"
                aria-label="LinkedIn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
