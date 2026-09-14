'use client';

import React, { useState } from 'react';

type Affiliation = {
	id: string;
	title: string;
	status?: string;
	role: string;
	details: string;
	tags: string[];
};

const AFFILIATIONS: Affiliation[] = [
	{
		id: 'cs-student',
		title: 'CS Undergrad',
		status: 'Current',
		role: 'B.Tech in Computer Science',
		details:
			'Third-year student focused on Data Structures, Algorithms, Backend Engineering, and AI/ML systems.',
		tags: ['C/C++', 'Python', 'System Design', 'OS'],
	},
	{
		id: 'fullstack',
		title: 'Full-Stack Builder',
		status: 'Active',
		role: 'Next.js & TypeScript Developer',
		details:
			'Building production-ready responsive applications with Next.js, React, Tailwind CSS, and Supabase.',
		tags: ['Next.js', 'React', 'TypeScript', 'Supabase'],
	},
	{
		id: 'opensource',
		title: 'Open Source',
		status: 'Continuous',
		role: 'Community Builder & Contributor',
		details:
			'Exploring open-source software, building practical developer tools, and shipping public experiments.',
		tags: ['Git', 'GitHub', 'Linux', 'API Development'],
	},
];

export function AffiliationRibbon() {
	const [activeModal, setActiveModal] = useState<Affiliation | null>(null);

	return (
		<section className="py-2" aria-label="Key Affiliations">
			<div className="flex flex-wrap items-center justify-start gap-x-4 gap-y-3 text-sm font-mono">
				{AFFILIATIONS.map((aff, idx) => (
					<React.Fragment key={aff.id}>
						<button
							type="button"
							onClick={() => setActiveModal(aff)}
							className="group inline-flex items-center gap-2 text-subtext0 hover:text-text cursor-pointer transition-colors focus:outline-none"
							aria-label={`View details for ${aff.title}`}
						>
							<span className="w-2 h-2 rounded-full bg-accent opacity-80 group-hover:scale-125 transition-transform" />
							<span className="font-medium text-text group-hover:text-accent transition-colors">
								{aff.title}
							</span>
							{aff.status && <span className="text-overlay1 text-xs">({aff.status})</span>}
						</button>

						{idx < AFFILIATIONS.length - 1 && (
							<span className="text-accent opacity-60 hidden sm:inline select-none">/</span>
						)}
					</React.Fragment>
				))}
			</div>

			{/* Interactive Popover Modal */}
			{activeModal && (
				<div
					role="dialog"
					aria-modal="true"
					className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in"
				>
					<button
						type="button"
						className="fixed inset-0 bg-crust/60 backdrop-blur-xs cursor-default border-none w-full h-full"
						onClick={() => setActiveModal(null)}
						aria-label="Close dialog backdrop"
					/>
					<div className="bg-mantle border border-surface1 rounded-xl p-5 max-w-md w-full shadow-2xl space-y-3 relative z-10 text-text">
						<div className="flex items-start justify-between">
							<div>
								<span className="text-xs font-mono text-accent uppercase tracking-wider">
									{activeModal.status}
								</span>
								<h3 className="text-lg font-bold text-text mt-0.5">{activeModal.role}</h3>
								<p className="text-xs text-subtext1 font-mono">{activeModal.title}</p>
							</div>
							<button
								type="button"
								onClick={() => setActiveModal(null)}
								className="text-subtext0 hover:text-text p-1 text-sm font-mono"
								aria-label="Close modal"
							>
								✕
							</button>
						</div>

						<p className="text-sm text-subtext0 leading-relaxed font-sans">{activeModal.details}</p>

						<div className="flex flex-wrap gap-1.5 pt-1">
							{activeModal.tags.map((t) => (
								<span
									key={t}
									className="px-2 py-0.5 text-xs font-mono rounded bg-surface0 text-accent font-medium"
								>
									{t}
								</span>
							))}
						</div>
					</div>
				</div>
			)}
		</section>
	);
}
