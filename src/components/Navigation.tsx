'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

type NavigationProps = {
	resumeUrl?: string;
};

export function Navigation({ resumeUrl }: NavigationProps) {
	const pathname = usePathname();
	const [isOpen, setIsOpen] = useState(false);

	const links = [
		{ path: '/about', label: 'About' },
		{ path: '/projects', label: 'Projects' },
		{ path: '/experience', label: 'Experience' },
		{ path: '/achievements', label: 'Achievements' },
		{ path: '/posts', label: 'Posts' },
		{ path: '/pics', label: 'Pics' },
		{ path: '/contact', label: 'Contact' },
	];

	return (
		<header className="sticky top-0 w-full z-50 bg-background/85 backdrop-blur-md border-b border-border-muted transition-colors duration-300">
			<nav className="w-full flex justify-between items-center py-3.5 px-0">
				{/* Logo / Brand */}
				<Link
					href="/"
					className="font-mono text-sm font-bold tracking-tight text-on-surface hover:text-primary transition-colors flex items-center gap-1"
					onClick={() => setIsOpen(false)}
				>
					<span className="text-primary hover:text-primary/70 transition-colors">~</span>
					<span className="text-on-surface-variant/80 select-none">/</span>
					<span className="w-1.5 h-3.5 bg-primary animate-pulse inline-block" aria-hidden="true" />
				</Link>

				{/* Desktop Navigation Links */}
				<div className="hidden md:flex items-center gap-4 lg:gap-5">
					{links.map((link) => {
						const isActive = pathname === link.path;
						return (
							<Link
								key={link.path}
								href={link.path}
								className={`text-xs font-mono transition-colors relative py-1 ${
									isActive
										? 'text-primary font-bold'
										: 'text-on-surface-variant hover:text-on-surface'
								}`}
							>
								{link.label}
								{isActive && (
									<span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
								)}
							</Link>
						);
					})}

					{resumeUrl && (
						<a
							href={resumeUrl}
							download
							target="_blank"
							rel="noopener noreferrer"
							className="px-2.5 py-1 border border-primary text-primary hover:bg-primary/10 transition-colors rounded text-xs font-mono"
						>
							Resume ↓
						</a>
					)}
				</div>

				{/* Mobile Hamburger Menu Toggle Button */}
				<div className="flex md:hidden items-center gap-2">
					<button
						type="button"
						onClick={() => setIsOpen(!isOpen)}
						aria-label="Toggle Navigation Menu"
						aria-expanded={isOpen}
						className="p-1.5 border border-border-muted rounded text-on-surface hover:text-primary hover:border-primary transition-colors"
					>
						<span className="material-symbols-outlined text-[18px]">
							{isOpen ? 'close' : 'menu'}
						</span>
					</button>
				</div>
			</nav>

			{/* Mobile Slide-Over Drawer Navigation */}
			{isOpen && (
				<div className="md:hidden border-t border-border-muted/50 bg-background/95 backdrop-blur-xl py-4 px-2 space-y-3 animate-calm shadow-xl">
					<div className="flex flex-col gap-2">
						{links.map((link) => {
							const isActive = pathname === link.path;
							return (
								<Link
									key={link.path}
									href={link.path}
									onClick={() => setIsOpen(false)}
									className={`px-3 py-2 rounded text-sm font-mono flex items-center justify-between transition-colors ${
										isActive
											? 'bg-surface-container text-primary font-bold border-l-2 border-primary'
											: 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50'
									}`}
								>
									<span>{link.label}</span>
									{isActive && (
										<span className="material-symbols-outlined text-[14px]">chevron_right</span>
									)}
								</Link>
							);
						})}

						{resumeUrl && (
							<a
								href={resumeUrl}
								download
								target="_blank"
								rel="noopener noreferrer"
								onClick={() => setIsOpen(false)}
								className="mt-2 mx-3 py-2 border border-primary text-primary text-center rounded text-xs font-mono font-bold hover:bg-primary/10 transition-colors uppercase tracking-wider"
							>
								Download Resume ↓
							</a>
						)}
					</div>
				</div>
			)}
		</header>
	);
}
