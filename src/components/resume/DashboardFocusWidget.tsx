'use client';

import { ArrowUpRight, Compass, Flame, Laptop, Sparkles } from 'lucide-react';
import { useState } from 'react';

type FocusCard = {
	icon: typeof Sparkles;
	tag: string;
	title: string;
	desc: string;
	linkText?: string;
	linkHref?: string;
};

const FOCUS_ITEMS: FocusCard[] = [
	{
		icon: Laptop,
		tag: 'Engineering',
		title: 'Full-Stack Web Architecture',
		desc: 'Next.js 16 App Router, TypeScript strict, and Supabase RLS.',
		linkText: 'View projects',
		linkHref: '#projects',
	},
	{
		icon: Sparkles,
		tag: 'Exploring',
		title: 'Applied AI & Embeddings',
		desc: 'Vector databases, lightweight local embeddings, and agentic workflows.',
		linkText: 'Explore tech',
		linkHref: '#about',
	},
	{
		icon: Compass,
		tag: 'Career Target',
		title: 'Open to Opportunities',
		desc: 'Software engineering internships and junior roles for Summer/Fall 2025.',
		linkText: 'Contact me',
		linkHref: 'mailto:harshilp1234@gmail.com',
	},
];

export function DashboardFocusWidget() {
	const [activeIndex, setActiveIndex] = useState(0);

	const activeItem = FOCUS_ITEMS[activeIndex];
	const IconComponent = activeItem.icon;

	return (
		<div className="border border-surface0/80 bg-mantle rounded-xl p-4 shadow-lg flex flex-col justify-between min-h-[215px] h-full select-none transition-all hover:border-surface1 group relative overflow-hidden">
			{/* Subtle background ambient glow */}
			<div className="absolute -top-12 -right-12 w-28 h-28 bg-accent/10 rounded-full blur-2xl pointer-events-none group-hover:bg-accent/15 transition-colors" />

			{/* Header: Title & Live Pulsing Indicator */}
			<div>
				<div className="flex items-center justify-between mb-3">
					<h3 className="text-text flex items-center gap-2 text-xs uppercase tracking-wider font-semibold font-mono">
						<Flame className="w-3.5 h-3.5 text-accent" />
						<span>Current Focus</span>
					</h3>
					<span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-green/10 text-green border border-green/20">
						<span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
						<span>Building</span>
					</span>
				</div>

				{/* Active Focus Display Card */}
				<div className="p-3 rounded-lg bg-surface0/40 border border-surface1/50 transition-all">
					<div className="flex items-center justify-between mb-1.5">
						<span className="text-[10px] font-mono uppercase font-bold text-accent tracking-wider flex items-center gap-1">
							<IconComponent className="w-3 h-3 text-accent" />
							<span>{activeItem.tag}</span>
						</span>
						<span className="text-[10px] font-mono text-subtext1">
							{activeIndex + 1}/{FOCUS_ITEMS.length}
						</span>
					</div>

					<h4 className="text-xs sm:text-sm font-semibold text-text font-mono tracking-tight mb-1">
						{activeItem.title}
					</h4>
					<p className="text-[11px] text-subtext0 leading-relaxed font-sans line-clamp-2">
						{activeItem.desc}
					</p>
				</div>
			</div>

			{/* Bottom Controls: Carousel Indicators & Action Link */}
			<div className="pt-3 border-t border-surface0/60 flex items-center justify-between">
				{/* Step Dots */}
				<div className="flex items-center gap-1.5">
					{FOCUS_ITEMS.map((item, idx) => (
						<button
							key={item.tag}
							type="button"
							onClick={() => setActiveIndex(idx)}
							title={`Switch to ${item.tag}`}
							className={`h-1.5 rounded-full transition-all cursor-pointer ${
								activeIndex === idx ? 'w-5 bg-accent' : 'w-1.5 bg-surface2/60 hover:bg-subtext0'
							}`}
							aria-label={`View ${item.tag} focus`}
						/>
					))}
				</div>

				{/* Quick Action Link */}
				{activeItem.linkHref && (
					<a
						href={activeItem.linkHref}
						className="inline-flex items-center gap-1 text-[11px] font-mono text-accent hover:underline font-medium"
					>
						<span>{activeItem.linkText}</span>
						<ArrowUpRight className="w-3 h-3" />
					</a>
				)}
			</div>
		</div>
	);
}
