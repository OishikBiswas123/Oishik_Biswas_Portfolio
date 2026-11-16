import Link from "next/link"
import type { BlogPost } from "@/lib/data"

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block paper-sheet rounded-sm border border-black/10 p-6 transition-all duration-300 hover:-rotate-[0.4deg] hover:shadow-2xl"
    >
      <div className="flex items-center justify-between gap-3 border-b border-[#2b251d]/50 pb-2 paper-smallcaps text-[#2b251d]/80">
        <span>{post.date}</span>
        <span>{post.readTime} min read</span>
      </div>

      {post.cardImage && (
        <span className="mt-4 block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.cardImage}
            alt={post.title}
            className="w-full aspect-[16/9] object-cover border border-[#2b251d]/25"
          />
        </span>
      )}

      <h3 className="mt-4 font-display text-xl sm:text-2xl font-bold leading-snug text-[#1f1a14] group-hover:opacity-80 transition-opacity">
        {post.title}
      </h3>

      <p className="mt-3 font-newsprint text-sm leading-relaxed italic text-[#2b251d]/90 line-clamp-3">
        {post.excerpt}
      </p>

      <div className="mt-5 border-t border-[#2b251d]/40 pt-3 paper-smallcaps text-[#2b251d]/70 group-hover:text-[#1f1a14] transition-colors">
        Read the full story →
      </div>
    </Link>
  )
}
