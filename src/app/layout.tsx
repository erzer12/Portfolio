import type { Metadata } from 'next';
import { Inconsolata, Instrument_Serif, Inter, Space_Grotesk } from 'next/font/google';
import './base.css';
import './components.css';
import './app.css';
import 'leaflet/dist/leaflet.css';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ThemeProvider } from '@/components/theme/ThemeContext';
import { getProfile } from '@/lib/data/profile';

// Primary monospace — Inconsolata (variable font, all weights)
const inconsolata = Inconsolata({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-inconsolata',
	fallback: ['JetBrains Mono', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
});

// Sub / body font — Inter (variable font, all weights)
const inter = Inter({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-inter',
	fallback: ['Space Grotesk', 'system-ui', '-apple-system', 'sans-serif'],
});

// Serif display — Instrument Serif (kept for card titles)
const instrumentSerif = Instrument_Serif({
	subsets: ['latin'],
	weight: ['400'],
	style: ['normal', 'italic'],
	display: 'swap',
	variable: '--font-instrument-serif',
	fallback: ['Georgia', 'serif'],
});

// Space Grotesk — kept as fallback, loaded via CSS @import
const spaceGrotesk = Space_Grotesk({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-space-grotesk',
	fallback: ['system-ui', 'sans-serif'],
});

export async function generateMetadata(): Promise<Metadata> {
	const profile = await getProfile();
	const name = profile?.name ?? 'Harshil P';
	const tagline = profile?.tagline ?? 'CS Student & Builder';
	const ogImageUrl = profile?.image;

	return {
		title: {
			default: `${name} — CS Student & Builder`,
			template: `%s | ${name}`,
		},
		description:
			profile?.summary ||
			'Computer Science student specialized in AI/ML products and production software development.',
		keywords: [
			name,
			'Harshil Praveen',
			'Software Engineer Portfolio',
			'AI/ML Developer',
			'Next.js Developer',
			'TypeScript Developer',
			'Client-Side AI Products',
			'Full-Stack Builder',
			'Computer Science Student',
		],
		metadataBase: new URL('https://harshilp12.vercel.app'),
		alternates: {
			canonical: '/',
		},
		authors: [{ name }],

		openGraph: {
			title: `${name} — CS Student & Builder`,
			description: tagline,
			url: 'https://harshilp12.vercel.app',
			siteName: `${name} Portfolio`,
			images: ogImageUrl
				? [
						{
							url: ogImageUrl,
							width: 1200,
							height: 630,
							alt: `${name} — Portfolio Preview`,
						},
					]
				: undefined,
			locale: 'en_IN',
			type: 'profile',
			username: 'harshilp1',
			firstName: name.split(' ')[0] || 'Harshil',
			lastName: name.split(' ')[1] || 'P',
		},

		twitter: {
			card: 'summary_large_image',
			title: `${name} — CS Student & Builder`,
			description: tagline,
			images: ogImageUrl ? [ogImageUrl] : undefined,
		},

		robots: {
			index: true,
			follow: true,
		},
	};
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
			className={`bg-base font-mono text-text selection:bg-surface1 selection:text-accent caret-accent min-h-screen ${inconsolata.variable} ${inter.variable} ${instrumentSerif.variable} ${spaceGrotesk.variable}`}
		>
			<head>
				<script data-theme-init>
					{`
						(function() {
							try {
								var palette = localStorage.getItem('catppuccin-palette') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'latte' : 'mocha');
								var accent = localStorage.getItem('catppuccin-accent') || 'peach';
								var font = localStorage.getItem('portfolio-font') || 'mono';
								document.documentElement.classList.remove('mocha', 'latte', 'frappe', 'macchiato');
								document.documentElement.classList.add(palette);
								document.documentElement.setAttribute('data-accent', accent);
								document.documentElement.setAttribute('data-font', font);
								document.documentElement.style.setProperty('--current-accent-color', 'var(--color-' + accent + ')');
							} catch(e) {}
						})();
					`}
				</script>
			</head>
			<body className="bg-base text-text min-h-screen">
				<ThemeProvider>{children}</ThemeProvider>
				<SpeedInsights />
				<Analytics />
			</body>
		</html>
	);
}
