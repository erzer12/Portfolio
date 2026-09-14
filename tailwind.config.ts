import type { Config } from 'tailwindcss';

const config: Config = {
	content: ['./src/**/*.{ts,tsx}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				base: 'var(--color-base)',
				mantle: 'var(--color-mantle)',
				crust: 'var(--color-crust)',
				surface0: 'var(--color-surface0)',
				surface1: 'var(--color-surface1)',
				surface2: 'var(--color-surface2)',
				overlay0: 'var(--color-overlay0)',
				overlay1: 'var(--color-overlay1)',
				text: 'var(--color-text)',
				subtext0: 'var(--color-subtext0)',
				subtext1: 'var(--color-subtext1)',
				accent: 'var(--current-accent-color)',
				'accent-fg': 'var(--accent-fg)',

				// Catppuccin pastel palette tokens
				rosewater: 'var(--color-rosewater)',
				flamingo: 'var(--color-flamingo)',
				pink: 'var(--color-pink)',
				mauve: 'var(--color-mauve)',
				red: 'var(--color-red)',
				maroon: 'var(--color-maroon)',
				peach: 'var(--color-peach)',
				yellow: 'var(--color-yellow)',
				green: 'var(--color-green)',
				teal: 'var(--color-teal)',
				sky: 'var(--color-sky)',
				sapphire: 'var(--color-sapphire)',
				blue: 'var(--color-blue)',
				lavender: 'var(--color-lavender)',
			},
			fontFamily: {
				mono: ['var(--font-mono)', 'JetBrains Mono', 'Menlo', 'monospace'],
				sans: ['var(--font-mono)', 'JetBrains Mono', 'Menlo', 'monospace'],
				serif: ['var(--font-serif)', 'Instrument Serif', 'Georgia', 'serif'],
				grotesk: ['var(--font-grotesk)', 'Space Grotesk', 'system-ui', 'sans-serif'],
			},
		},
	},
	plugins: [],
};

export default config;
