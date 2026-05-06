import { MinimalFooter } from '@/components/layout/MinimalFooter';
import { MinimalNav } from '@/components/layout/MinimalNav';
import { SectionRule } from '@/components/resume/SectionRule';

const projects = [
  { index: '01', name: 'NewsHunt', category: 'Discord Bot', date: 'May 2025', description: 'Automates news collection and delivery for focused workflows.', tags: ['Python', 'discord.py', 'Flask', 'MongoDB'], github: '#', live: '#' },
  { index: '02', name: 'HR Agent', category: 'AI Workflow', date: '2025', description: 'Helps organize hiring tasks and summarize information with less friction.', tags: ['Python', 'GPT', 'Flask'], github: '#', live: '#' },
  { index: '03', name: 'Portfolio Rebuild', category: 'Web App', date: '2026', description: 'The current rebuild that establishes the new resume-first structure.', tags: ['Next.js', 'TypeScript', 'Supabase'], github: '#', live: '#' },
];

export default function ProjectsPage() {
  return (
    <main className="mx-auto min-h-screen max-w-[760px] px-4 py-6 text-sm text-neutral-900">
      <MinimalNav name="Back" email="/" github="/" />

      <div className="space-y-10 py-10">
        <header>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-500">All Projects</p>
          <h1 className="mt-3 font-serif text-4xl italic">Selected work</h1>
        </header>

        {projects.map((project, index) => (
          <section key={project.name}>
            <div className="grid gap-4 md:grid-cols-[2.5rem_1fr] md:gap-6">
              <div className="font-mono text-xs text-neutral-500">{project.index}</div>
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-3xl italic text-neutral-900">{project.name}</h2>
                    <p className="font-mono text-xs uppercase tracking-[0.14em] text-neutral-500">
                      {project.category} · {project.date}
                    </p>
                  </div>
                  <div className="font-mono text-xs text-neutral-500">{String(index + 1).padStart(2, '0')}</div>
                </div>

                <p className="max-w-2xl leading-7 text-neutral-700">{project.description}</p>

                <div className="flex flex-wrap gap-2 font-mono text-xs text-neutral-600">
                  {project.tags.map((tag) => (
                    <span key={tag} className="rounded border border-neutral-300 px-2 py-0.5">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4 font-mono text-xs uppercase tracking-[0.14em] text-neutral-500">
                  <a href={project.github}>GitHub ↗</a>
                  <a href={project.live}>Live Demo ↗</a>
                </div>
              </div>
            </div>

            {index < projects.length - 1 ? <SectionRule className="mt-10" /> : null}
          </section>
        ))}
      </div>

      <MinimalFooter />
    </main>
  );
}
