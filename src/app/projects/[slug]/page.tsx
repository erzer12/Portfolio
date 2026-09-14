import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { MinimalFooter } from '@/components/layout/Footer';
import { MinimalNav } from '@/components/layout/Navigation';
import { getFooterLinks } from '@/lib/data/footer';
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
	const [project, footerLinks] = await Promise.all([getProjectBySlug(slug), getFooterLinks()]);

	if (!project) notFound();

	return (
		<div className="min-h-screen bg-base text-text selection:bg-surface1 selection:text-accent font-mono transition-colors">
			<MinimalNav
				name="harshil"
				email="harshilp1234@gmail.com"
				github="https://github.com/erzer12"
			/>

			<main className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-10">
				<article className="space-y-8">
					{/* Terminal style breadcrumb */}
					<nav className="flex items-center gap-2 text-xs font-mono text-subtext1">
						<a href="/" className="hover:text-accent">
							~
						</a>
						<span className="text-surface2">/</span>
						<a href="/projects" className="hover:text-accent">
							projects
						</a>
						<span className="text-surface2">/</span>
						<span className="text-accent font-bold">{project.slug}</span>
					</nav>

					{/* Header Box */}
					<header className="border border-surface0/80 bg-mantle rounded-xl p-6 sm:p-8 shadow-lg space-y-4">
						<div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-subtext1">
							<span className="px-2.5 py-0.5 rounded bg-surface0 text-accent font-bold">
								{project.category || 'Engineering'}
							</span>
							{project.date && <span>{project.date}</span>}
						</div>

						<h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text">
							{project.title}
						</h1>

						<p className="text-base sm:text-lg text-subtext0 leading-relaxed font-sans max-w-3xl">
							{project.description}
						</p>

						{/* Links */}
						<div className="flex flex-wrap gap-3 pt-3 text-xs font-mono">
							{project.github && (
								<a
									href={project.github}
									target="_blank"
									rel="noopener noreferrer"
									className="px-4 py-2 rounded-lg bg-surface0 hover:bg-surface1 text-text hover:text-accent border border-surface1 transition-colors inline-flex items-center gap-1.5"
								>
									<span>GitHub Repository</span>
									<span>↗</span>
								</a>
							)}
							{project.live && (
								<a
									href={project.live}
									target="_blank"
									rel="noopener noreferrer"
									className="px-4 py-2 rounded-lg bg-accent text-accent-fg font-bold hover:brightness-110 transition-all inline-flex items-center gap-1.5 shadow-md"
								>
									<span>Live Demo</span>
									<span>↗</span>
								</a>
							)}
						</div>

						{/* Tags */}
						{project.tags.length > 0 && (
							<div className="flex flex-wrap gap-1.5 pt-2 border-t border-surface0/60">
								{project.tags.map((tag) => (
									<span
										key={tag}
										className="text-xs font-mono px-2.5 py-0.5 rounded bg-surface0 text-subtext0 border border-surface1/50"
									>
										{tag}
									</span>
								))}
							</div>
						)}
					</header>

					{/* Media Preview if image exists */}
					{project.image && (
						<div className="overflow-hidden rounded-xl border border-surface0/80 shadow-lg relative aspect-video w-full bg-mantle">
							<Image
								src={project.image}
								alt={project.title}
								fill
								unoptimized
								className="object-cover"
							/>
						</div>
					)}

					{/* Long description */}
					{project.long_description && (
						<section className="border border-surface0/80 bg-mantle rounded-xl p-6 sm:p-8 shadow-lg space-y-4">
							<h2 className="text-base font-bold font-mono text-accent uppercase tracking-wider">
								{'// Architecture & Overview'}
							</h2>
							<div className="space-y-4 text-sm sm:text-base leading-relaxed text-subtext0 font-sans">
								{project.long_description.split('\n\n').map((para) => (
									<p key={`${project.slug}-${para.slice(0, 25).replace(/[^a-z0-9]/gi, '')}`}>
										{para}
									</p>
								))}
							</div>
						</section>
					)}

					{/* Back link */}
					<div className="pt-4 flex items-center justify-between text-xs font-mono">
						<a
							href="/projects"
							className="text-subtext0 hover:text-accent inline-flex items-center gap-1 transition-colors"
						>
							<span>← Back to all projects</span>
						</a>
						<a
							href="/"
							className="text-subtext0 hover:text-accent inline-flex items-center gap-1 transition-colors"
						>
							<span>Return to Home ⌂</span>
						</a>
					</div>
				</article>

				<MinimalFooter links={footerLinks} />
			</main>
		</div>
	);
}
