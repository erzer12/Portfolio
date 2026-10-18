'use client';

import { ArrowUpRight, Code2, GitPullRequest, GraduationCap, Rocket } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';
import { ensureExternalUrl } from '@/lib/utils';

export type Milestone = {
	id: string;
	title: string;
	organization: string;
	date: string;
	description: string;
	link?: {
		url: string;
		label: string;
		isInternal?: boolean;
	};
	icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
	accentColor: string;
};

const MILESTONES: Milestone[] = [
	{
		id: 'mulearn',
		title: 'Frontend Intern',
		organization: 'MuLearn Foundation',
		date: 'January 2026 – Present',
		description:
			'Built reusable frontend components and integrated REST APIs for the MuLearn dashboard, serving 60,000+ members in the developer community.',
		link: {
			url: 'https://mulearn.org',
			label: 'mulearn.org',
		},
		icon: Code2,
		accentColor: 'var(--color-peach)',
	},
	{
		id: 'nasa',
		title: 'Global Nominee',
		organization: 'NASA Space Apps Challenge 2025',
		date: 'October 2025',
		description:
			'Developed an interactive environmental risk-analysis platform utilizing historical NASA Earth observation datasets and anomaly distributions.',
		link: {
			url: '/projects/h-r-e',
			label: 'View Case Study',
			isInternal: true,
		},
		icon: Rocket,
		accentColor: 'var(--color-blue)',
	},
	{
		id: 'festive',
		title: 'Open-Source Contributor',
		organization: 'Inovus Labs / Festive.js',
		date: 'October 2025',
		description:
			'Contributed configurable seasonal themes and optimized core SDK event dispatchers for Festive.js during Hacktoberfest 2025.',
		link: {
			url: 'https://github.com/inovus-labs',
			label: 'Inovus Labs',
		},
		icon: GitPullRequest,
		accentColor: 'var(--color-green)',
	},
	{
		id: 'education',
		title: 'B.Tech Computer Science (AI & ML)',
		organization: 'College of Engineering Kottarakkara',
		date: '2023 – 2027',
		description:
			'Undergraduate study specializing in Artificial Intelligence, Machine Learning systems, and Computer Science fundamentals · 7.77 CGPA.',
		icon: GraduationCap,
		accentColor: 'var(--color-mauve)',
	},
];

