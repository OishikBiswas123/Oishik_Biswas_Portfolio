import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border-light">
      <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-text-muted">
          &copy; {new Date().getFullYear()} Oishik Biswas. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <Link
            href="https://github.com/OishikBiswas123"
            target="_blank"
            className="text-sm text-text-muted hover:text-text-primary transition-colors"
          >
            GitHub
          </Link>
          <Link
            href="https://linkedin.com/in/oishik-biswas"
            target="_blank"
            className="text-sm text-text-muted hover:text-text-primary transition-colors"
          >
            LinkedIn
          </Link>
          <Link
            href="mailto:oishik.biswas@email.com"
            className="text-sm text-text-muted hover:text-text-primary transition-colors"
          >
            Email
          </Link>
        </div>
      </div>
    </footer>
  )
}
