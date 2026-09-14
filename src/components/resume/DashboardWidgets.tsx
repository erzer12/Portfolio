'use client';

import { useEffect, useState } from 'react';
import { ACCENT_COLORS, useTheme } from '@/components/theme/ThemeContext';
import type { Commit } from '@/lib/data/github';
import { GitHubContributionGraph } from './GitHubContributionGraph';
import { RecentCommits } from './RecentCommits';

type DashboardWidgetsProps = {
	username?: string;
	initialCommits?: Commit[];
};

export function DashboardWidgets({ username = 'erzer12', initialCommits }: DashboardWidgetsProps) {
	const { palette, accent, setPalette, setAccent } = useTheme();

	// Live digital clock for Kerala, India (IST)
	const [istTime, setIstTime] = useState<string>('');

	useEffect(() => {
		const updateTime = () => {
			const now = new Date();
			const timeString = now.toLocaleTimeString('en-US', {
				timeZone: 'Asia/Kolkata',
				hour12: true,
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
			});
			setIstTime(timeString);
		};
		updateTime();
		const interval = setInterval(updateTime, 1000);
		return () => clearInterval(interval);
	}, []);

	// Click Counter Easter Egg (Pointless Button)
	const [personalClicks, setPersonalClicks] = useState<number>(0);
	const [globalClicks, setGlobalClicks] = useState<number>(1420);
	const [clickInfoOpen, setClickInfoOpen] = useState<boolean>(false);

	useEffect(() => {
		try {
			const savedClicks = localStorage.getItem('personal-clicks');
			if (savedClicks) {
				setPersonalClicks(Number.parseInt(savedClicks, 10) || 0);
			}
		} catch {
			// ignore
		}
	}, []);

	const handleClick = () => {
		const next = personalClicks + 1;
		setPersonalClicks(next);
		setGlobalClicks((prev) => prev + 1);
		try {
			localStorage.setItem('personal-clicks', next.toString());
		} catch {
			// ignore
		}
	};

	return (
		<section className="space-y-6 pt-4 pb-2" aria-label="Developer Dashboard Widgets">
			<h2 className="sr-only">Developer Highlights & Dashboard</h2>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
				{/* Widget 1: Theme & Accent Customizer Tile */}
				<div className="border border-surface0/80 bg-mantle rounded-xl p-4 shadow-lg flex flex-col justify-between sm:col-span-2 xl:col-span-1">
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

					<p className="text-[11px] text-subtext1 font-mono mt-3">
						Active accent: <span className="text-accent font-semibold capitalize">{accent}</span>
					</p>
				</div>

				{/* Widget 2: "Currently Based In 📍" Tile with Live Clock */}
				<div className="border border-surface0/80 bg-mantle rounded-xl p-4 shadow-lg flex flex-col justify-between">
					<div>
						<h3 className="text-text mb-2 flex items-center gap-2 text-xs uppercase tracking-wider font-semibold font-mono">
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
							>
								<title>Location Pin Icon</title>
								<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
								<circle cx="12" cy="10" r="3" />
							</svg>
							<span>Location 📍</span>
						</h3>

						<p className="text-sm font-bold text-text mt-1">Kerala, India</p>
						<p className="text-xs text-subtext1 font-mono">IST (UTC +5:30)</p>
					</div>

					<div className="mt-3 p-2.5 rounded-lg bg-surface0/60 border border-surface1/60">
						<div className="flex items-center justify-between text-xs font-mono">
							<span className="text-subtext0">Local Time:</span>
							<span className="text-accent font-bold tracking-wider">
								{istTime || '12:00:00 PM'}
							</span>
						</div>
						<div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-green font-medium">
							<span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
							<span>Open to remote & hybrid</span>
						</div>
					</div>
				</div>

				{/* Widget 3: The "Pointless Click Counter" Easter Egg Tile */}
				<div className="border border-surface0/80 bg-mantle rounded-xl p-4 shadow-lg flex flex-col justify-between relative">
					<div className="flex items-center justify-between">
						<h3 className="text-text flex items-center gap-2 text-xs uppercase tracking-wider font-semibold font-mono">
							<span>Button ⚡</span>
						</h3>
						<button
							type="button"
							onClick={() => setClickInfoOpen(!clickInfoOpen)}
							className="text-subtext1 hover:text-accent p-1 text-xs"
							aria-label="What is this?"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<title>Info Icon</title>
								<circle cx="12" cy="12" r="10" />
								<line x1="12" y1="16" x2="12" y2="12" />
								<line x1="12" y1="8" x2="12.01" y2="8" />
							</svg>
						</button>
					</div>

					{/* Tooltip explanation */}
					{clickInfoOpen && (
						<div className="absolute top-10 right-3 z-20 w-48 p-2.5 rounded-lg bg-surface0 text-text border border-surface1 text-[11px] leading-snug shadow-xl">
							A pointless yet strangely satisfying button. Counts every click you make on this site!
						</div>
					)}

					<div className="flex flex-col items-center justify-center my-2 text-center">
						<div className="text-2xl font-bold text-accent font-mono">
							{globalClicks.toLocaleString()}
						</div>
						<button
							type="button"
							onClick={handleClick}
							className="mt-2.5 px-4 py-2 rounded-lg bg-accent text-accent-fg font-mono text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer"
						>
							CLICK ME
						</button>
						<p className="text-[11px] text-subtext1 font-mono mt-2">
							you&apos;ve clicked {personalClicks} {personalClicks === 1 ? 'time' : 'times'}
						</p>
					</div>
				</div>

				{/* Widget 4: "Let's Connect" Quick Action Tile */}
				<div className="border border-surface0/80 bg-mantle rounded-xl p-4 shadow-lg flex flex-col justify-between">
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
						<a
							href="mailto:harshilp1234@gmail.com"
							className="inline-flex w-full items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-surface0 hover:bg-surface1 text-accent font-mono text-xs font-semibold border border-surface1 hover:border-accent transition-all"
						>
							<span>Say Hello</span>
							<span>✉</span>
						</a>
					</div>
				</div>

				{/* Widget 5: Recent Commits & Languages (Spans 2 columns - Left Tile) */}
				<div className="sm:col-span-2 lg:col-span-2">
					<RecentCommits username={username} initialCommits={initialCommits} />
				</div>

				{/* Widget 6: Real Live GitHub Contribution Graph (Spans 2 columns - Right Tile) */}
				<div className="sm:col-span-2 lg:col-span-2">
					<GitHubContributionGraph username={username} />
				</div>
			</div>
		</section>
	);
}