export function ExperienceTimeline() {
	return (
		<div className="relative w-full py-4 select-none">
			{/* ─── DESKTOP S-SHAPED CURVE TIMELINE (>= 768px) ─────────────────── */}
			<div className="hidden md:block relative w-full max-w-4xl mx-auto py-8">
				{/* SVG Continuous S-Curve Path */}
				<svg
					className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-full pointer-events-none"
					viewBox="0 0 280 840"
					fill="none"
					preserveAspectRatio="none"
					aria-hidden="true"
				>
					<defs>
						<linearGradient id="scurve-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
							<stop offset="0%" stopColor="var(--color-peach)" stopOpacity="0.85" />
							<stop offset="35%" stopColor="var(--color-blue)" stopOpacity="0.85" />
							<stop offset="70%" stopColor="var(--color-green)" stopOpacity="0.85" />
							<stop offset="100%" stopColor="var(--color-mauve)" stopOpacity="0.85" />
						</linearGradient>
					</defs>

					{/* Smooth S-shaped cubic Bézier curve meandering through nodes at Y: 70, 270, 490, 710 */}
					<path
						d="M 140 30 
							 C 70 120, 70 200, 140 270
							 C 210 340, 210 420, 140 490
							 C 70 560, 70 640, 140 710
							 L 140 810"
						stroke="url(#scurve-gradient)"
						strokeWidth="2.5"
						strokeDasharray="6 4"
						className="motion-safe:animate-pulse"
					/>
				</svg>

				{/* Alternating Milestone Items */}
				<div className="relative space-y-16">
					{MILESTONES.map((milestone, index) => {
						const isLeft = index % 2 === 0;
						const Icon = milestone.icon;

						return (
							<div
								key={milestone.id}
								className={`relative flex items-center ${
									isLeft ? 'flex-row' : 'flex-row-reverse'
								} justify-between`}
							>
								{/* Timeline Card */}
								<div className="w-[42%]">
									<div
										className="group p-5 rounded-xl border border-surface0/80 bg-mantle hover:bg-surface0/30 hover:border-surface1 transition-all duration-200 shadow-sm hover:shadow-md space-y-2 relative"
										style={{
											borderLeftWidth: isLeft ? '3px' : '1px',
											borderRightWidth: !isLeft ? '3px' : '1px',
											borderLeftColor: isLeft ? milestone.accentColor : undefined,
											borderRightColor: !isLeft ? milestone.accentColor : undefined,
										}}
									>
										<div className="flex items-center justify-between text-xs font-mono text-subtext1">
											<span className="font-semibold text-text">{milestone.organization}</span>
											<span className="text-[11px] opacity-80">{milestone.date}</span>
										</div>

										<h3 className="text-base font-bold font-sans text-text group-hover:text-accent transition-colors">
											{milestone.title}
										</h3>

										<p className="text-xs sm:text-sm font-sans text-subtext0 leading-relaxed">
											{milestone.description}
										</p>

										{milestone.link && (
											<div className="pt-2">
												{milestone.link.isInternal ? (
													<Link
														href={milestone.link.url}
														className="inline-flex items-center gap-1 text-xs font-mono text-accent hover:underline font-medium"
													>
														<span>{milestone.link.label}</span>
														<ArrowUpRight className="w-3 h-3" />
													</Link>
												) : (
													<a
														href={ensureExternalUrl(milestone.link.url)}
														target="_blank"
														rel="noopener noreferrer"
														className="inline-flex items-center gap-1 text-xs font-mono text-accent hover:underline font-medium"
													>
														<span>{milestone.link.label}</span>
														<ArrowUpRight className="w-3 h-3" />
													</a>
												)}
											</div>
										)}
									</div>
								</div>

								{/* Center Marker Node */}
								<div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center z-10">
									<div
										className="w-11 h-11 rounded-full bg-mantle border-2 shadow-lg flex items-center justify-center transition-transform hover:scale-110"
										style={{ borderColor: milestone.accentColor }}
										title={milestone.title}
									>
										<Icon className="w-5 h-5" style={{ color: milestone.accentColor }} />
									</div>
								</div>

								{/* Empty spacing block for alternating balance */}
								<div className="w-[42%]" />
							</div>
						);
					})}
				</div>
			</div>

			{/* ─── MOBILE VERTICAL TIMELINE (< 768px) ───────────────────────── */}
			<div className="block md:hidden relative pl-8 sm:pl-10 py-4 space-y-8">
				{/* Straight Vertical Rail on Left */}
				<div
					className="absolute left-3.5 sm:left-4.5 top-2 bottom-2 w-0.5"
					style={{
						background:
							'linear-gradient(to bottom, var(--color-peach), var(--color-blue), var(--color-green), var(--color-mauve))',
					}}
					aria-hidden="true"
				/>

				{MILESTONES.map((milestone) => {
					const Icon = milestone.icon;

					return (
						<div key={milestone.id} className="relative space-y-2">
							{/* Node Marker along the rail */}
							<div
								className="absolute -left-[30px] sm:-left-[34px] top-1 w-8 h-8 rounded-full bg-mantle border-2 flex items-center justify-center shadow-md z-10"
								style={{ borderColor: milestone.accentColor }}
							>
								<Icon className="w-3.5 h-3.5" style={{ color: milestone.accentColor }} />
							</div>

							{/* Card */}
							<div
								className="p-4 rounded-xl border border-surface0/80 bg-mantle space-y-2 shadow-xs"
								style={{
									borderLeftWidth: '3px',
									borderLeftColor: milestone.accentColor,
								}}
							>
								<div className="flex flex-wrap items-baseline justify-between gap-1 text-[11px] font-mono text-subtext1">
									<span className="font-semibold text-text">{milestone.organization}</span>
									<span>{milestone.date}</span>
								</div>

								<h3 className="text-sm font-bold font-sans text-text">{milestone.title}</h3>

								<p className="text-xs font-sans text-subtext0 leading-relaxed">
									{milestone.description}
								</p>

								{milestone.link && (
									<div className="pt-1">
										{milestone.link.isInternal ? (
											<Link
												href={milestone.link.url}
												className="inline-flex items-center gap-1 text-xs font-mono text-accent hover:underline font-medium"
											>
												<span>{milestone.link.label}</span>
												<ArrowUpRight className="w-3 h-3" />
											</Link>
										) : (
											<a
												href={ensureExternalUrl(milestone.link.url)}
												target="_blank"
												rel="noopener noreferrer"
												className="inline-flex items-center gap-1 text-xs font-mono text-accent hover:underline font-medium"
											>
												<span>{milestone.link.label}</span>
												<ArrowUpRight className="w-3 h-3" />
											</a>
										)}
									</div>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
