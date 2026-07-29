import type { Metadata } from 'next';
import { LayoutWrapper } from '@/components/LayoutWrapper';
import { getAchievements } from '@/lib/data/achievements';
import { getCertifications } from '@/lib/data/certifications';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
	title: 'Achievements & Certifications — Harshil P',
	description:
		'Honors, awards, NASA Space Apps nominations, and industry certifications achieved by Harshil P.',
};

export default async function AchievementsPage() {
	const [achievements, certifications] = await Promise.all([
		getAchievements(),
		getCertifications(),
	]);

	return (
		<LayoutWrapper>
			<div className="space-y-12 py-4 max-w-[680px] mx-auto">
				{/* Page Heading */}
				<header className="space-y-2">
					<h1 className="text-3xl font-semibold tracking-tight text-on-surface">
						Achievements & Honors
					</h1>
					<p className="text-xs font-mono text-on-surface-variant uppercase tracking-widest">
						Competitions, awards & accredited certifications
					</p>
					<hr className="border-border-muted/40 mt-3" />
				</header>

				{/* Section 1: Major Achievements */}
				<section className="space-y-6">
					<h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">
						Recognitions
					</h2>

					<div className="space-y-8">
						{achievements.map((ach) => (
							<article key={ach.id} className="space-y-2 border-b border-border-muted/30 pb-6">
								<div className="flex justify-between items-start gap-4">
									<h3 className="font-semibold text-on-surface text-base flex items-center gap-1.5">
										{ach.title}
										{ach.link && (
											<a
												href={ach.link}
												target="_blank"
												rel="noopener noreferrer"
												className="text-primary hover:opacity-80 transition-opacity inline-flex items-center"
												title="View achievement detail"
											>
												<span className="material-symbols-outlined text-[14px]">open_in_new</span>
											</a>
										)}
									</h3>
									<span className="font-mono text-xs text-on-surface-variant shrink-0">
										{ach.date}
									</span>
								</div>

								{ach.description && (
									<p className="text-xs text-on-surface-variant leading-relaxed font-sans">
										{ach.description}
									</p>
								)}
							</article>
						))}

						{achievements.length === 0 && (
							<p className="text-xs font-mono text-on-surface-variant">No achievements listed.</p>
						)}
					</div>
				</section>

				{/* Section 2: Certifications List */}
				<section className="space-y-6">
					<h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">
						Certifications
					</h2>

					<div className="border border-border-muted/50 rounded-xl divide-y divide-border-muted/30 overflow-hidden bg-surface-container/30">
						{certifications.map((cert) => (
							<div
								key={cert.id}
								className="p-4 flex items-center justify-between gap-4 hover:bg-surface-container-high/40 transition-colors"
							>
								<div className="flex items-center gap-3 min-w-0">
									<div className="w-8 h-8 rounded-lg bg-surface-container-high border border-border-muted flex items-center justify-center shrink-0 overflow-hidden">
										{cert.image ? (
											<>
												{/* biome-ignore lint/performance/noImgElement: cert badge external image */}
												<img
													src={cert.image}
													alt={cert.name}
													className="w-full h-full object-cover"
												/>
											</>
										) : (
											<span className="material-symbols-outlined text-[18px] text-tertiary">
												workspace_premium
											</span>
										)}
									</div>
									<div className="min-w-0">
										<div className="text-xs font-bold text-on-surface truncate" title={cert.name}>
											{cert.name}
										</div>
										<div className="text-[10px] text-on-surface-variant/80 font-mono">
											{cert.issuer}
										</div>
									</div>
								</div>

								<div className="flex items-center gap-3 shrink-0">
									<span className="text-[10px] font-mono text-on-surface-variant">{cert.date}</span>
									{cert.link && (
										<a
											href={cert.link}
											target="_blank"
											rel="noopener noreferrer"
											className="text-primary hover:opacity-80 transition-opacity flex items-center"
											title="Verify Credential"
										>
											<span className="material-symbols-outlined text-[14px]">open_in_new</span>
										</a>
									)}
								</div>
							</div>
						))}
					</div>
				</section>
			</div>
		</LayoutWrapper>
	);
}
