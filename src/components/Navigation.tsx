'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

type NavigationProps = {
	resumeUrl?: string;
};

export function Navigation({
	resumeUrl = 'https://hlbmzefstbersvrafzji.supabase.co/storage/v1/object/public/portfolio_media/1778125303389-6bz4xb.pdf',
}: NavigationProps) {
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
		<header className="sticky top-0 w-full z-50 bg-background/85 backdrop-blur-md border-b border-border-muted/60 transition-colors duration-300">
			<nav className="max-w-[1900px] mx-auto px-4 w-full flex justify-between items-center py-3.5">
				{/* Brand Logo with terminal cursor animation */}
				<Link
					href="/"
					className="group font-mono text-sm font-bold tracking-tight text-on-surface hover:text-primary transition-colors flex items-center gap-1.5"
					onClick={() => setIsOpen(false)}
				>
					<span className="text-primary group-hover:rotate-12 transition-transform duration-200">
						~
					</span>
					<span className="text-on-surface-variant/70 select-none">/</span>
					<span className="text-on-surface font-semibold tracking-wide">harshilp.codes</span>
					<span
						className="w-1.5 h-3.5 bg-primary animate-pulse inline-block ml-0.5"
						aria-hidden="true"
					/>
				</Link>

				{/* Desktop Navigation Links */}
				<div className="hidden md:flex items-center gap-4 lg:gap-6">
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
									<span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full animate-calm" />
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
							className="px-3 py-1 border border-primary/80 text-primary hover:bg-primary/10 active:scale-95 transition-all rounded text-xs font-mono font-semibold flex items-center gap-1 shadow-sm"
						>
							<span>Resume</span>
							<span className="material-symbols-outlined text-[13px]">download</span>
						</a>
					)}
				</div>

				{/* Mobile Hamburger Toggle Button */}
				<div className="flex md:hidden items-center gap-2">
					<button
						type="button"
						onClick={() => setIsOpen(!isOpen)}
						aria-label="Toggle Menu"
						aria-expanded={isOpen}
						className="p-1.5 border border-border-muted rounded text-on-surface hover:text-primary hover:border-primary transition-colors flex items-center justify-center"
					>
						<span className="material-symbols-outlined text-[20px]">
							{isOpen ? 'close' : 'menu'}
						</span>
					</button>
				</div>
			</nav>

			{/* Mobile Navigation Drawer */}
			{isOpen && (
				<div className="md:hidden border-t border-border-muted/50 bg-background/95 backdrop-blur-xl py-4 px-3 space-y-3 animate-calm shadow-2xl">
					<div className="flex flex-col gap-1.5">
						{links.map((link) => {
							const isActive = pathname === link.path;
							return (
								<Link
									key={link.path}
									href={link.path}
									onClick={() => setIsOpen(false)}
									className={`px-3 py-2.5 rounded-lg text-sm font-mono flex items-center justify-between transition-colors ${
										isActive
											? 'bg-surface-container text-primary font-bold border-l-2 border-primary'
											: 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/40'
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
								className="mt-3 mx-2 py-2.5 bg-primary text-background text-center rounded-lg text-xs font-mono font-bold hover:opacity-90 transition-opacity uppercase tracking-wider flex items-center justify-center gap-1.5"
							>
								<span>Download Resume</span>
								<span className="material-symbols-outlined text-[14px]">download</span>
							</a>
						)}
					</div>
				</div>
			)}
		</header>
	);
}
