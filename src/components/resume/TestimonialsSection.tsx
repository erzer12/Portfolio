import { displayText } from '@/lib/utils';
import type { Testimonial } from '@/types';

type Props = {
	items: Testimonial[];
};

const STAR_KEYS = ['s1', 's2', 's3', 's4', 's5'];

export function TestimonialsSection({ items }: Props) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			{items.map((item) => (
				<blockquote
					key={item.id}
					className="border border-surface0/80 bg-mantle rounded-xl p-5 shadow-lg flex flex-col justify-between space-y-3 font-sans"
				>
					<p className="text-sm text-subtext0 leading-relaxed italic">
						&ldquo;{displayText(item.message)}&rdquo;
					</p>
					<footer className="pt-2 border-t border-surface0/60 flex items-center justify-between">
						<div>
							<p className="text-xs font-bold text-text">{displayText(item.name)}</p>
							<p className="font-mono text-[11px] text-subtext1">{displayText(item.role)}</p>
						</div>
						{item.rating && (
							<div
								className="flex text-yellow text-xs"
								role="img"
								aria-label={`${item.rating} stars`}
							>
								{STAR_KEYS.slice(0, item.rating).map((starId) => (
									<span key={`${item.id}-${starId}`}>★</span>
								))}
							</div>
						)}
					</footer>
				</blockquote>
			))}
		</div>
	);
}
