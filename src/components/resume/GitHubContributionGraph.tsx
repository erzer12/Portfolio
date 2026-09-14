'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { ContributionDay, GitHubContributionsData } from '@/lib/data/github';

type Props = {
	initialData?: GitHubContributionsData;
	username?: string;
};

const MONTH_NAMES = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec',
];

// Authentic GitHub Contribution Green Scale
const LEVEL_COLORS = {
	0: 'var(--color-surface0, #232733)',
	1: '#0e4429',
	2: '#006d32',
	3: '#26a641',
	4: '#39d353',
};

export function GitHubContributionGraph({ initialData, username = 'erzer12' }: Props) {
	const [data, setData] = useState<GitHubContributionsData | null>(initialData || null);
	const [hoveredDay, setHoveredDay] = useState<{
		date: string;
		count: number;
		x: number;
		y: number;
	} | null>(null);
	const scrollRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!initialData) {
			fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`)
				.then((res) => res.json())
				.then((resData) => {
					const contributions: ContributionDay[] = resData.contributions || [];
					const total =
						resData.total?.lastYear ??
						contributions.reduce((acc: number, c: ContributionDay) => acc + c.count, 0);

					let currentStreak = 0;
					let longestStreak = 0;
					let tempStreak = 0;

					for (const day of contributions) {
						if (day.count > 0) {
							tempStreak += 1;
							if (tempStreak > longestStreak) longestStreak = tempStreak;
						} else {
							tempStreak = 0;
						}
					}

					for (let i = contributions.length - 1; i >= 0; i--) {
						if (contributions[i].count > 0) {
							currentStreak += 1;
						} else if (i < contributions.length - 1) {
							break;
						}
					}

					setData({ total, contributions, currentStreak, longestStreak });
				})
				.catch((err) => console.warn('Could not load live GitHub calendar:', err));
		}
	}, [initialData, username]);

	// Organize contributions into weeks (52-53 columns of 7 days)
	const { weeks, monthHeaders } = useMemo(() => {
		if (!data?.contributions || data.contributions.length === 0) {
			return { weeks: [], monthHeaders: [] };
		}

		const groupedWeeks: (ContributionDay | null)[][] = [];
		let currentWeek: (ContributionDay | null)[] = [];
		const months: { label: string; weekIndex: number }[] = [];
		let lastMonth = -1;

		// Calculate leading empty days for the first week to align with Sunday (day 0)
		const firstDate = new Date(data.contributions[0].date);
		const firstDayOfWeek = firstDate.getUTCDay();

		for (let i = 0; i < firstDayOfWeek; i++) {
			currentWeek.push(null);
		}

		for (const day of data.contributions) {
			const d = new Date(day.date);
			const month = d.getUTCMonth();

			// Mark month change
			if (month !== lastMonth && currentWeek.length === 0) {
				months.push({ label: MONTH_NAMES[month], weekIndex: groupedWeeks.length });
				lastMonth = month;
			} else if (month !== lastMonth && groupedWeeks.length === 0) {
				months.push({ label: MONTH_NAMES[month], weekIndex: 0 });
				lastMonth = month;
			}

			currentWeek.push(day);

			if (currentWeek.length === 7) {
				groupedWeeks.push(currentWeek);
				currentWeek = [];
			}
		}

		if (currentWeek.length > 0) {
			while (currentWeek.length < 7) {
				currentWeek.push(null);
			}
			groupedWeeks.push(currentWeek);
		}

		return { weeks: groupedWeeks, monthHeaders: months };
	}, [data]);

	const formatTooltipDate = (dateStr: string) => {
		try {
			const [y, m, d] = dateStr.split('-').map(Number);
			const dateObj = new Date(y, m - 1, d);
			return dateObj.toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
				year: 'numeric',
			});
		} catch {
			return dateStr;
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: scroll to latest activity when weeks organize
	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
		}
	}, [weeks]);

	return (
		<div className="border border-surface0/80 bg-mantle rounded-xl p-3.5 sm:p-4 shadow-md flex flex-col justify-between h-full space-y-2.5 font-mono select-none">
			{/* Header with Title & Stats */}
			<div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface0/60 pb-2">
				<div className="flex items-center gap-1.5">
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
						<title>GitHub Icon</title>
						<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
						<path d="M9 18c-4.51 2-5-2-7-2" />
					</svg>
					<span className="font-semibold text-xs sm:text-sm text-text">GitHub Activity</span>
				</div>

				<div className="flex items-center gap-2 text-xs">
					<span className="text-subtext0 text-[11px]">
						<span className="text-accent font-bold">{data?.total ?? 887}</span> commits / year
					</span>
					<a
						href={`https://github.com/${username}`}
						target="_blank"
						rel="noopener noreferrer"
						className="text-accent hover:underline hidden sm:inline text-[11px]"
					>
						@{username} ↗
					</a>
				</div>
			</div>

			{/* Heatmap Grid Container with Horizontal Scroll */}
			<div ref={scrollRef} className="overflow-x-auto no-scrollbar pt-0.5 pb-1">
				<div className="min-w-[590px] max-w-full">
					{/* Month labels header row */}
					<div className="flex text-[9px] text-subtext1 mb-1 pl-6">
						{weeks.map((_, idx) => {
							const month = monthHeaders.find((m) => m.weekIndex === idx);
							return (
								<div
									key={`month-${
										// biome-ignore lint/suspicious/noArrayIndexKey: fixed week columns
										idx
									}`}
									className="w-[11.5px] mr-[2px] text-left overflow-visible whitespace-nowrap"
								>
									{month ? month.label : ''}
								</div>
							);
						})}
					</div>

					{/* Day Labels + Grid Columns */}
					<div className="flex items-start gap-1">
						{/* Weekday indicators (Mon, Wed, Fri) */}
						<div className="flex flex-col gap-[2px] text-[8px] text-subtext1 w-5 pr-0.5 select-none">
							<span className="h-[9.5px] leading-[9.5px]" />
							<span className="h-[9.5px] leading-[9.5px]">Mon</span>
							<span className="h-[9.5px] leading-[9.5px]" />
							<span className="h-[9.5px] leading-[9.5px]">Wed</span>
							<span className="h-[9.5px] leading-[9.5px]" />
							<span className="h-[9.5px] leading-[9.5px]">Fri</span>
							<span className="h-[9.5px] leading-[9.5px]" />
						</div>

						{/* 52-Week Columns */}
						<div className="flex gap-[2px]">
							{weeks.map((week, wIdx) => (
								<div
									key={`week-${
										// biome-ignore lint/suspicious/noArrayIndexKey: fixed week columns
										wIdx
									}`}
									className="flex flex-col gap-[2px]"
								>
									{week.map((day, dIdx) => {
										if (!day) {
											return (
												<div
													key={`empty-${
														// biome-ignore lint/suspicious/noArrayIndexKey: fixed grid cell
														dIdx
													}`}
													className="w-[9.5px] h-[9.5px] rounded-[1.5px] opacity-0"
												/>
											);
										}

										const color = LEVEL_COLORS[day.level] || LEVEL_COLORS[0];

										return (
											<button
												type="button"
												key={day.date}
												tabIndex={-1}
												aria-label={`${day.count} contributions on ${day.date}`}
												onMouseEnter={(e) => {
													const rect = e.currentTarget.getBoundingClientRect();
													setHoveredDay({
														date: day.date,
														count: day.count,
														x: rect.left + rect.width / 2,
														y: rect.top,
													});
												}}
												onMouseLeave={() => setHoveredDay(null)}
												className="w-[9.5px] h-[9.5px] rounded-[1.5px] transition-transform duration-150 hover:scale-125 hover:ring-1 hover:ring-accent cursor-pointer border-none p-0"
												style={{ backgroundColor: color }}
											/>
										);
									})}
								</div>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Floating Tooltip */}
			{hoveredDay && (
				<div
					className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-full mb-2 px-2.5 py-1 rounded bg-surface1 text-text border border-surface2 text-[11px] font-mono shadow-xl whitespace-nowrap"
					style={{
						left: hoveredDay.x,
						top: hoveredDay.y - 6,
					}}
				>
					<span className="font-bold text-accent">
						{hoveredDay.count === 0 ? 'No' : hoveredDay.count} contribution
						{hoveredDay.count === 1 ? '' : 's'}
					</span>{' '}
					on {formatTooltipDate(hoveredDay.date)}
				</div>
			)}

			{/* Bottom Bar: Compact Stats & Legend */}
			<div className="pt-2 border-t border-surface0/60 flex flex-wrap items-center justify-between gap-2 text-[10.5px] text-subtext1">
				<div className="flex items-center gap-3">
					<span>
						Current Streak:{' '}
						<strong className="text-text font-bold">{data?.currentStreak ?? 0}d</strong>
					</span>
					<span>•</span>
					<span>
						Max: <strong className="text-text font-bold">{data?.longestStreak ?? 0}d</strong>
					</span>
				</div>

				{/* Contribution Level Legend */}
				<div className="flex items-center gap-1">
					<span className="opacity-70">Less</span>
					{[0, 1, 2, 3, 4].map((lvl) => (
						<span
							key={lvl}
							className="w-[8px] h-[8px] rounded-[1px]"
							style={{ backgroundColor: LEVEL_COLORS[lvl as keyof typeof LEVEL_COLORS] }}
						/>
					))}
					<span className="opacity-70">More</span>
				</div>
			</div>
		</div>
	);
}
