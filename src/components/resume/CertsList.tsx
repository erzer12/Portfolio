'use client';

import { useState } from 'react';
import { displayText } from '@/lib/utils';
import type { Certification } from '@/types';

type CertsListProps = {
	items: Certification[];
	maxVisible?: number;
};

export function CertsList({ items, maxVisible = 5 }: CertsListProps) {
	const [expanded, setExpanded] = useState(false);
	const visible = expanded ? items : items.slice(0, maxVisible);
	const hiddenCount = items.length - maxVisible;

	return (
		<div className="border border-surface0/80 bg-mantle rounded-xl p-5 shadow-lg space-y-2">
			<div className="divide-y divide-surface0/60">
				{visible.map((item) => (
					<a
						key={item.id}
						href={item.link ?? '#'}
						target={item.link ? '_blank' : undefined}
						rel="noopener noreferrer"
						className="flex items-center justify-between gap-4 py-3 text-sm text-text transition-colors hover:text-accent group"
					>
						<span className="font-medium group-hover:underline">{displayText(item.name)}</span>
						<div className="flex items-center gap-2">
							<span className="font-mono text-xs text-subtext1 px-2 py-0.5 rounded bg-surface0">
								{displayText(item.issuer)}
							</span>
							{item.link && <span className="text-xs text-accent">↗</span>}
						</div>
					</a>
				))}
			</div>

			{!expanded && hiddenCount > 0 && (
				<button
					type="button"
					onClick={() => setExpanded(true)}
					className="w-full pt-3 pb-1 font-mono text-xs text-accent hover:underline cursor-pointer text-center"
				>
					+ {hiddenCount} more certifications
				</button>
			)}

			{expanded && hiddenCount > 0 && (
				<button
					type="button"
					onClick={() => setExpanded(false)}
					className="w-full pt-3 pb-1 font-mono text-xs text-subtext1 hover:text-text cursor-pointer text-center"
				>
					Show less
				</button>
			)}
		</div>
	);
}
