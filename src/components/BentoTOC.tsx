'use client';

import Link from 'next/link';

const directory = [
	{ path: '/about', label: 'About', num: '01' },
	{ path: '/projects', label: 'Projects', num: '02' },
	{ path: '/posts', label: 'Posts', num: '03' },
	{ path: '/pics', label: 'Pics', num: '04' },
	{ path: '/contact', label: 'Contact', num: '05' },
];

export function BentoTOC() {
	return (
		<div className="bg-surface-container rounded-xl border border-border-muted p-4 flex flex-col justify-between h-48 w-full transition-colors duration-300">
			<div className="flex items-center gap-1.5 text-on-surface-variant mb-2">
				<span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
					explore
				</span>
				<span className="font-mono text-[10px] uppercase tracking-[0.15em] font-semibold">
					Site Index
				</span>
			</div>

			<nav className="flex flex-col gap-1.5 justify-center flex-grow">
				{directory.map((item) => (
					<Link
						key={item.path}
						href={item.path}
						className="group flex items-center justify-between text-xs font-mono py-0.5 border-b border-border-muted/30 hover:border-primary transition-all duration-150"
					>
						<span className="text-[10px] text-on-surface-variant group-hover:text-primary transition-colors">
							{item.num}
						</span>
						<span className="font-semibold text-on-surface group-hover:text-primary transition-colors">
							{item.label}
						</span>
						<span className="material-symbols-outlined text-[12px] opacity-0 group-hover:opacity-100 transition-all transform translate-x-1 group-hover:translate-x-0 text-primary">
							arrow_forward
						</span>
					</Link>
				))}
			</nav>
		</div>
	);
}
