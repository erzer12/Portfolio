import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LayoutWrapper } from '@/components/LayoutWrapper';
import { getAllProjectSlugs, getProjectBySlug } from '@/lib/data/projects';

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
	const project = await getProjectBySlug(slug);

	if (!project) notFound();

	return (
		<LayoutWrapper>
			<article className="space-y-8 py-4 max-w-[650px] mx-auto">
				{/* Breadcrumb */}
				<nav className="flex gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-on-surface-variant">
					<a href="/" className="hover:text-primary transition-colors">
						Home
					</a>
					<span className="text-border-muted">/</span>
					<a href="/projects" className="hover:text-primary transition-colors">
						Projects
					</a>
					<span className="text-border-muted">/</span>
					<span className="text-on-surface font-semibold">{project.title}</span>
				</nav>

				{/* Header */}
				<header className="space-y-4 border-b border-border-muted/30 pb-6">
					<p className="font-mono text-[9px] uppercase tracking-[0.15em] text-on-surface-variant/80">
						{project.category}
						{project.date ? ` · ${project.date}` : ''}
					</p>
					<h1 className="text-3xl font-bold tracking-tight text-on-surface">{project.title}</h1>
					<p className="text-sm leading-relaxed text-on-surface-variant">{project.description}</p>

					{/* Links */}
					<div className="flex flex-wrap gap-3 pt-2 font-mono text-[10px] uppercase tracking-[0.1em]">
						{project.github && (
							<a
								href={project.github}
								target="_blank"
								rel="noopener noreferrer"
								className="border border-border-muted px-3 py-1.5 text-on-surface hover:border-primary transition-colors rounded"
							>
								GitHub ↗
							</a>
						)}
						{project.live && (
							<a
								href={project.live.startsWith('http') ? project.live : `https://${project.live}`}
								target="_blank"
								rel="noopener noreferrer"
								className="bg-primary border border-primary px-3 py-1.5 text-background hover:opacity-90 font-bold transition-opacity rounded"
							>
								Live Demo ↗
							</a>
						)}
					</div>
				</header>

				{/* Tags */}
				{project.tags.length > 0 && (
					<div className="flex flex-wrap gap-1.5">
						{project.tags.map((tag) => (
							<span
								key={tag}
								className="px-2 py-0.5 bg-surface-container border border-border-muted/40 rounded text-[10px] font-mono text-on-surface-variant"
							>
								{tag}
							</span>
						))}
					</div>
				)}

				{/* Full description */}
				{project.long_description && (
					<div className="space-y-3 pt-2">
						<h2 className="font-mono text-[10px] uppercase tracking-[0.15em] text-on-surface-variant font-bold">
							About
						</h2>
						<div className="text-sm leading-relaxed text-on-surface-variant space-y-4">
							{project.long_description.split('\n\n').map((para) => (
								<p key={`${project.slug}-${para.slice(0, 20).replace(/[^a-z0-9]/gi, '')}`}>
									{para}
								</p>
							))}
						</div>
					</div>
				)}

				{/* Back link */}
				<div className="border-t border-border-muted/20 pt-6">
					<a
						href="/projects"
						className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.1em] text-on-surface-variant hover:text-primary transition-colors"
					>
						← All Projects
					</a>
				</div>
			</article>
		</LayoutWrapper>
	);
}
