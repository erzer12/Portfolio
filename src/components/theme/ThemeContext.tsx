'use client';

import type React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

export type Palette = 'mocha' | 'latte';

export type AccentColor =
	| 'rosewater'
	| 'flamingo'
	| 'pink'
	| 'mauve'
	| 'red'
	| 'maroon'
	| 'peach'
	| 'yellow'
	| 'green'
	| 'teal'
	| 'sky'
	| 'sapphire'
	| 'blue'
	| 'lavender';

export const ACCENT_COLORS: { name: AccentColor; hex: string; title: string }[] = [
	{ name: 'rosewater', hex: '#f5e0dc', title: 'Rosewater' },
	{ name: 'flamingo', hex: '#f2cdcd', title: 'Flamingo' },
	{ name: 'pink', hex: '#f5c2e7', title: 'Pink' },
	{ name: 'mauve', hex: '#cba6f7', title: 'Mauve' },
	{ name: 'red', hex: '#f38ba8', title: 'Red' },
	{ name: 'maroon', hex: '#eba0ac', title: 'Maroon' },
	{ name: 'peach', hex: '#fab387', title: 'Peach' },
	{ name: 'yellow', hex: '#f9e2af', title: 'Yellow' },
	{ name: 'green', hex: '#a6e3a1', title: 'Green' },
	{ name: 'teal', hex: '#94e2d5', title: 'Teal' },
	{ name: 'sky', hex: '#89dceb', title: 'Sky' },
	{ name: 'sapphire', hex: '#74c7ec', title: 'Sapphire' },
	{ name: 'blue', hex: '#89b4fa', title: 'Blue' },
	{ name: 'lavender', hex: '#b4befe', title: 'Lavender' },
];

type ThemeContextType = {
	palette: Palette;
	accent: AccentColor;
	setPalette: (palette: Palette) => void;
	setAccent: (accent: AccentColor) => void;
};

export const LATTE_ACCENT_HEX: Record<AccentColor, string> = {
	rosewater: '#dc8a78',
	flamingo: '#dd7878',
	pink: '#ea76cb',
	mauve: '#8839ef',
	red: '#d20f39',
	maroon: '#e64553',
	peach: '#fe640b',
	yellow: '#df8e1d',
	green: '#40a02b',
	teal: '#179299',
	sky: '#04a5e5',
	sapphire: '#209fb5',
	blue: '#1e66f5',
	lavender: '#7287fd',
};

const ThemeContext = createContext<ThemeContextType>({
	palette: 'mocha',
	accent: 'peach',
	setPalette: () => {},
	setAccent: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [palette, setPaletteState] = useState<Palette>('mocha');
	const [accent, setAccentState] = useState<AccentColor>('peach');

	useEffect(() => {
		try {
			const savedPalette = localStorage.getItem('catppuccin-palette') as Palette | null;
			const savedAccent = localStorage.getItem('catppuccin-accent') as AccentColor | null;

			const initialPalette: Palette =
				savedPalette ||
				(window.matchMedia('(prefers-color-scheme: light)').matches ? 'latte' : 'mocha');
			const initialAccent: AccentColor = savedAccent || 'peach';

			setPaletteState(initialPalette);
			setAccentState(initialAccent);

			document.documentElement.classList.remove('mocha', 'latte');
			document.documentElement.classList.add(initialPalette);
			document.documentElement.setAttribute('data-accent', initialAccent);

			const hex =
				initialPalette === 'latte'
					? LATTE_ACCENT_HEX[initialAccent]
					: (ACCENT_COLORS.find((c) => c.name === initialAccent)?.hex ?? '#fab387');
			document.documentElement.style.setProperty('--current-accent-color', hex);
		} catch {
			// fallback silently
		}
	}, []);

	const setPalette = (newPalette: Palette) => {
		setPaletteState(newPalette);
		try {
			localStorage.setItem('catppuccin-palette', newPalette);
			document.documentElement.classList.remove('mocha', 'latte');
			document.documentElement.classList.add(newPalette);

			const hex =
				newPalette === 'latte'
					? LATTE_ACCENT_HEX[accent]
					: (ACCENT_COLORS.find((c) => c.name === accent)?.hex ?? '#fab387');
			document.documentElement.style.setProperty('--current-accent-color', hex);
		} catch {
			// ignore
		}
	};

	const setAccent = (newAccent: AccentColor) => {
		setAccentState(newAccent);
		try {
			localStorage.setItem('catppuccin-accent', newAccent);
			document.documentElement.setAttribute('data-accent', newAccent);

			const hex =
				palette === 'latte'
					? LATTE_ACCENT_HEX[newAccent]
					: (ACCENT_COLORS.find((c) => c.name === newAccent)?.hex ?? '#fab387');
			document.documentElement.style.setProperty('--current-accent-color', hex);
		} catch {
			// ignore
		}
	};

	return (
		<ThemeContext.Provider value={{ palette, accent, setPalette, setAccent }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	return useContext(ThemeContext);
}
