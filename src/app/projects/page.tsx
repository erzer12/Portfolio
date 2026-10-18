import type { Metadata } from 'next';
import Link from 'next/link';
import { MinimalFooter } from '@/components/layout/Footer';
import { MinimalNav } from '@/components/layout/Navigation';
import { ProjectCard } from '@/components/resume/ProjectCard';
import { getFooterLinks } from '@/lib/data/footer';
import { getProfile } from '@/lib/data/profile';
import { getProjects } from '@/lib/data/projects';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
	title: 'Projects & Technical Case Studies — Harshil P',
	description:
		'Applied client-side machine learning models, geospatial analysis pipelines, and full-stack software engineering projects.',
};

export default async function ProjectsPage() {
	const [profile, projects, footerLinks] = await Promise.all([
		getProfile(),
		getProjects(),
		getFooterLinks(),
	]);

	return (
		<div className="min-h-screen flex flex-col bg-base text-text selection:bg-surface1 selection:text-accent font-mono transition-colors">
			<MinimalNav
				name={profile?.name ?? 'harshil'}
				email={profile?.email ?? 'harshilp1234@gmail.com'}
				github={profile?.social?.github ?? 'https://github.com/erzer12'}
				resume={profile?.resume}
				linkedin={profile?.social?.linkedin ?? 'https://www.linkedin.com/in/harshilp1/'}
			/>

			<main className="flex-1 mx-auto w-full max-w-7xl px-6 sm:px-8 md:px-12 lg:px-16 py-6 sm:py-10 space-y-8 pb-20">
				{/* Header Section */}
				<header className="space-y-3 border-b border-surface0/60 pb-6">
					<nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-subtext1">
						<Link href="/" className="hover:text-accent transition-colors">
							~
						</Link>
						<span className="text-surface2">/</span>
						<span className="text-accent font-bold">projects</span>
					</nav>

					<div className="space-y-1">
						<h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text">Projects</h1>
						<p className="text-subtext0 text-sm font-sans max-w-2xl leading-relaxed">
							Production applications, client-side AI systems, and geospatial exploration tools.
						</p>
					</div>
				</header>

				{/* Balanced Project Card Gallery */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
					{projects.map((project, index) => (
						<ProjectCard key={project.id} project={project} index={index + 1} />
					))}
				</div>

				{projects.length === 0 && (
					<div className="p-12 rounded-xl border border-surface0 bg-mantle text-center text-subtext0 text-sm">
						No projects found in the repository.
					</div>
				)}
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
