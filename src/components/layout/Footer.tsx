'use client';

import { ArrowUp, Clock, GitCommit, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa6';
import type { FooterLink } from '@/types';

type Props = {
	links: FooterLink[];
	lastCommitSha?: string;
};

export function MinimalFooter({ links, lastCommitSha = '3b18d67' }: Props) {
	// Live session surfing stopwatch
	const [secondsSurfing, setSecondsSurfing] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setSecondsSurfing((prev) => prev + 1);
		}, 1000);
		return () => clearInterval(timer);
	}, []);

	const formatTimer = (totalSeconds: number) => {
		const mins = Math.floor(totalSeconds / 60)
			.toString()
			.padStart(2, '0');
		const secs = (totalSeconds % 60).toString().padStart(2, '0');
		return `${mins}:${secs}`;
	};

	// Group CMS footer links by category if present
	const categories: string[] = [];
	const grouped: Record<string, FooterLink[]> = {};

	for (const link of links) {
		const cat = link.category || 'Links';
		if (!grouped[cat]) {
			grouped[cat] = [];
			categories.push(cat);
		}
		grouped[cat].push(link);
	}

	const hasLinks = categories.length > 0;

	return (
		<footer className="w-full mt-16 pb-12">
			<div className="mx-auto max-w-5xl px-4 sm:px-6">
				{/* CMS Links (if provided in dashboard) */}
				{hasLinks && (
					<div className="py-8 border-t border-surface0/60 font-mono mb-6">
						<div className="grid grid-cols-2 gap-x-8 gap-y-6 md:[grid-template-columns:repeat(auto-fit,minmax(160px,1fr))]">
							{categories.map((category) => (
								<div key={category} className="space-y-3">
									<h4 className="text-xs uppercase tracking-wider font-semibold text-text">
										{category}
									</h4>
									<ul className="space-y-2">
										{grouped[category].map((link) => (
											<li key={link.id}>
												<a
													href={link.url}
													target={link.url.startsWith('http') ? '_blank' : '_self'}
													rel="noopener noreferrer"
													className="text-xs text-subtext0 hover:text-accent transition-colors"
												>
													{link.label}
												</a>
											</li>
										))}
									</ul>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Overlapping Top Badge Tag */}
				<div className="relative flex justify-end pr-4 sm:pr-8">
					<div className="bg-mantle border border-surface0/80 border-b-0 rounded-t-lg px-3.5 py-1.5 shadow-xs text-xs font-mono text-subtext1 flex items-center gap-2">
						<span className="text-overlay1">Stack:</span>
						<span className="text-peach font-semibold">next16</span>
						<span className="text-surface2">/</span>
						<span className="text-green font-semibold">react19</span>
						<span className="text-surface2">/</span>
						<span className="text-blue font-semibold">catppuccin</span>
					</div>
				</div>

				{/* Main Terminal Card Footer */}
				<div className="rounded-xl border border-surface0/80 bg-crust/90 p-5 sm:p-6 shadow-xl backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-4 font-mono select-none">
					{/* Left: Copyright & System Status */}
					<div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs text-subtext0">
						<span className="text-text font-medium">© {new Date().getFullYear()} Harshil P</span>
						<span className="text-surface1 hidden sm:inline">•</span>
						<div className="flex items-center gap-1.5" title="Service Status">
							<span className="relative flex h-2.5 w-2.5">
								<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green opacity-75" />
								<span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green" />
							</span>
							<span className="text-subtext1 text-xs">All Systems Nominal</span>
						</div>
					</div>

					{/* Right: Timer, Git commit, Social Icons & Back to top */}
					<div className="flex flex-wrap items-center justify-center md:justify-end gap-3.5 text-xs text-subtext1">
						{/* Session surfing stopwatch */}
						<div
							className="flex items-center gap-1.5"
							title="How long you have explored this portfolio"
						>
							<Clock className="w-3.5 h-3.5 text-subtext1" />
							<span className="text-accent font-bold">{formatTimer(secondsSurfing)}</span>
						</div>

						<span className="text-surface1 hidden sm:inline">•</span>

						{/* Git commit hash */}
						<a
							href={`https://github.com/erzer12/Portfolio/commit/${lastCommitSha}`}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-1 hover:text-accent transition-colors"
							title={`Latest portfolio commit: ${lastCommitSha}`}
						>
							<GitCommit className="w-3.5 h-3.5 text-accent" />
							<span className="font-mono">{lastCommitSha}</span>
						</a>

						<span className="text-surface1 hidden sm:inline">•</span>

						{/* Social Icons */}
						<div className="flex items-center gap-2.5">
							<a
								href="https://github.com/erzer12"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="GitHub Profile"
								className="hover:text-accent transition-colors p-1"
								title="GitHub"
							>
								<FaGithub className="w-4 h-4" />
							</a>
							<a
								href="https://linkedin.com"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="LinkedIn Profile"
								className="hover:text-accent transition-colors p-1"
								title="LinkedIn"
							>
								<FaLinkedin className="w-4 h-4" />
							</a>
							<a
								href="mailto:harshilp1234@gmail.com"
								aria-label="Email Harshil"
								className="hover:text-accent transition-colors p-1"
								title="Email"
							>
								<Mail className="w-4 h-4" />
							</a>
						</div>

						<span className="text-surface1 hidden sm:inline">•</span>

						{/* Smooth Scroll To Top */}
						<button
							type="button"
							onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
							className="hover:text-accent text-accent font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
							aria-label="Scroll to top of page"
						>
							<ArrowUp className="w-3.5 h-3.5" />
							<span>top</span>
						</button>
					</div>
				</div>
			</div>
		</footer>
	);
}
