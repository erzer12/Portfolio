import { notFound } from 'next/navigation';
import { getAllProjectSlugs, getProjectBySlug } from '@/lib/data/projects';
import { getFooterLinks } from '@/lib/data/footer';
import { MinimalFooter } from '@/components/layout/MinimalFooter';
import { MinimalNav } from '@/components/layout/MinimalNav';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  const slugs = await getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: 'Project Not Found' };
  return {
    title: `${project.title} — Harshil P`,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const [project, footerLinks] = await Promise.all([
    getProjectBySlug(slug),
    getFooterLinks(),
  ]);

  if (!project) notFound();

  return (
    <main className="mx-auto min-h-screen max-w-[760px] px-4 py-6 text-sm text-[--ink]">
      <MinimalNav name="HP." email="harshilp1234@gmail.com" github="https://github.com/erzer12" />

      <article className="space-y-8 py-10">
        {/* Breadcrumb */}
        <nav className="flex gap-2 font-mono text-xs uppercase tracking-[0.14em] text-[--ink-muted]">
          <a href="/" className="hover:text-[--ink]">Home</a>
          <span>/</span>
          <a href="/projects" className="hover:text-[--ink]">Projects</a>
          <span>/</span>
          <span className="text-[--ink]">{project.title}</span>
        </nav>

        {/* Header */}
        <header className="space-y-3 border-b border-[--rule] pb-8">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-[--ink-muted]">
            {project.category}
            {project.date ? ` · ${project.date}` : ''}
          </p>
          <h1 className="font-serif text-5xl italic text-[--ink]">{project.title}</h1>
          <p className="text-[15px] leading-7 text-[--ink-muted]">{project.description}</p>

          {/* Links */}
          <div className="flex flex-wrap gap-4 pt-2 font-mono text-xs uppercase tracking-[0.14em]">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-[--tag-border] px-3 py-1.5 text-[--ink] hover:border-[--ink] transition-colors"
              >
                GitHub ↗
              </a>
            )}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-[--ink] bg-[--ink] px-3 py-1.5 text-[--bg] hover:bg-transparent hover:text-[--ink] transition-colors"
              >
                Live Demo ↗
              </a>
            )}
          </div>
        </header>

        {/* Tags */}
        {project.tags.length > 0 && (
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
        )}

        {/* Full description */}
        {project.long_description && (
          <div className="space-y-4">
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-[--ink-muted]">
              About
            </p>
            <div className="prose-sm max-w-none space-y-4 text-[15px] leading-[1.75] text-[--ink]">
              {project.long_description.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        )}

        {/* Back link */}
        <div className="border-t border-[--rule] pt-6">
          <a
            href="/projects"
            className="font-mono text-xs uppercase tracking-[0.14em] text-[--ink-muted] hover:text-[--ink]"
          >
            ← All Projects
          </a>
        </div>
      </article>

      <MinimalFooter links={footerLinks} />
    </main>
  );
}
