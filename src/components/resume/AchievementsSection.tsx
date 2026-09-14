import type { Achievement } from '@/types';

type Props = { items: Achievement[] };

export function AchievementsSection({ items }: Props) {
	return (
		<div className="border border-surface0/80 bg-mantle rounded-xl p-5 shadow-lg space-y-3">
			{items.map((item, idx) => (
				<div
					key={item.id}
					className={`flex items-start justify-between gap-4 py-2 ${
						idx < items.length - 1 ? 'border-b border-surface0/60 pb-3' : ''
					}`}
				>
					<div className="space-y-1">
						{item.url ? (
							<a
								href={item.url}
								target="_blank"
								rel="noopener noreferrer"
								className="text-sm font-bold text-text hover:text-accent inline-flex items-center gap-1 transition-colors"
							>
								<span>{item.title}</span>
								<span className="text-xs">↗</span>
							</a>
						) : (
							<p className="text-sm font-bold text-text">{item.title}</p>
						)}
						{item.description && (
							<p className="text-xs text-subtext0 leading-relaxed font-sans">{item.description}</p>
						)}
					</div>
					{item.date && (
						<span className="shrink-0 font-mono text-xs text-subtext1 px-2 py-0.5 rounded bg-surface0">
							{item.date}
						</span>
					)}
				</div>
			))}
		</div>
	);
}
