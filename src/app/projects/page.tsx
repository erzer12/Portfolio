import { MinimalFooter } from '@/components/layout/Footer';
import { MinimalNav } from '@/components/layout/Navigation';
import { ProjectCard } from '@/components/resume/ProjectCard';
import { getFooterLinks } from '@/lib/data/footer';
import { getProjects } from '@/lib/data/projects';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
	const [projects, footerLinks] = await Promise.all([getProjects(), getFooterLinks()]);

	return (
		<div className="min-h-screen flex flex-col bg-base text-text selection:bg-surface1 selection:text-accent font-mono transition-colors">
			<MinimalNav
				name="harshil"
				email="harshilp1234@gmail.com"
				github="https://github.com/erzer12"
			/>

			<main className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 py-6 sm:py-10 space-y-8 pb-20">
				<header className="space-y-2 border-b border-surface0/60 pb-6">
					<a
						href="/"
						className="inline-flex items-center gap-1.5 text-xs font-mono text-accent hover:underline mb-2"
					>
						<span>← Back to Home</span>
					</a>
					<h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text">
						All Projects & Experiments
					</h1>
					<p className="text-subtext0 text-sm font-sans max-w-xl leading-relaxed">
						A collection of production applications, tools, and technical experiments built over the
						years.
					</p>
				</header>

				{/* Responsive 3-Column Lab Spec Sheet Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
					{projects.map((project, index) => (
						<ProjectCard key={project.id} project={project} index={index + 1} />
					))}
				</div>

				{projects.length === 0 && (
					<div className="p-12 rounded-xl border border-surface0 bg-mantle text-center text-subtext0 text-sm">
						No projects in database yet. Add projects via the CMS dashboard.
					</div>
				)}
			</main>

			<MinimalFooter links={footerLinks} />
		</div>
	);
}
