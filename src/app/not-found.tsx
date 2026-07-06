import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <h1 className="text-6xl font-bold text-text-primary">404</h1>
      <p className="mt-4 text-text-secondary">Page not found</p>
      <Link
        href="/"
        className="mt-8 px-6 py-3 bg-text-primary text-bg-base text-sm uppercase tracking-widest hover:opacity-90 transition-opacity"
      >
        Back Home
      </Link>
    </div>
  )
}
