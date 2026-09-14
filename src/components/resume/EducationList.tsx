import { displayText } from '@/lib/utils';
import type { Education } from '@/types';

type EducationListProps = {
	items: Education[];
};

export function EducationList({ items }: EducationListProps) {
	return (
		<div className="border border-surface0/80 bg-mantle rounded-xl p-5 shadow-lg space-y-4">
			{items.map((item, idx) => (
				<div
					key={item.id}
					className={`space-y-1.5 ${
						idx < items.length - 1 ? 'pb-4 border-b border-surface0/60' : ''
					}`}
				>
					<div className="flex flex-wrap items-start justify-between gap-2">
						<h3 className="text-base font-bold text-text font-sans">{displayText(item.school)}</h3>
						<span className="font-mono text-xs text-subtext1 px-2 py-0.5 rounded bg-surface0 border border-surface1/40">
							{displayText(item.year)}
						</span>
					</div>
					<p className="text-sm font-medium text-accent font-mono">{displayText(item.degree)}</p>
					{item.description && (
						<p className="text-sm text-subtext0 leading-relaxed font-sans pt-0.5">
							{displayText(item.description)}
						</p>
					)}
				</div>
			))}
		</div>
	);
}
