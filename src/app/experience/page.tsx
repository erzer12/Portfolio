import type { Metadata } from 'next';
import { LayoutWrapper } from '@/components/LayoutWrapper';
import { getExperience } from '@/lib/data/experience';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
	title: 'Experience — Harshil P',
	description:
		'Work experience and engineering roles of Harshil P, including frontend engineering, leadership, and open-source contributions.',
};

export default async function ExperiencePage() {
	const experienceList = await getExperience();

	return (
		<LayoutWrapper>
			<div className="space-y-8 py-4 max-w-[680px] mx-auto">
				{/* Page Heading */}
				<header className="space-y-2">
					<h1 className="text-3xl font-semibold tracking-tight text-on-surface">Experience</h1>
					<p className="text-xs font-mono text-on-surface-variant uppercase tracking-widest">
						What I've worked on & engineering roles
					</p>
					<hr className="border-border-muted/40 mt-3" />
				</header>

				{/* Experience Entries */}
				<div className="space-y-10">
					{experienceList.map((exp, idx) => (
						<article key={exp.id || idx} className="space-y-4">
							{/* Header Row: Role & Company */}
							<div className="flex flex-wrap items-start justify-between gap-2">
								<div>
									<h2 className="text-lg font-semibold text-on-surface">
										{exp.role} <span className="text-primary">· {exp.company}</span>
									</h2>
									<p className="text-xs font-mono text-on-surface-variant mt-0.5">
										{exp.start_date} – {exp.end_date || 'Present'}
										{exp.employment_type ? ` · ${exp.employment_type}` : ''}
									</p>
								</div>

								{/* Recommendation / LOR Button */}
								{(exp.recommendation_url || exp.certificate_url) && (
									<a
										href={exp.recommendation_url || exp.certificate_url || '#'}
										target="_blank"
										rel="noopener noreferrer"
										className="px-2.5 py-1 border border-border-muted hover:border-primary text-xs font-mono text-on-surface-variant hover:text-primary transition-colors rounded flex items-center gap-1 shrink-0"
									>
										<span>LOR / Ref</span>
										<span className="material-symbols-outlined text-[12px]">open_in_new</span>
									</a>
								)}
							</div>

							{/* Description Prose if available */}
							{exp.description && (
								<p className="text-xs text-on-surface-variant leading-relaxed">{exp.description}</p>
							)}

							{/* Highlight Bullets */}
							{exp.bullets && exp.bullets.length > 0 && (
								<ul className="list-disc pl-5 text-xs text-on-surface-variant space-y-1.5 leading-relaxed font-sans">
									{exp.bullets.map((bullet) => (
										<li key={bullet}>{bullet}</li>
									))}
								</ul>
							)}

							{/* Tag Row */}
							{exp.tags && exp.tags.length > 0 && (
								<div className="flex flex-wrap gap-1.5 pt-1">
									{exp.tags.map((tag) => (
										<span
											key={tag}
											className="px-2 py-0.5 bg-surface-container border border-border-muted/40 rounded-full text-[10px] font-mono text-on-surface-variant"
										>
											{tag}
										</span>
									))}
								</div>
							)}

							{idx < experienceList.length - 1 && <hr className="border-border-muted/30 pt-4" />}
						</article>
					))}

					{experienceList.length === 0 && (
						<p className="text-xs font-mono text-on-surface-variant py-4">
							No experience entries listed.
						</p>
					)}
				</div>
			</div>
		</LayoutWrapper>
	);
}
