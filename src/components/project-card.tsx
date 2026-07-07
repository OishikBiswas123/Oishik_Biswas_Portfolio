import Link from "next/link"
import { cn } from "@/lib/utils"
import type { Project } from "@/lib/data"

export function ProjectCard({
  project,
  featured,
}: {
  project: Project
  featured?: boolean
}) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={cn(
        "group block bg-white/10 dark:bg-white/5 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-xl shadow-black/5 hover:bg-white/20 dark:hover:bg-white/10 transition-all overflow-hidden",
        featured ? "col-span-1" : "col-span-1"
      )}
    >
      <div className="aspect-[16/10] overflow-hidden">
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
        ) : project.images[0] ? (
          <img
            src={project.images[0]}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
        ) : project.videos[0] ? (
          <video
            src={project.videos[0]}
            className="w-full h-full object-cover"
            muted
            autoPlay
            loop
            playsInline
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted text-sm uppercase tracking-widest">
            {project.title}
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 text-xs text-text-muted uppercase tracking-wider mb-2">
          {project.category}
        </div>
        <h3 className="text-lg font-semibold text-text-primary group-hover:opacity-70 transition-opacity">
          {project.title}
        </h3>
        <p className="mt-1 text-sm text-text-secondary line-clamp-2">
          {project.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {project.techStack.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="text-[11px] uppercase tracking-wider px-2 py-0.5 bg-white/20 dark:bg-white/10 text-text-secondary rounded-lg"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}
