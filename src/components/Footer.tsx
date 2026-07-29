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
		<footer className="w-full bg-background border-t border-border-muted py-8 mt-16 transition-colors duration-300">
			<div className="max-w-[1900px] mx-auto px-4 flex flex-wrap justify-between items-center gap-4 text-on-surface-variant font-mono text-[11px] uppercase tracking-[0.1em]">
				<div className="flex items-center gap-2">
					<span className="text-on-surface font-semibold">© @Harshil · {year}</span>
				</div>

				<div className="flex items-center gap-4 flex-wrap">
					<div className="flex items-center gap-1.5 opacity-80 text-primary">
						<span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
							visibility
						</span>
						<span>{views.toLocaleString()} views</span>
					</div>

					<span className="text-border-muted">|</span>

					<div className="flex items-center gap-1.5 opacity-80">
						<span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
							commit
						</span>
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

					<span className="text-border-muted">|</span>

					<div className="flex items-center gap-3">
						<a
							href={githubUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-primary transition-colors"
						>
							GitHub
						</a>
						<span className="text-border-muted">·</span>
						<a
							href={linkedinUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-primary transition-colors"
						>
							LinkedIn
						</a>
						<span className="text-border-muted">·</span>
						<a href={`mailto:${email}`} className="hover:text-primary transition-colors">
							Email
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
