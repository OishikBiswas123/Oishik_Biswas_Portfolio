import { blogPosts } from "@/lib/data"
import { BlogCard } from "@/components/blog-card"

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
