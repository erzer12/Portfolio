'use client';

import { useEffect, useState } from 'react';

type Theme =
	| 'theme-night'
	| 'theme-day'
	| 'theme-catppuccin-mocha'
	| 'theme-catppuccin-macchiato'
	| 'theme-catppuccin-frappe'
	| 'theme-catppuccin-latte'
	| 'theme-cyberpunk'
	| 'theme-gruvbox'
	| 'theme-nord';

const themes: { id: Theme; label: string }[] = [
	{ id: 'theme-night', label: 'Night' },
	{ id: 'theme-day', label: 'Day' },
	{ id: 'theme-catppuccin-mocha', label: 'Mocha' },
	{ id: 'theme-catppuccin-macchiato', label: 'Macchiato' },
	{ id: 'theme-catppuccin-frappe', label: 'Frappe' },
	{ id: 'theme-catppuccin-latte', label: 'Latte' },
	{ id: 'theme-cyberpunk', label: 'Neon' },
	{ id: 'theme-gruvbox', label: 'Retro' },
	{ id: 'theme-nord', label: 'Nord' },
];

export function ThemeToggle() {
	const [activeTheme, setActiveTheme] = useState<Theme>('theme-night');

	useEffect(() => {
		const saved = localStorage.getItem('theme') as Theme | null;
		if (saved && themes.some((t) => t.id === saved)) {
			setActiveTheme(saved);
		} else {
			const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
			setActiveTheme(darkQuery.matches ? 'theme-night' : 'theme-day');
		}
	}, []);

	const changeTheme = (theme: Theme) => {
		setActiveTheme(theme);
		localStorage.setItem('theme', theme);
		document.documentElement.className = theme;
	};

	return (
		<div className="bg-surface-container rounded-xl border border-border-muted p-4 flex flex-col justify-between h-48 w-full transition-colors duration-300">
			<div className="flex items-center justify-between text-on-surface-variant mb-2">
				<div className="flex items-center gap-1.5">
					<span className="material-symbols-outlined text-primary" style={{ fontSize: '16px' }}>
						palette
					</span>
					<span className="font-mono text-[10px] uppercase tracking-[0.1em] font-semibold">
						Theme Engine
					</span>
				</div>
				<span className="text-[9px] font-mono opacity-70">Catppuccin +</span>
			</div>

			<div className="grid grid-cols-3 gap-1 my-auto">
				{themes.map((theme) => (
					<button
						key={theme.id}
						type="button"
						onClick={() => changeTheme(theme.id)}
						className={`px-1 py-1 text-[9px] rounded font-mono border transition-all duration-150 text-center truncate ${
							activeTheme === theme.id
								? 'bg-primary border-primary text-background font-bold shadow-sm scale-[1.02]'
								: 'bg-transparent border-border-muted/50 text-on-surface-variant hover:border-on-surface hover:text-on-surface'
						}`}
						title={theme.label}
					>
						{theme.label}
					</button>
				))}
			</div>
		</div>
	);
}
