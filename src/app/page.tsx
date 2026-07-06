import { HeroSection } from "@/components/hero-section"
import { ProjectCard } from "@/components/project-card"
import { projects, skills } from "@/lib/data"
import Link from "next/link"

export default function Home() {
  return (
    <>
      <HeroSection />

      <section className="border-t border-border-light">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-xs uppercase tracking-[0.25em] text-text-muted">
              Completed Projects
            </h2>
            <Link
              href="/projects"
              className="text-xs uppercase tracking-widest text-text-muted hover:text-text-primary transition-colors"
            >
              All Projects →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} featured />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border-light">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <h2 className="text-xs uppercase tracking-[0.25em] text-text-muted mb-12">
            Skills & Tools
          </h2>
          <div className="flex flex-wrap gap-3">
            {skills.map((skill) => (
              <span
                key={skill}
                className="px-4 py-2 border border-border-light text-sm text-text-secondary"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border-light">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
            Let&apos;s Work Together
          </h2>
          <p className="mt-4 text-text-secondary max-w-md mx-auto">
            Have a project in mind? I&apos;d love to hear about it.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-block px-8 py-3 bg-text-primary text-bg-base text-sm uppercase tracking-widest hover:opacity-90 transition-opacity"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </>
  )
}
