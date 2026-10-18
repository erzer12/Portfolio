import { ArrowLeft, ArrowRight, CheckCircle2, ExternalLink, Layers } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FaGithub } from 'react-icons/fa6';
import { MinimalFooter } from '@/components/layout/Footer';
import { MinimalNav } from '@/components/layout/Navigation';
import { getCaseStudy } from '@/lib/data/case-studies';
import { getFooterLinks } from '@/lib/data/footer';
import { getProfile } from '@/lib/data/profile';
import { getAllProjectSlugs, getProjectBySlug, getProjects } from '@/lib/data/projects';
import { displayText, ensureExternalUrl } from '@/lib/utils';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
	if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
		return [{ slug: 'signstream' }, { slug: 'h-r-e' }, { slug: 'zen' }];
	}
	const slugs = await getAllProjectSlugs();
	const uniqueSlugs = new Set([...slugs, 'signstream', 'h-r-e', 'zen']);
	return Array.from(uniqueSlugs).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;
	const normalizedSlug = slug.toLowerCase() === 'historical-risk-explorer' ? 'h-r-e' : slug;
	const caseStudy = getCaseStudy(normalizedSlug);
	const project = await getProjectBySlug(normalizedSlug);

	const title = project?.title || caseStudy?.title || 'Project Detail';
	const description = project?.description || caseStudy?.tagline || 'Technical project detail';

	return {
		title: `${title} — Harshil P`,
		description,
	};
}

