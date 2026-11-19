'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ACCENT_COLORS, useTheme } from '@/components/theme/ThemeContext';
import type { Commit } from '@/lib/data/github';
import { GitHubContributionGraph } from './GitHubContributionGraph';
import { RecentCommits } from './RecentCommits';

const LocationMapWidget = dynamic(
	() => import('./LocationMapWidget').then((mod) => mod.LocationMapWidget),
	{
		ssr: false,
		loading: () => (
			<div className="border border-surface0/80 bg-mantle rounded-xl p-4 shadow-lg flex flex-col justify-between min-h-[220px] h-full animate-pulse">
				<div className="h-4 w-36 bg-surface0 rounded mb-3" />
				<div className="bg-surface0/60 flex-1 min-h-[140px] rounded-lg" />
				<div className="mt-3 flex items-center justify-between">
					<div className="h-3 w-20 bg-surface0 rounded" />
					<div className="h-3 w-16 bg-surface0 rounded" />
				</div>
			</div>
		),
	},
);

type DashboardWidgetsProps = {
	username?: string;
	initialCommits?: Commit[];
};

export function DashboardWidgets({ username = 'erzer12', initialCommits }: DashboardWidgetsProps) {
	const { palette, accent, setPalette, setAccent } = useTheme();

	return (
		<section className="space-y-5 pt-4 pb-2" aria-label="Developer Dashboard Widgets">
			<h2 className="sr-only">Developer Highlights & Dashboard</h2>

			{/* Top Row: 3 Equal Dashboard Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
				{/* Card 1: Theme & Accent Customizer Tile */}
				<div className="border border-surface0/80 bg-mantle rounded-xl p-4 shadow-lg flex flex-col justify-between h-full">
					<div>
						<h3 className="text-text mb-3 flex items-center gap-2 text-xs uppercase tracking-wider font-semibold font-mono">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="15"
								height="15"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="text-accent"
								aria-hidden="true"
							>
								<title>Palette Icon</title>
								<path d="M12 21a9 9 0 0 1 0 -18c4.97 0 9 3.582 9 8c0 1.06 -.474 2.078 -1.318 2.828c-.844 .75 -1.989 1.172 -3.182 1.172h-2.5a2 2 0 0 0 -1 3.75a1.3 1.3 0 0 1 -1 2.25" />
								<circle cx="7.5" cy="10.5" r="1" fill="currentColor" />
								<circle cx="11.5" cy="7.5" r="1" fill="currentColor" />
								<circle cx="15.5" cy="10.5" r="1" fill="currentColor" />
							</svg>
							<span>Theme</span>
						</h3>

						{/* Dark/Light mode buttons */}
						<div className="relative mb-3 flex items-center gap-1 rounded-md p-1 bg-surface0/60 ring-1 ring-surface1">
							<button
								type="button"
								onClick={() => setPalette('mocha')}
								className={`flex-1 cursor-pointer rounded px-2 py-1 text-center text-xs font-mono font-medium transition-all ${
									palette === 'mocha'
										? 'bg-base text-text shadow-sm ring-1 ring-accent font-semibold'
										: 'text-subtext0 hover:text-text'
								}`}
							>
								Mocha
							</button>
							<button
								type="button"
								onClick={() => setPalette('latte')}
								className={`flex-1 cursor-pointer rounded px-2 py-1 text-center text-xs font-mono font-medium transition-all ${
									palette === 'latte'
										? 'bg-base text-text shadow-sm ring-1 ring-accent font-semibold'
										: 'text-subtext0 hover:text-text'
								}`}
							>
								Latte
							</button>
						</div>

						{/* 14 Accent Color Dots Grid */}
						<div className="grid grid-cols-7 gap-1.5 pt-1">
							{ACCENT_COLORS.map((col) => {
								const isSelected = accent === col.name;
								return (
									<button
										key={col.name}
										type="button"
										onClick={() => setAccent(col.name)}
										title={col.title}
										className={`aspect-square w-full min-h-[18px] rounded-md transition-all duration-150 relative cursor-pointer ${
											isSelected
												? 'scale-110 ring-2 ring-accent ring-offset-2 ring-offset-mantle'
												: 'opacity-70 hover:opacity-100 hover:scale-105'
										}`}
										style={{ backgroundColor: col.hex }}
										aria-label={`Select ${col.title} accent`}
									/>
								);
							})}
						</div>
					</div>

					{/* Active Accent Indicator */}
					<div className="mt-3 pt-2.5 border-t border-surface0/60 flex items-center justify-between text-[11px] font-mono">
						<span className="text-subtext1">
							Accent: <span className="text-accent font-semibold capitalize">{accent}</span>
						</span>
						<span className="text-subtext1/80 text-[10.5px]">
							Theme: <span className="text-text capitalize font-medium">{palette}</span>
						</span>
					</div>
				</div>

				{/* Card 2: Interactive Kerala Leaflet Map with Live IST Clock */}
				<LocationMapWidget />

				{/* Card 3: "Let's Connect" Quick Action Tile */}
				<div className="border border-surface0/80 bg-mantle rounded-xl p-4 shadow-lg flex flex-col justify-between h-full">
					<div>
						<h3 className="text-text mb-1.5 flex items-center gap-2 text-xs uppercase tracking-wider font-semibold font-mono">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="15"
								height="15"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="text-accent"
								aria-hidden="true"
							>
								<title>Chat Icon</title>
								<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
							</svg>
							<span>Let&apos;s Connect</span>
						</h3>
						<p className="text-xs text-subtext0 leading-relaxed font-sans">
							Always open to discussing software projects, internship opportunities, or interesting
							engineering challenges.
						</p>
					</div>

					<div className="mt-3">
						<Link
							href="/contact"
							className="inline-flex w-full items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-surface0 hover:bg-surface1 text-accent font-mono text-xs font-semibold border border-surface1 hover:border-accent transition-all group"
						>
							<span>Get in Touch</span>
							<span className="transition-transform group-hover:translate-x-0.5">→</span>
						</Link>
					</div>
				</div>
			</div>

			{/* Bottom Row: 2 Wide Activity & Contribution Cards */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
				{/* Widget Left: Recent Commits & Languages */}
				<div>
					<RecentCommits username={username} initialCommits={initialCommits} />
				</div>

				{/* Widget Right: Real Live GitHub Contribution Graph */}
				<div>
					<GitHubContributionGraph username={username} />
				</div>
			</div>
		</section>
	);
}
