import Link from "next/link"
import type { BlogPost } from "@/lib/data"

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block border border-border-light hover:border-text-muted transition-colors p-6"
    >
      <time className="text-xs text-text-muted uppercase tracking-wider">
        {post.date}
      </time>
      <h3 className="mt-2 text-lg font-semibold text-text-primary group-hover:opacity-70 transition-opacity">
        {post.title}
      </h3>
      <p className="mt-2 text-sm text-text-secondary line-clamp-2">
        {post.excerpt}
      </p>
      <div className="mt-3 text-xs text-text-muted uppercase tracking-wider">
        {post.readTime} min read
      </div>
    </Link>
  )
}