export default async function ProjectDetailPage({ params }: Props) {
	const { slug } = await params;

	// Normalize slug aliases
	const normalizedSlug = slug.toLowerCase() === 'historical-risk-explorer' ? 'h-r-e' : slug;

	const [profile, projectFromDb, caseStudy, allProjects, footerLinks] = await Promise.all([
		getProfile(),
		getProjectBySlug(normalizedSlug),
		Promise.resolve(getCaseStudy(normalizedSlug)),
		getProjects(),
		getFooterLinks(),
	]);

	if (!projectFromDb && !caseStudy) {
		notFound();
	}

	// Merge DB attributes with case study specifications
	const title = projectFromDb?.title || caseStudy?.title || 'Project Detail';
	const tagline = projectFromDb?.description || caseStudy?.tagline || '';
	const longDescription = projectFromDb?.long_description || '';
	const category = projectFromDb?.category || caseStudy?.category || 'Engineering';
	const date = projectFromDb?.date || caseStudy?.date || '';
	const githubUrl = ensureExternalUrl(projectFromDb?.github || caseStudy?.githubUrl);
	const liveUrl = ensureExternalUrl(projectFromDb?.live || caseStudy?.liveUrl);
	const tags = projectFromDb?.tags?.length
		? projectFromDb.tags
		: caseStudy?.techStack.flatMap((s) => s.items) || ['Engineering', 'Software'];

	// Determine next and previous projects for navigation
	const projectList: Array<{ slug: string; title?: string }> =
		allProjects.length > 0
			? allProjects
			: [
					{ slug: 'signstream', title: 'SignStream' },
					{ slug: 'h-r-e', title: 'Historical Risk Explorer' },
					{ slug: 'zen', title: 'Zen' },
				];
	const currentIndex = projectList.findIndex((p) => p.slug === normalizedSlug || p.slug === slug);
	const prevProject =
		currentIndex > 0 ? projectList[currentIndex - 1] : projectList[projectList.length - 1];
	const nextProject =
		currentIndex >= 0 && currentIndex < projectList.length - 1
			? projectList[currentIndex + 1]
			: projectList[0];

	// Extract overview fields either from case study or synthesis
	const overviewProblem =
		caseStudy?.overview?.problem ||
		'Designing resilient, accessible systems requires balancing user latency, computational efficiency, and maintainable software architecture.';
	const overviewSolution =
		caseStudy?.overview?.solution ||
		longDescription ||
		tagline ||
		'Architected with clean component boundaries, modular service layers, and production-tested patterns.';

	return (
		<div className="min-h-screen bg-base text-text selection:bg-surface1 selection:text-accent font-mono transition-colors">
			<MinimalNav
				name={profile?.name ?? 'harshil'}
				email={profile?.email ?? 'harshilp1234@gmail.com'}
				github={profile?.social?.github ?? 'https://github.com/erzer12'}
				resume={profile?.resume}
				linkedin={profile?.social?.linkedin ?? 'https://www.linkedin.com/in/harshilp1/'}
			/>

			<main className="mx-auto max-w-7xl px-6 sm:px-8 md:px-12 lg:px-16 py-6 sm:py-10 space-y-10">
				{/* Breadcrumb Navigation */}
				<nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-subtext1">
					<Link href="/" className="hover:text-accent transition-colors">
						~
					</Link>
					<span className="text-surface2">/</span>
					<Link href="/projects" className="hover:text-accent transition-colors">
						projects
					</Link>
					<span className="text-surface2">/</span>
					<span className="text-accent font-bold">{normalizedSlug}</span>
				</nav>

				{/* ─── Section 1: Standardized Project Header ──────────────────── */}
				<header className="border border-surface0/80 bg-mantle rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
					<div className="flex flex-wrap items-center justify-between gap-3 text-xs">
						<div className="flex items-center gap-2.5">
							<span className="px-2.5 py-1 rounded-md bg-surface0 text-accent font-bold uppercase tracking-wider text-[11px]">
								{displayText(category)}
							</span>
							{date && (
								<span className="text-subtext1 text-[11px] font-medium">{displayText(date)}</span>
							)}
							{liveUrl && (
								<span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface0/60 border border-surface1/40 text-[10.5px] text-subtext1">
									<span className="w-1.5 h-1.5 rounded-full bg-accent" />
									<span>Live</span>
								</span>
							)}
						</div>

						<Link
							href="/projects"
							className="inline-flex items-center gap-1.5 text-xs text-subtext1 hover:text-accent transition-colors"
						>
							<ArrowLeft className="w-3.5 h-3.5" />
							<span>Back to all projects</span>
						</Link>
					</div>

					<div className="space-y-3">
						<h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-text leading-tight">
							{displayText(title)}
						</h1>
						<p className="text-sm sm:text-[15px] md:text-[16px] text-subtext0 leading-relaxed font-sans max-w-3xl">
							{displayText(tagline)}
						</p>
					</div>

					{/* Action Buttons: Live Demo & GitHub */}
					<div className="flex flex-wrap items-center gap-3 pt-2">
						{liveUrl && (
							<a
								href={liveUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="px-4 py-2.5 rounded-lg bg-accent text-accent-fg font-bold hover:brightness-110 active:scale-95 transition-all inline-flex items-center gap-2 shadow-sm text-xs font-mono"
							>
								<ExternalLink className="w-3.5 h-3.5" />
								<span>Launch Live Demo</span>
							</a>
						)}

						{githubUrl && (
							<a
								href={githubUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="px-4 py-2.5 rounded-lg bg-surface0 hover:bg-surface1 text-text hover:text-accent border border-surface1/60 transition-colors inline-flex items-center gap-2 text-xs font-mono"
							>
								<FaGithub className="w-4 h-4" />
								<span>GitHub Repository</span>
								<span>↗</span>
							</a>
						)}
					</div>

					{/* Standardized Tags List */}
					{tags.length > 0 && (
						<div className="flex flex-wrap gap-1.5 pt-3 border-t border-surface0/60">
							{tags.map((tag) => (
								<span
									key={tag}
									className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-surface0/50 text-subtext1 border border-surface1/40 hover:text-text hover:border-surface1 transition-colors"
								>
									{displayText(tag)}
								</span>
							))}
						</div>
					)}
				</header>

				{/* ─── Section 2: Standardized Overview & Problem-Solution Matrix ─── */}
				<section className="border border-surface0/80 bg-mantle rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
					<div className="flex items-center gap-2 border-b border-surface0/60 pb-3">
						<span className="text-accent font-bold">{'//'}</span>
						<h2 className="text-base font-bold text-text uppercase tracking-wider">
							Overview & Technical Context
						</h2>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-sans">
						<div className="space-y-2.5 bg-surface0/30 p-5 rounded-xl border border-surface0/70 flex flex-col justify-between">
							<h3 className="font-mono text-xs font-bold text-text uppercase tracking-wider flex items-center gap-2">
								<span className="w-1.5 h-1.5 rounded-full bg-accent" />
								<span>Problem & Motivation</span>
							</h3>
							<p className="text-xs sm:text-sm text-subtext0 leading-relaxed flex-grow">
								{displayText(overviewProblem)}
							</p>
						</div>

						<div className="space-y-2.5 bg-surface0/30 p-5 rounded-xl border border-surface0/70 flex flex-col justify-between">
							<h3 className="font-mono text-xs font-bold text-text uppercase tracking-wider flex items-center gap-2">
								<span className="w-1.5 h-1.5 rounded-full bg-accent" />
								<span>Architectural Solution</span>
							</h3>
							<p className="text-xs sm:text-sm text-subtext0 leading-relaxed flex-grow">
								{displayText(overviewSolution)}
							</p>
						</div>
					</div>

					{/* Deep Dive / Long Description if available */}
					{longDescription && longDescription !== overviewSolution && (
						<div className="pt-3 border-t border-surface0/60 space-y-3 font-sans">
							<h3 className="font-mono text-xs font-bold text-text uppercase tracking-wider">
								Implementation Details
							</h3>
							<div className="space-y-3 text-xs sm:text-sm text-subtext0 leading-relaxed">
								{longDescription
									.split(/\r?\n+/)
									.map((p) => p.trim())
									.filter(Boolean)
									.map((para) => (
										<p key={para.slice(0, 30)}>{para}</p>
									))}
							</div>
						</div>
					)}
				</section>

				{/* ─── Section 3: Standardized Technical Architecture Pipeline ─── */}
				{caseStudy?.architecture?.steps && caseStudy.architecture.steps.length > 0 && (
					<section className="border border-surface0/80 bg-mantle rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
						<div className="flex items-center gap-2 border-b border-surface0/60 pb-3">
							<span className="text-accent font-bold">{'//'}</span>
							<h2 className="text-base font-bold text-text uppercase tracking-wider">
								Execution Pipeline & Architecture
							</h2>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{caseStudy.architecture.steps.map((step) => (
								<div
									key={step.number}
									className="p-4 rounded-xl border border-surface0/80 bg-surface0/20 space-y-2 flex flex-col justify-between hover:border-surface1 transition-colors"
								>
									<div className="flex items-center justify-between font-mono text-xs">
										<span className="text-accent font-bold">{step.number}</span>
										<span className="text-[10px] px-2 py-0.5 rounded bg-surface0 text-subtext1 border border-surface1/40">
											{step.tech}
										</span>
									</div>
									<h4 className="font-bold text-sm text-text font-mono">{step.title}</h4>
									<p className="text-xs text-subtext0 font-sans leading-relaxed">
										{step.description}
									</p>
								</div>
							))}
						</div>
					</section>
				)}

				{/* ─── Section 4: Engineering Highlights & Responsibilities ────── */}
				{caseStudy?.contribution && (
					<section className="border border-surface0/80 bg-mantle rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
						<div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface0/60 pb-3">
							<div className="flex items-center gap-2">
								<span className="text-accent font-bold">{'//'}</span>
								<h2 className="text-base font-bold text-text uppercase tracking-wider">
									Key Decisions & Engineering Highlights
								</h2>
							</div>
							<span className="text-xs font-mono px-2.5 py-0.5 rounded bg-surface0 text-accent font-semibold">
								{caseStudy.contribution.nature}
							</span>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
							{caseStudy.contribution.keyResponsibilities?.length > 0 && (
								<div className="space-y-3">
									<h3 className="font-mono text-xs font-bold text-text uppercase tracking-wider flex items-center gap-1.5">
										<CheckCircle2 className="w-3.5 h-3.5 text-accent" />
										<span>Implementation Scope</span>
									</h3>
									<ul className="space-y-2 text-xs sm:text-sm text-subtext0">
										{caseStudy.contribution.keyResponsibilities.map((resp) => (
											<li key={resp} className="flex items-start gap-2">
												<span className="text-accent font-mono select-none mt-0.5">▸</span>
												<span>{resp}</span>
											</li>
										))}
									</ul>
								</div>
							)}

							{caseStudy.contribution.technicalDecisions?.length > 0 && (
								<div className="space-y-3">
									<h3 className="font-mono text-xs font-bold text-text uppercase tracking-wider flex items-center gap-1.5">
										<Layers className="w-3.5 h-3.5 text-accent" />
										<span>Architectural Trade-offs</span>
									</h3>
									<ul className="space-y-2 text-xs sm:text-sm text-subtext0">
										{caseStudy.contribution.technicalDecisions.map((decision) => (
											<li key={decision} className="flex items-start gap-2">
												<span className="text-accent font-mono select-none mt-0.5">▸</span>
												<span>{decision}</span>
											</li>
										))}
									</ul>
								</div>
							)}
						</div>
					</section>
				)}

				{/* ─── Section 5: Standardized Bottom Project Navigation ───────── */}
				<footer className="border-t border-surface0/60 pt-6 space-y-6 font-mono text-xs">
					<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
						{prevProject && (
							<Link
								href={`/projects/${prevProject.slug}`}
								className="group p-3.5 rounded-xl border border-surface0 hover:border-accent bg-mantle transition-all flex items-center gap-3 w-full sm:w-auto text-left"
							>
								<ArrowLeft className="w-4 h-4 text-subtext1 group-hover:text-accent transition-colors" />
								<div>
									<div className="text-[10px] text-subtext1">Previous Project</div>
									<div className="text-xs font-bold text-text group-hover:text-accent transition-colors">
										{displayText(prevProject.title || prevProject.slug)}
									</div>
								</div>
							</Link>
						)}

						<Link
							href="/projects"
							className="text-subtext1 hover:text-accent inline-flex items-center gap-1.5 transition-colors font-medium"
						>
							<span>All Projects Index</span>
							<span>↑</span>
						</Link>

						{nextProject && (
							<Link
								href={`/projects/${nextProject.slug}`}
								className="group p-3.5 rounded-xl border border-surface0 hover:border-accent bg-mantle transition-all flex items-center gap-3 w-full sm:w-auto text-right justify-end"
							>
								<div>
									<div className="text-[10px] text-subtext1">Next Project</div>
									<div className="text-xs font-bold text-text group-hover:text-accent transition-colors">
										{displayText(nextProject.title || nextProject.slug)}
									</div>
								</div>
								<ArrowRight className="w-4 h-4 text-subtext1 group-hover:text-accent transition-colors" />
							</Link>
						)}
					</div>
				</footer>
			</main>

			<MinimalFooter
				links={footerLinks}
				email={profile?.email}
				github={profile?.social?.github}
				linkedin={profile?.social?.linkedin}
				instagram={profile?.social?.instagram}
			/>
		</div>
	);
}
