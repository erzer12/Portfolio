'use client';

import { useEffect, useState } from 'react';
import { incrementPageViewAction } from '@/app/actions';

type FooterProps = {
	githubUrl?: string;
	linkedinUrl?: string;
	email?: string;
	commitSha?: string;
	initialViews?: number;
};

export function Footer({
	githubUrl = 'https://github.com/erzer12',
	linkedinUrl = 'https://www.linkedin.com/in/harshilp1',
	email = 'harshilp1234@gmail.com',
	commitSha = 'a3f9c12',
	initialViews = 1204,
}: FooterProps) {
	const [views, setViews] = useState<number>(initialViews);
	const year = new Date().getFullYear();

	useEffect(() => {
		let isMounted = true;
		incrementPageViewAction().then((count) => {
			if (isMounted) setViews(count);
		});
		return () => {
			isMounted = false;
		};
	}, []);

	return (
		<footer className="w-full bg-surface-container/40 border-t border-border-muted/60 py-6 mt-16 transition-colors duration-300">
			<div className="max-w-[1900px] mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-on-surface-variant font-mono text-[11px] uppercase tracking-[0.1em]">
				{/* Left: Copyright & System Status */}
				<div className="flex items-center gap-3 flex-wrap">
					<span className="text-on-surface font-semibold">© {year} Harshil P</span>
					<span className="text-border-muted select-none">·</span>
					<div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px]">
						<span className="w-1.5 h-1.5 rounded-full bg-[#27c93f] animate-pulse inline-block" />
						<span>All Services Nominal</span>
					</div>
				</div>

				{/* Center/Right: View Count, Commit SHA, Social Links */}
				<div className="flex items-center gap-4 flex-wrap justify-center md:justify-end">
					{/* Live Views Counter */}
					<div className="flex items-center gap-1.5 text-primary opacity-90">
						<span className="material-symbols-outlined text-[14px]">visibility</span>
						<span>{views.toLocaleString()} views</span>
					</div>

					<span className="text-border-muted select-none">|</span>

					{/* Commit SHA */}
					<div className="flex items-center gap-1.5 opacity-80">
						<span className="material-symbols-outlined text-[14px]">commit</span>
						<span>{commitSha}</span>
						<a
							href={githubUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-primary transition-colors underline underline-offset-2"
						>
							[source]
						</a>
					</div>

					<span className="text-border-muted select-none">|</span>

					{/* Social Links Row */}
					<div className="flex items-center gap-3">
						<a
							href={githubUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-primary transition-colors flex items-center gap-1"
							title="GitHub"
						>
							<span>GitHub</span>
						</a>
						<span className="text-border-muted select-none">·</span>
						<a
							href={linkedinUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-primary transition-colors flex items-center gap-1"
							title="LinkedIn"
						>
							<span>LinkedIn</span>
						</a>
						<span className="text-border-muted select-none">·</span>
						<a
							href={`mailto:${email}`}
							className="hover:text-primary transition-colors flex items-center gap-1"
							title="Email"
						>
							<span>Email</span>
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
