import type { Metadata } from "next"
import { blogPosts } from "@/lib/data"
import { ogImageUrl } from "@/lib/og"
import { BlogCard } from "@/components/blog-card"

export const metadata: Metadata = {
  title: "Blog — Oishik Biswas",
  description:
    "Essays and ideas by Oishik Biswas — physics, philosophy, and everything in between.",
  alternates: { canonical: "https://oishikbiswas.vercel.app/blog" },
  openGraph: {
    title: "Blog — Oishik Biswas",
    description:
      "Essays and ideas by Oishik Biswas — physics, philosophy, and everything in between.",
    url: "https://oishikbiswas.vercel.app/blog",
    images: [
      {
        url: ogImageUrl("Essays & Ideas — the blog of Oishik Biswas"),
        width: 1200,
        height: 630,
        alt: "Blog — Oishik Biswas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — Oishik Biswas",
    description:
      "Essays and ideas by Oishik Biswas — physics, philosophy, and everything in between.",
    creator: "@TheOishiKBiswas",
    images: [ogImageUrl("Essays & Ideas — the blog of Oishik Biswas")],
  },
}

export default function BlogPage() {
  return (
    <div className="pt-24 pb-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-text-primary">
            Blog
          </h1>
          <p className="mt-4 text-text-secondary max-w-lg">
            Thoughts on development, design, and technology.
          </p>
        </div>

        {blogPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 text-text-muted">
            <p className="text-sm uppercase tracking-widest">
              No posts yet — coming soon
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
