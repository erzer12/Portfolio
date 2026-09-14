'use client';

import { useState } from 'react';
import { ACCENT_COLORS, useTheme } from '@/components/theme/ThemeContext';

type NavigationProps = {
	name?: string;
	email?: string;
	github?: string;
	resume?: string;
	linkedin?: string;
};

export function MinimalNav({
	name = 'harshil',
	email: _email = 'harshilp1234@gmail.com',
	github = 'https://github.com/erzer12',
	resume,
	linkedin = 'https://linkedin.com',
}: NavigationProps) {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const { palette, accent, setPalette, setAccent } = useTheme();

	return (
		<>
			{/* Sticky Terminal Masthead */}
			<header className="sticky top-0 z-30 flex h-20 items-center justify-between bg-base/80 backdrop-blur-md px-4 sm:px-6 py-4 border-b border-surface0/40 select-none transition-colors">
				{/* Breadcrumbs prompt: ~ / harshil ▋ */}
				<nav aria-label="Breadcrumbs">
					<ul className="flex items-center text-sm sm:text-base font-mono">
						<li className="inline-flex items-center">
							<a
								href="/"
								className="animation-wiggle text-accent hover:opacity-80 font-bold transition-opacity"
							>
								~
							</a>
						</li>
						<li className="mx-1.5 inline-flex items-center text-subtext0" aria-hidden="true">
							/
						</li>
						<li className="inline-flex items-center font-medium text-text">
							<span>{name.toLowerCase().replace(/\s+/g, '')}</span>
							<span
								className="cursor-blink bg-accent ml-1.5 inline-block h-4 w-2 rounded-xs"
								aria-hidden="true"
							/>
						</li>
					</ul>
				</nav>

				{/* Desktop Navigation Links */}
				<div className="hidden md:flex items-center space-x-2 lg:space-x-4 text-sm font-medium">
					<a
						href="#about"
						className="text-text hover:text-accent rounded px-3 py-1.5 transition-colors"
					>
						About
					</a>
					<a
						href="/projects"
						className="text-text hover:text-accent rounded px-3 py-1.5 transition-colors"
					>
						Projects
					</a>

					<button
						type="button"
						onClick={() => setSidebarOpen(true)}
						className="border border-surface1 hover:border-accent text-subtext0 hover:text-accent cursor-pointer rounded-md px-3 py-1.5 text-xs flex items-center gap-1.5 transition-all shadow-xs"
						aria-label="Open theme and navigation settings"
					>
						<span
							className="inline-block w-2.5 h-2.5 rounded-full"
							style={{ backgroundColor: `var(--color-${accent})` }}
						/>
						<span>Theme...</span>
					</button>
				</div>

				{/* Mobile Hamburger Button */}
				<button
					type="button"
					onClick={() => setSidebarOpen(true)}
					className="text-text hover:text-accent p-2 rounded-md md:hidden focus:outline-none focus:ring-1 focus:ring-accent"
					aria-label="Open navigation menu"
					aria-expanded={sidebarOpen}
					aria-controls="sidebar-nav"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="22"
						height="22"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<title>Open Navigation Menu</title>
						<line x1="4" y1="6" x2="20" y2="6" />
						<line x1="4" y1="12" x2="20" y2="12" />
						<line x1="4" y1="18" x2="20" y2="18" />
					</svg>
				</button>
			</header>

			{/* Slide-in Sidebar Drawer (#sidebar-nav) */}
			{sidebarOpen && (
				<button
					type="button"
					className="fixed inset-0 z-40 bg-crust/60 backdrop-blur-xs transition-opacity cursor-default border-none w-full h-full"
					onClick={() => setSidebarOpen(false)}
					aria-label="Close sidebar backdrop"
				/>
			)}

			<aside
				id="sidebar-nav"
				className={`fixed inset-y-0 right-0 z-50 flex w-72 sm:w-80 flex-col bg-mantle text-text border-l border-surface0 shadow-2xl transition-transform duration-300 ease-in-out ${
					sidebarOpen ? 'translate-x-0' : 'translate-x-full'
				}`}
				aria-label="Site settings and navigation"
			>
				{/* Drawer Header */}
				<div className="flex h-16 flex-shrink-0 items-center justify-between border-b border-surface0 p-4">
					<span className="text-accent font-mono text-base font-semibold flex items-center gap-2">
						<span>~ / settings</span>
					</span>
					<button
						type="button"
						onClick={() => setSidebarOpen(false)}
						className="text-subtext0 hover:text-red rounded p-1 transition-colors"
						aria-label="Close navigation menu"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<title>Close Menu</title>
							<line x1="18" y1="6" x2="6" y2="18" />
							<line x1="6" y1="6" x2="18" y2="18" />
						</svg>
					</button>
				</div>

				{/* Theme & Accent Switcher in Sidebar */}
				<div className="border-b border-surface0 p-4 space-y-4">
					<div>
						<h3 className="text-text mb-2.5 flex items-center gap-2 text-xs uppercase tracking-wider font-semibold">
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
								className="text-accent"
							>
								<title>Palette Icon</title>
								<path d="M12 21a9 9 0 0 1 0 -18c4.97 0 9 3.582 9 8c0 1.06 -.474 2.078 -1.318 2.828c-.844 .75 -1.989 1.172 -3.182 1.172h-2.5a2 2 0 0 0 -1 3.75a1.3 1.3 0 0 1 -1 2.25" />
								<circle cx="7.5" cy="10.5" r="1" fill="currentColor" />
								<circle cx="11.5" cy="7.5" r="1" fill="currentColor" />
								<circle cx="15.5" cy="10.5" r="1" fill="currentColor" />
							</svg>
							<span>Color Palette</span>
						</h3>

						{/* Dark/Light mode buttons */}
						<div className="relative mb-3 flex items-center gap-1 rounded-md p-1 bg-surface0/60 ring-1 ring-surface1">
							<button
								type="button"
								onClick={() => setPalette('mocha')}
								className={`flex-1 cursor-pointer rounded px-2 py-1 text-center text-xs font-medium transition-all ${
									palette === 'mocha'
										? 'bg-base text-text shadow-sm ring-1 ring-accent font-semibold'
										: 'text-subtext0 hover:text-text'
								}`}
							>
								Mocha (Dark)
							</button>
							<button
								type="button"
								onClick={() => setPalette('latte')}
								className={`flex-1 cursor-pointer rounded px-2 py-1 text-center text-xs font-medium transition-all ${
									palette === 'latte'
										? 'bg-base text-text shadow-sm ring-1 ring-accent font-semibold'
										: 'text-subtext0 hover:text-text'
								}`}
							>
								Latte (Light)
							</button>
						</div>
					</div>

					{/* 14 Accent Color Dots Grid */}
					<div>
						<span className="text-subtext0 text-xs block mb-2 font-medium">
							Accent Accent Color
						</span>
						<div className="grid grid-cols-7 gap-1.5">
							{ACCENT_COLORS.map((col) => {
								const isSelected = accent === col.name;
								return (
									<button
										key={col.name}
										type="button"
										onClick={() => setAccent(col.name)}
										title={col.title}
										className={`aspect-square w-full min-h-[20px] rounded-md transition-all duration-150 relative flex items-center justify-center ${
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
				</div>

				{/* Navigation Links in Sidebar */}
				<nav className="flex-1 overflow-y-auto p-4">
					<ul className="space-y-1.5 text-sm">
						<li>
							<button
								type="button"
								onClick={() => {
									setSidebarOpen(false);
									window.location.hash = 'about';
								}}
								className="w-full text-left block rounded p-2 text-text hover:bg-surface0 hover:text-accent transition-colors cursor-pointer"
							>
								About
							</button>
						</li>
						<li>
							<a
								href="/projects"
								onClick={() => setSidebarOpen(false)}
								className="w-full text-left block rounded p-2 text-text hover:bg-surface0 hover:text-accent transition-colors"
							>
								Projects
							</a>
						</li>

						<li>
							<hr className="my-2.5 border-surface0" />
						</li>

						<li className="text-subtext0 px-2 py-1 text-xs uppercase tracking-wider font-semibold">
							External Links
						</li>

						{resume && (
							<li>
								<a
									href={resume}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center justify-between rounded p-2 text-text hover:bg-surface0 hover:text-accent transition-colors text-xs"
								>
									<span>Resume (PDF)</span>
									<span>↗</span>
								</a>
							</li>
						)}
						{github && (
							<li>
								<a
									href={github}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center justify-between rounded p-2 text-text hover:bg-surface0 hover:text-accent transition-colors text-xs"
								>
									<span>GitHub</span>
									<span>↗</span>
								</a>
							</li>
						)}
						{linkedin && (
							<li>
								<a
									href={linkedin}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center justify-between rounded p-2 text-text hover:bg-surface0 hover:text-accent transition-colors text-xs"
								>
									<span>LinkedIn</span>
									<span>↗</span>
								</a>
							</li>
						)}
					</ul>
				</nav>
			</aside>
		</>
	);
}
