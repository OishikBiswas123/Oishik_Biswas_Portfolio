import { ProjectCard } from "@/components/project-card"
import { projects } from "@/lib/data"

export default function ProjectsPage() {
  return (
    <div className="pt-24 pb-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-text-primary">
            Projects
          </h1>
          <p className="mt-4 text-text-secondary max-w-lg">
            A selection of things I&apos;ve built — from web apps to full-stack
            systems.
          </p>
        </div>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 text-text-muted">
            <p className="text-sm uppercase tracking-widest">
              Projects coming soon
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
