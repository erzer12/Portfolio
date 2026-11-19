'use client';

import { useEffect, useState } from 'react';
import { FaEnvelope, FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa6';
import { ensureExternalUrl } from '@/lib/utils';
import type { FooterLink } from '@/types';

type Props = {
	links?: FooterLink[];
	lastCommitSha?: string;
	github?: string;
	linkedin?: string;
	email?: string;
	instagram?: string;
};

export function MinimalFooter({
	links: _links,
	lastCommitSha = '3b18d67',
	github = 'https://github.com/erzer12',
	linkedin = 'https://www.linkedin.com/in/harshilp1/',
	email = 'harshilp1234@gmail.com',
	instagram,
}: Props) {
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

	return (
		<footer className="w-full mt-12 pb-12 font-mono">
			<div className="mx-auto max-w-7xl px-6 sm:px-8 md:px-12 lg:px-16">
				<div className="bg-crust text-subtext0 border-surface0/60 flex h-auto flex-col items-center justify-center gap-y-3 rounded-lg border p-5 text-sm md:flex-row md:justify-between md:gap-y-0 shadow-sm">
					{/* Left Column: Copyright & Status Indicator */}
					<div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 md:justify-start">
						<span className="whitespace-nowrap">© {new Date().getFullYear()} Harshil P</span>
						<span className="text-surface0 hidden md:inline">-</span>
					</div>

					{/* Right Column: Surfing Stopwatch, Deployment Commit & Socials */}
					<div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 md:justify-end">
						{/* Surfing Time Clock */}
						<div
							className="flex items-center gap-1.5"
							title="How long you have been surfing my site"
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
								className="tabler-icon tabler-icon-clock text-subtext1"
								aria-hidden="true"
							>
								<path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
								<path d="M12 7v5l3 3" />
							</svg>
							<span className="text-accent font-mono text-xs">{formatTimer(secondsSurfing)}</span>
						</div>

						<span className="text-surface0 hidden sm:inline">-</span>

						{/* Latest Deployment Commit */}
						<a
							href={`https://github.com/erzer12/Portfolio/commit/${lastCommitSha}`}
							target="_blank"
							rel="noopener noreferrer"
							className="text-subtext1 hover:text-accent flex items-center gap-x-1 transition-colors duration-200"
							title={`View deployment commit (${lastCommitSha})`}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="tabler-icon tabler-icon-git-commit shrink-0"
								aria-hidden="true"
							>
								<path d="M9 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
								<path d="M12 3l0 6" />
								<path d="M12 15l0 6" />
							</svg>
							<span>{lastCommitSha}</span>
						</a>

						<span className="text-surface0 hidden sm:inline">-</span>

						{/* Social Icons */}
						<div className="flex items-center gap-x-3 text-lg">
							{github && (
								<a
									href={ensureExternalUrl(github)}
									target="_blank"
									rel="noopener noreferrer"
									aria-label="GitHub Profile"
									className="text-subtext1 hover:text-accent transition-colors duration-200"
									title="GitHub"
								>
									<FaGithub className="w-4 h-4" />
								</a>
							)}
							{linkedin && (
								<a
									href={ensureExternalUrl(linkedin)}
									target="_blank"
									rel="noopener noreferrer"
									aria-label="LinkedIn Profile"
									className="text-subtext1 hover:text-accent transition-colors duration-200"
									title="LinkedIn"
								>
									<FaLinkedin className="w-4 h-4" />
								</a>
							)}
							{instagram && (
								<a
									href={ensureExternalUrl(instagram)}
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Instagram Profile"
									className="text-subtext1 hover:text-accent transition-colors duration-200"
									title="Instagram"
								>
									<FaInstagram className="w-4 h-4" />
								</a>
							)}
							{email && (
								<a
									href={`mailto:${email}`}
									aria-label="Send Email"
									className="text-subtext1 hover:text-accent transition-colors duration-200"
									title="Email"
								>
									<FaEnvelope className="w-4 h-4" />
								</a>
							)}
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
