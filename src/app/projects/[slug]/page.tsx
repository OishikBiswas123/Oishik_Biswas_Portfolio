import Link from "next/link"
import { notFound } from "next/navigation"
import { projects } from "@/lib/data"
import { ProjectGallery } from "@/components/project-gallery"
import { ArrowLeft, ExternalLink, GitBranch } from "lucide-react"

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)

  if (!project) notFound()

  return (
    <div className="pt-24 pb-24">
      <div className="mx-auto max-w-6xl px-6">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors mb-12"
        >
          <ArrowLeft size={16} />
          <span className="uppercase tracking-widest text-xs">Back</span>
        </Link>

        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.25em] text-text-muted mb-4">
            {project.category}
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-text-primary">
            {project.title}
          </h1>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1.5 border border-border-light text-xs text-text-muted uppercase tracking-wider"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-text-primary text-bg-base text-xs uppercase tracking-widest hover:opacity-90 transition-opacity"
            >
              <ExternalLink size={14} />
              Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-border-light text-text-primary text-xs uppercase tracking-widest hover:bg-bg-muted transition-colors"
            >
              <GitBranch size={14} />
              Source Code
            </a>
          )}
        </div>

        <div className="mt-16 max-w-3xl">
          <p className="text-lg text-text-secondary leading-relaxed">
            {project.fullDescription}
          </p>
        </div>

        {(project.images.length > 0 || project.videos.length > 0) && (
          <div className="mt-16">
            <ProjectGallery images={project.images} videos={project.videos} />
          </div>
        )}
      </div>
    </div>
  )
}
