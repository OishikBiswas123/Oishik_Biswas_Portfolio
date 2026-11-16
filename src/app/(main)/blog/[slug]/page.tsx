import Link from "next/link"
import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
import { blogPosts } from "@/lib/data"
import { BlogActions } from "@/components/blog-actions"
import { ArrowLeft } from "lucide-react"

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

/** Newspaper-ink MDX components — fixed ink-on-paper colors, theme-independent. */
const mdxComponents = {
  /** Two images side by side (stacked on phones) with one shared caption. */
  Duo: ({
    src1,
    src2,
    alt1,
    alt2,
    caption,
    uniform,
  }: {
    src1: string
    src2: string
    alt1?: string
    alt2?: string
    caption?: string
    uniform?: boolean
  }) => (
    <figure className="my-9">
      <div className="grid grid-cols-2 gap-3 items-stretch">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src1}
          alt={alt1 ?? ""}
          className={`w-full border border-[#2b251d]/25 ${uniform ? "aspect-[4/3] object-cover" : ""}`}
          loading="lazy"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src2}
          alt={alt2 ?? ""}
          className={`w-full border border-[#2b251d]/25 ${uniform ? "aspect-[4/3] object-cover" : ""}`}
          loading="lazy"
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center font-newsprint text-sm italic text-[#2b251d]/85 leading-relaxed">
          {caption}
        </figcaption>
      )}
    </figure>
  ),
  img: ({ src, alt }: { src?: string; alt?: string }) => (
    <span className="block my-9">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt ?? ""}
        className="w-full border border-[#2b251d]/25"
        loading="lazy"
      />
    </span>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="mt-12 mb-6 border-y border-[#2b251d]/40 py-2 text-center font-display text-xl sm:text-2xl font-bold uppercase tracking-[0.12em] text-[#1f1a14]">
      {children}
    </h2>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="my-5 font-newsprint text-[16.5px] sm:text-[17.5px] leading-[1.85] text-[#2b251d] [text-align:justify] hyphens-auto">
      {children}
    </p>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-bold text-[#1f1a14]">{children}</strong>
  ),
  em: ({ children }: { children?: React.ReactNode }) => (
    <em className="italic">{children}</em>
  ),
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="relative my-10 border-y border-[#2b251d]/40 py-6 text-center">
      <span
        aria-hidden
        className="absolute -top-2 left-1/2 -translate-x-1/2 font-display text-6xl text-[#2b251d]/30"
      >
        &ldquo;
      </span>
      <span className="font-display text-xl sm:text-2xl italic text-[#1f1a14]">
        {children}
      </span>
    </blockquote>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="my-5 space-y-1 list-disc pl-7 font-newsprint text-[16.5px] text-[#2b251d]">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="my-5 space-y-2 list-decimal pl-7 font-newsprint text-[16.5px] text-[#2b251d]">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="leading-[1.8]">{children}</li>
  ),
  code: ({ children }: { children?: React.ReactNode }) => (
    <span className="my-7 flex justify-center">
      <code className="px-5 py-2 font-mono text-lg border-2 border-[#2b251d]/60 bg-[#efe8d8] text-[#1f1a14]">
        {children}
      </code>
    </span>
  ),
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
    <div className="pt-16 pb-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          <span className="uppercase tracking-widest text-xs">Back</span>
        </Link>

        {/* The newspaper sheet — cream paper, ink type, theme-independent */}
        <article className="paper-sheet rounded-sm px-5 py-10 sm:px-12 sm:py-14 border border-black/10">
          {/* Masthead */}
          <div className="border-t-4 border-[#1f1a14] pt-3">
            <div className="flex items-center justify-between gap-3 border-b border-[#1f1a14]/60 pb-2 paper-smallcaps text-[#2b251d]/80">
              <span>{post.date}</span>
              <span className="hidden sm:inline text-center">Personal Essay • Physics &amp; Philosophy</span>
              <span>{post.readTime} min read</span>
            </div>
          </div>

          <h1 className="mt-8 text-center font-display text-3xl sm:text-5xl font-bold leading-[1.08] tracking-tight text-[#1f1a14]">
            {post.title}
          </h1>

          <div className="mt-6 flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-[#2b251d]/50" />
            <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.28em] text-[#1f1a14]">
              By Oishik Biswas
            </span>
            <span className="h-px w-12 bg-[#2b251d]/50" />
          </div>

          <p className="mt-6 text-center font-newsprint text-base sm:text-lg italic text-[#2b251d]/90">
            {post.excerpt}
          </p>

          {post.coverImage && (
            <span className="mt-8 block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full border border-[#2b251d]/25"
              />
            </span>
          )}

          <div className="paper-body mt-10">
            {post.content ? (
              <MDXRemote source={post.content} components={mdxComponents} />
            ) : (
              <p className="font-newsprint text-[#2b251d]">
                This post is coming soon. Check back later for the full content.
              </p>
            )}
          </div>

          <BlogActions />

          {/* Colophon / footer rule */}
          <div className="mt-14 border-t-4 border-[#1f1a14] pt-4 text-center">
            <span className="paper-smallcaps text-[#2b251d]/70">The End</span>
          </div>
        </article>

        <div className="mt-8 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="uppercase tracking-widest text-xs">All posts</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
