import { GalleryGrid } from "@/components/gallery-grid"
import { galleryItems } from "@/lib/data"

export default function GalleryPage() {
  return (
    <div className="pt-24 pb-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-text-primary">
            Gallery
          </h1>
          <p className="mt-4 text-text-secondary max-w-lg">
            Photos and videos from projects, events, and beyond.
          </p>
        </div>

        {galleryItems.length > 0 ? (
          <GalleryGrid items={galleryItems} />
        ) : (
          <div className="text-center py-24 text-text-muted">
            <p className="text-sm uppercase tracking-widest">
              Gallery coming soon
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
