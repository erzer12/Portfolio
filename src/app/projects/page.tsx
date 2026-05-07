import { getProjects } from '@/lib/data/projects';
import { MinimalFooter } from '@/components/layout/MinimalFooter';
import { MinimalNav } from '@/components/layout/MinimalNav';
import { SectionRule } from '@/components/resume/SectionRule';

export const dynamic = 'force-dynamic';


export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main className="mx-auto min-h-screen max-w-[760px] px-4 py-6 text-sm text-[--ink]">
      <MinimalNav name="HP." email="harshilp1234@gmail.com" github="https://github.com/erzer12" />

      <div className="space-y-10 py-10">
        <header>
          <a
            href="/"
            className="font-mono text-xs uppercase tracking-[0.14em] text-[--ink-muted] hover:text-[--ink]"
          >
            ← Back
          </a>
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-[--ink-muted]">
            All Projects
          </p>
          <h1 className="mt-2 font-serif text-4xl italic text-[--ink]">Selected work</h1>
        </header>

        {projects.map((project, index) => (
          <section key={project.id}>
            <div className="grid gap-4 md:grid-cols-[2.5rem_1fr] md:gap-6">
              {/* Index number */}
              <div className="font-mono text-xs text-[--ink-faint]">
                {String(index + 1).padStart(2, '0')}
              </div>

              {/* Content */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-3xl italic text-[--ink]">
                      <a
                        href={`/projects/${project.slug}`}
                        className="hover:underline decoration-[--rule] underline-offset-4"
                      >
                        {project.title}
                      </a>
                    </h2>
                    <p className="mt-1 font-mono text-xs uppercase tracking-[0.14em] text-[--ink-muted]">
                      {project.category}
                      {project.date ? ` · ${project.date}` : ''}
                    </p>
                  </div>
                </div>

                <p className="max-w-2xl leading-7 text-[--ink-muted]">{project.description}</p>

                <div className="flex flex-wrap gap-2 font-mono text-xs">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded border border-[--tag-border] px-2 py-0.5 text-[--tag-text]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4 font-mono text-xs uppercase tracking-[0.14em] text-[--ink-muted]">
                  {project.github && <a href={project.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>}
                  {project.live && <a href={project.live} target="_blank" rel="noopener noreferrer">Live Demo ↗</a>}
                  <a href={`/projects/${project.slug}`} className="text-[--ink]">Details →</a>
                </div>
              </div>
            </div>

            {index < projects.length - 1 && <SectionRule className="mt-10" />}
          </section>
        ))}

        {projects.length === 0 && (
          <p className="font-mono text-xs text-[--ink-muted]">No projects yet.</p>
        )}
      </div>

      <MinimalFooter />
    </main>
  );
}
