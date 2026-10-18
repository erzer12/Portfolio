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

export type FontPreset = 'mono' | 'modern' | 'geometric' | 'editorial';

export const FONT_PRESETS: { id: FontPreset; label: string; name: string }[] = [
	{ id: 'mono', label: 'Mono', name: 'JetBrains Mono' },
	{ id: 'modern', label: 'Modern', name: 'Inter Sans' },
	{ id: 'geometric', label: 'Geometric', name: 'Space Grotesk' },
	{ id: 'editorial', label: 'Editorial', name: 'Fraunces Serif' },
];

type ThemeContextType = {
	palette: Palette;
	accent: AccentColor;
	fontStyle: FontPreset;
	setPalette: (palette: Palette) => void;
	setAccent: (accent: AccentColor) => void;
	setFontStyle: (font: FontPreset) => void;
	cycleFontStyle: () => void;
};

export const LATTE_ACCENT_HEX: Record<AccentColor, string> = {
	rosewater: '#c26553',
	flamingo: '#c25353',
	pink: '#be3e95',
	mauve: '#7c3aed',
	red: '#dc2626',
	maroon: '#b91c1c',
	peach: '#ea580c',
	yellow: '#d97706',
	green: '#16a34a',
	teal: '#0d9488',
	sky: '#0284c7',
	sapphire: '#0369a1',
	blue: '#2563eb',
	lavender: '#6366f1',
};

const ThemeContext = createContext<ThemeContextType>({
	palette: 'mocha',
	accent: 'peach',
	fontStyle: 'mono',
	setPalette: () => {},
	setAccent: () => {},
	setFontStyle: () => {},
	cycleFontStyle: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [palette, setPaletteState] = useState<Palette>('mocha');
	const [accent, setAccentState] = useState<AccentColor>('peach');
	const [fontStyle, setFontStyleState] = useState<FontPreset>('mono');

	useEffect(() => {
		try {
			const savedPalette = localStorage.getItem('catppuccin-palette') as Palette | null;
			const savedAccent = localStorage.getItem('catppuccin-accent') as AccentColor | null;
			const savedFont = (localStorage.getItem('portfolio-font') as FontPreset) || 'mono';

			const initialPalette: Palette =
				savedPalette ||
				(window.matchMedia('(prefers-color-scheme: light)').matches ? 'latte' : 'mocha');
			const initialAccent: AccentColor = savedAccent || 'peach';
			const initialFont: FontPreset = savedFont;

			setPaletteState(initialPalette);
			setAccentState(initialAccent);
			setFontStyleState(initialFont);

			document.documentElement.classList.remove('mocha', 'latte');
			document.documentElement.classList.add(initialPalette);
			document.documentElement.setAttribute('data-accent', initialAccent);
			document.documentElement.setAttribute('data-font', initialFont);

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

	const setFontStyle = (newFont: FontPreset) => {
		setFontStyleState(newFont);
		try {
			localStorage.setItem('portfolio-font', newFont);
			document.documentElement.setAttribute('data-font', newFont);
		} catch {
			// ignore
		}
	};

	const cycleFontStyle = () => {
		const order: FontPreset[] = ['mono', 'modern', 'geometric', 'editorial'];
		const next = order[(order.indexOf(fontStyle) + 1) % order.length];
		setFontStyle(next);
	};

	return (
		<ThemeContext.Provider
			value={{
				palette,
				accent,
				fontStyle,
				setPalette,
				setAccent,
				setFontStyle,
				cycleFontStyle,
			}}
		>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	return useContext(ThemeContext);
}
