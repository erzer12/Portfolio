'use client';

import { displayText } from '@/lib/utils';
import type { Skill } from '@/types';

type SkillsTableProps = {
	items: Skill[];
};

const CATEGORY_COLORS: Record<string, string> = {
	Languages: 'var(--color-peach)',
	Frameworks: 'var(--color-teal)',
	Frontend: 'var(--color-sky)',
	Backend: 'var(--color-mauve)',
	Databases: 'var(--color-green)',
	DevOps: 'var(--color-yellow)',
	'AI & ML': 'var(--color-flamingo)',
	Tools: 'var(--color-sapphire)',
};

export function SkillsTable({ items }: SkillsTableProps) {
	return (
		<div className="border border-surface0/80 bg-mantle rounded-xl p-5 shadow-lg space-y-4 font-mono">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{items.map((item, _idx) => {
					const accentColor = CATEGORY_COLORS[item.category] || 'var(--color-accent)';
					return (
						<div
							key={item.id}
							className="space-y-2 p-3 rounded-lg bg-surface0/30 border border-surface0/60"
						>
							<div className="flex items-center gap-2">
								<span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
								<span className="text-xs font-bold text-text uppercase tracking-wider">
									{displayText(item.category)}
								</span>
							</div>

							<div className="flex flex-wrap gap-1.5 pt-1">
								{item.skills.map((skill) => (
									<span
										key={skill}
										className="text-xs px-2 py-0.5 rounded bg-surface0 text-subtext0 border border-surface1/60 hover:text-accent hover:border-accent transition-colors"
									>
										{displayText(skill)}
									</span>
								))}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
