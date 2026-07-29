'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Project } from '@/types';

type ProjectsGridProps = {
	projects: Project[];
};

export function ProjectsGrid({ projects }: ProjectsGridProps) {
	const [activeFilter, setActiveFilter] = useState<string>('All');

	// Extract unique tags sorted alphabetically
	const allTags = useMemo(() => {
		const tags = new Set<string>();
		for (const p of projects) {
			if (p.tags) {
				for (const tag of p.tags) {
					tags.add(tag);
				}
			}
		}
		return ['All', ...Array.from(tags).sort()];
	}, [projects]);

	// Filter projects client-side
	const filteredProjects = useMemo(() => {
		if (activeFilter === 'All') return projects;
		return projects.filter((p) => p.tags?.includes(activeFilter));
	}, [projects, activeFilter]);

	return (
		<div className="space-y-6">
			{/* Filters Row */}
			<div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-border-muted/30">
				<h1 className="text-xl font-bold tracking-tight text-on-surface">All Projects</h1>

				<div className="flex flex-wrap gap-1.5 justify-start md:justify-end">
					{allTags.map((tag) => (
						<button
							key={tag}
							type="button"
							onClick={() => setActiveFilter(tag)}
							className={`px-2.5 py-1 text-[10px] rounded font-mono transition-all duration-150 ${
								activeFilter === tag
									? 'bg-primary border-primary text-background font-bold shadow-sm'
									: 'bg-transparent border border-border-muted text-on-surface-variant hover:border-on-surface hover:text-on-surface'
							}`}
						>
							{tag}
						</button>
					))}
				</div>
			</div>

			{/* Project Cards Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
				{filteredProjects.map((project) => (
					<div
						key={project.id}
						className="group flex flex-col justify-between bg-surface-container border border-border-muted hover:border-primary hover:shadow-md hover:-translate-y-[2px] transition-all duration-200 rounded-xl overflow-hidden"
					>
						{/* Card Header Bar */}
						<div className="bg-surface-container-high px-4 py-2.5 flex items-center justify-between border-b border-border-muted">
							<span className="material-symbols-outlined text-[16px] text-tertiary">folder</span>
							<div className="flex items-center gap-3">
								{project.github && (
									<a
										href={project.github}
										target="_blank"
										rel="noopener noreferrer"
										className="text-on-surface-variant hover:text-primary transition-colors flex items-center"
										title="GitHub Repository"
									>
										<span className="sr-only">GitHub Repository</span>
										<svg
											className="w-3.5 h-3.5 fill-currentColor"
											viewBox="0 0 24 24"
											aria-hidden="true"
										>
											<title>GitHub</title>
											<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
										</svg>
									</a>
								)}
								{project.live && (
									<a
										href={
											project.live.startsWith('http') ? project.live : `https://${project.live}`
										}
										target="_blank"
										rel="noopener noreferrer"
										className="text-on-surface-variant hover:text-primary transition-colors flex items-center"
										title="Live Demo"
									>
										<span className="material-symbols-outlined text-[14px]">open_in_new</span>
									</a>
								)}
							</div>
						</div>

						{/* Card Body */}
						<div className="p-4 flex flex-col flex-grow justify-between">
							<div className="space-y-2">
								<h3 className="font-sans text-sm font-bold text-primary hover:underline">
									<Link href={`/projects/${project.slug}`}>{project.title}</Link>
								</h3>
								<p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
									{project.description}
								</p>
							</div>

							{/* Tech tags */}
							<div className="mt-4 pt-3 border-t border-border-muted/30 flex items-center justify-between">
								<div className="flex flex-wrap gap-1">
									{project.tags.map((tag) => (
										<span
											key={tag}
											className="px-1.5 py-0.5 bg-surface-container-highest border border-border-muted/40 rounded-[3px] text-[8px] font-mono text-on-surface-variant"
										>
											{tag}
										</span>
									))}
								</div>
								<span className="font-mono text-[9px] text-on-surface-variant/75 shrink-0 pl-2">
									{project.date || 'Active'}
								</span>
							</div>
						</div>
					</div>
				))}

				{filteredProjects.length === 0 && (
					<p className="text-xs font-mono text-on-surface-variant py-4 col-span-full">
						No projects matching this filter.
					</p>
				)}
			</div>
		</div>
	);
}
