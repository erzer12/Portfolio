'use client';

import { displayText } from '@/lib/utils';
import type { Experience, Project } from '@/types';

type ExperienceListProps = {
	items: Experience[];
	projects: Project[];
};

export function ExperienceList({ items, projects }: ExperienceListProps) {
	return (
		<div className="space-y-4">
			{items.map((item) => {
				const linkedProjects = item.related_projects
					? projects.filter((p) => item.related_projects.includes(p.slug))
					: [];

				return (
					<article
						key={item.id}
						className="border border-surface0/80 bg-mantle rounded-xl p-5 shadow-lg hover:border-surface1 transition-colors space-y-3 font-sans"
					>
						{/* Header row: Company, Role & Dates */}
						<div className="flex flex-wrap items-start justify-between gap-2">
							<div>
								<h3 className="text-base sm:text-lg font-bold text-text">
									{displayText(item.company)}
								</h3>
								<p className="text-sm font-medium text-accent">
									{displayText(item.role)}
									{item.employment_type ? (
										<span className="text-subtext1 font-normal font-mono text-xs ml-2 px-2 py-0.5 rounded bg-surface0">
											{displayText(item.employment_type)}
										</span>
									) : null}
								</p>
							</div>

							<p className="font-mono text-xs text-subtext1 px-2.5 py-1 rounded bg-surface0 border border-surface1/40">
								{displayText(item.start_date)} — {displayText(item.end_date ?? 'Present')}
							</p>
						</div>

						{/* Bullet achievements with developer prompt '>' */}
						{item.bullets.length > 0 && (
							<ul className="space-y-1.5 pt-1 text-sm text-subtext0">
								{item.bullets.map((bullet) => (
									<li
										key={`${item.id}-bullet-${bullet.slice(0, 15).replace(/[^a-z0-9]/gi, '')}`}
										className="flex items-start gap-2"
									>
										<span className="text-accent font-mono text-xs mt-0.5 select-none">&gt;</span>
										<span className="leading-relaxed">{bullet}</span>
									</li>
								))}
							</ul>
						)}

						{/* External credential links */}
						{(item.certificate_url || item.recommendation_url || item.repo_url) && (
							<div className="flex flex-wrap gap-3 font-mono text-xs pt-1">
								{item.repo_url && (
									<a
										href={item.repo_url}
										target="_blank"
										rel="noopener noreferrer"
										className="text-subtext1 hover:text-accent inline-flex items-center gap-1 underline underline-offset-4 decoration-surface1"
									>
										<span>Repository</span>
										<span>↗</span>
									</a>
								)}
								{item.certificate_url && (
									<a
										href={item.certificate_url}
										target="_blank"
										rel="noopener noreferrer"
										className="text-subtext1 hover:text-accent inline-flex items-center gap-1 underline underline-offset-4 decoration-surface1"
									>
										<span>Certificate</span>
										<span>↗</span>
									</a>
								)}
								{item.recommendation_url && (
									<a
										href={item.recommendation_url}
										target="_blank"
										rel="noopener noreferrer"
										className="text-subtext1 hover:text-accent inline-flex items-center gap-1 underline underline-offset-4 decoration-surface1"
									>
										<span>Recommendation</span>
										<span>↗</span>
									</a>
								)}
							</div>
						)}

						{/* Linked projects */}
						{linkedProjects.length > 0 && (
							<div className="pt-2 border-t border-surface0/60 flex flex-wrap items-center gap-2 text-xs font-mono">
								<span className="text-subtext1">Related:</span>
								{linkedProjects.map((project) => (
									<a
										key={project.slug}
										href={`/projects/${project.slug}`}
										className="inline-flex items-center gap-1 border border-surface1 px-2.5 py-0.5 rounded bg-surface0/50 text-accent hover:border-accent transition-colors"
									>
										<span>{displayText(project.title)}</span>
										<span>↗</span>
									</a>
								))}
							</div>
						)}

						{/* Tech Tags */}
						{item.tags.length > 0 && (
							<div className="flex flex-wrap gap-1.5 pt-1">
								{item.tags.map((tag) => (
									<span
										key={tag}
										className="text-xs font-mono px-2 py-0.5 rounded bg-surface0 text-subtext1"
									>
										{displayText(tag)}
									</span>
								))}
							</div>
						)}
					</article>
				);
			})}

			{items.length === 0 && (
				<div className="rounded-xl border border-surface0 bg-mantle p-6 text-center text-subtext0 font-mono text-sm">
					No experience entries yet. Add your work or leadership experiences in the CMS.
				</div>
			)}
		</div>
	);
}
