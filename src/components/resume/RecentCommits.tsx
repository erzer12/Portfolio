'use client';

import { useEffect, useState } from 'react';
import {
	type Commit,
	FALLBACK_COMMITS,
	FALLBACK_LANGUAGES,
	getLanguageStats,
	type Language,
} from '@/lib/data/github';

type Props = {
	username?: string;
	initialCommits?: Commit[];
};

export function RecentCommits({ username = 'erzer12', initialCommits }: Props) {
	const [commits, setCommits] = useState<Commit[]>(
		initialCommits && initialCommits.length > 0 ? initialCommits : FALLBACK_COMMITS,
	);
	const [languages, setLanguages] = useState<Language[]>(FALLBACK_LANGUAGES);
	const [hoveredLang, setHoveredLang] = useState<Language | null>(null);

	useEffect(() => {
		if (initialCommits && initialCommits.length > 0) {
			setCommits(initialCommits);
		}
	}, [initialCommits]);

	useEffect(() => {
		let isMounted = true;
		getLanguageStats(username).then((langs) => {
			if (isMounted && langs?.length) {
				setLanguages(langs);
			}
		});
		return () => {
			isMounted = false;
		};
	}, [username]);

	return (
		<div className="border border-surface0/80 bg-mantle rounded-xl p-3.5 sm:p-4 shadow-md flex flex-col justify-between h-full font-mono select-none">
			{/* Compact Header */}
			<div>
				<div className="flex items-center justify-between border-b border-surface0/60 pb-2 mb-2">
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
							<title>Git Commit Icon</title>
							<circle cx="12" cy="12" r="4" />
							<line x1="1.05" y1="12" x2="7" y2="12" />
							<line x1="17.05" y1="12" x2="23" y2="12" />
						</svg>
						<span className="font-semibold text-xs sm:text-sm text-text">Recent Commits</span>
					</div>

					<a
						href={`https://github.com/${username}`}
						target="_blank"
						rel="noopener noreferrer"
						className="text-[11px] text-accent hover:underline flex items-center gap-0.5 font-mono"
					>
						<span>GitHub</span>
						<span>→</span>
					</a>
				</div>

				{/* Compact Commits Feed */}
				<div className="flex flex-col gap-1">
					{commits.slice(0, 3).map((commit, idx) => (
						<a
							key={`${commit.repo}-${commit.sha || idx}`}
							href={commit.url || `https://github.com/${username}/${commit.repo}`}
							target="_blank"
							rel="noopener noreferrer"
							className="group flex items-center justify-between gap-2.5 py-1 px-1.5 rounded-md hover:bg-surface0/50 transition-colors"
						>
							<div className="flex items-center gap-2 min-w-0">
								<span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 group-hover:scale-125 transition-transform" />
								<span className="text-[11px] font-mono text-accent shrink-0 font-medium">
									{commit.repo}:
								</span>
								<p
									title={commit.message}
									className="text-xs text-subtext0 group-hover:text-text transition-colors truncate font-sans"
								>
									{commit.message}
								</p>
							</div>
							<span className="text-[10px] text-subtext1 shrink-0 font-mono opacity-80">
								{commit.time}
							</span>
						</a>
					))}
				</div>
			</div>

			{/* Integrated Compact Languages Bar */}
			<div className="pt-2.5 border-t border-surface0/60 mt-2.5 space-y-1.5">
				<div className="flex items-center justify-between text-[10px] font-mono">
					<span className="text-subtext1">Top Languages</span>
					{hoveredLang ? (
						<span className="text-accent font-semibold">
							{hoveredLang.name} — {hoveredLang.percentage}%
						</span>
					) : (
						<span className="text-subtext1 opacity-70">hover bar for details</span>
					)}
				</div>

				{/* Segmented bar */}
				<div className="w-full h-1.5 rounded-full overflow-hidden flex bg-surface0 gap-[1px]">
					{languages.map((lang) => (
						<button
							type="button"
							key={lang.name}
							tabIndex={-1}
							aria-label={`${lang.name}: ${lang.percentage}%`}
							onMouseEnter={() => setHoveredLang(lang)}
							onMouseLeave={() => setHoveredLang(null)}
							className="h-full transition-opacity hover:opacity-80 cursor-pointer border-none p-0"
							style={{
								width: `${lang.percentage}%`,
								backgroundColor: lang.color,
							}}
						/>
					))}
				</div>

				{/* Language dots */}
				<div className="flex flex-wrap gap-x-2.5 gap-y-0.5 text-[9.5px] text-subtext1 font-mono">
					{languages.slice(0, 5).map((lang) => (
						<div key={lang.name} className="flex items-center gap-1">
							<span
								className="w-1.5 h-1.5 rounded-full inline-block"
								style={{ backgroundColor: lang.color }}
							/>
							<span className="text-subtext0">{lang.name}</span>
							<span className="opacity-60">{lang.percentage}%</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
