'use client';

import type { Project } from '@/types';
import { ProjectCard } from './ProjectCard';

type FeaturedProjectsProps = {
	items: Project[];
	viewAllHref?: string;
};

export function FeaturedProjects({ items, viewAllHref = '/projects' }: FeaturedProjectsProps) {
	const featuredItems = items.slice(0, 2);

	return (
		<section id="projects" className="space-y-4 pt-3 pb-1" aria-label="Featured Projects">
			{/* Section Header */}
			<div className="flex items-center justify-between border-b border-surface0/60 pb-2.5">
				<h2 className="flex items-center gap-2 text-lg sm:text-xl font-bold text-text">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="text-accent"
					>
						<title>Star Icon</title>
						<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
					</svg>
					<span>Featured Projects</span>
				</h2>

				<a
					href={viewAllHref}
					className="group text-accent hover:underline inline-flex items-center gap-1 text-xs font-mono font-medium"
				>
					<span>View all ({items.length})</span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="13"
						height="13"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="transition-transform duration-200 group-hover:translate-x-0.5"
					>
						<title>Arrow Right</title>
						<line x1="5" y1="12" x2="19" y2="12" />
						<polyline points="12 5 19 12 12 19" />
					</svg>
				</a>
			</div>

			{/* Responsive 2-Card Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 items-stretch">
				{featuredItems.map((item, idx) => (
					<ProjectCard key={item.id} project={item} index={idx + 1} />
				))}
			</div>

			{items.length === 0 && (
				<div className="rounded-xl border border-surface0 bg-mantle p-8 text-center text-subtext0 font-mono text-sm">
					No featured projects available right now. Mark projects as featured in the CMS dashboard.
				</div>
			)}
		</section>
	);
}
