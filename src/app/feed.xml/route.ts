import { blogPosts } from "@/lib/data"

const SITE_URL = "https://oishikbiswas.vercel.app"

/** Escape text for safe inclusion in XML. */
function esc(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

export const dynamic = "force-static"

export function GET() {
  const items = blogPosts
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`
      const pubDate = new Date(post.date).toUTCString()
      return `    <item>
      <title>${esc(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${esc(post.excerpt)}</description>
    </item>`
    })
    .join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Oishik Biswas — Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Essays and ideas by Oishik Biswas — physics, philosophy, and everything in between.</description>
    <language>en-us</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
