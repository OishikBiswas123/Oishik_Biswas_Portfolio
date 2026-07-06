import Link from "next/link"
import { notFound } from "next/navigation"
import { blogPosts } from "@/lib/data"
import { ArrowLeft } from "lucide-react"

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)

  if (!post) notFound()

  return (
    <div className="pt-24 pb-24">
      <div className="mx-auto max-w-3xl px-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors mb-12"
        >
          <ArrowLeft size={16} />
          <span className="uppercase tracking-widest text-xs">Back</span>
        </Link>

        <article>
          <time className="text-xs text-text-muted uppercase tracking-wider">
            {post.date} · {post.readTime} min read
          </time>
          <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-text-secondary">{post.excerpt}</p>

          <div className="mt-12 prose prose-sm dark:prose-invert max-w-none">
            <p className="text-text-secondary">
              This post is coming soon. Check back later for the full content.
            </p>
          </div>
        </article>
      </div>
    </div>
  )
}
