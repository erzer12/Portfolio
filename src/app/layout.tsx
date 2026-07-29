import type { Metadata } from 'next';
import './base.css';
import './components.css';
import './app.css';

export const metadata: Metadata = {
	title: {
		default: 'Harshil P — CS Student & Builder',
		template: '%s | Harshil P',
	},
	description:
		'Computer Science student specialized in AI/ML products and production software development. Exploring client-side intelligence, sequence models, and full-stack architecture.',
	keywords: [
		'Harshil P',
		'Harshil Praveen',
		'Software Engineer Portfolio',
		'AI/ML Developer',
		'Next.js Developer',
		'TypeScript Developer',
		'Client-Side AI Products',
		'Full-Stack Builder',
		'Computer Science Student',
	],
	metadataBase: new URL('https://harshilp.codes'),
	alternates: {
		canonical: '/',
	},
	authors: [{ name: 'Harshil P' }],

	openGraph: {
		title: 'Harshil P — CS Student & Builder',
		description:
			'Computer Science student building at the intersection of AI/ML and production web applications.',
		url: 'https://harshilp.codes',
		siteName: 'Harshil P Portfolio',
		images: [
			{
				url: '/og-image.png',
				width: 1200,
				height: 630,
				alt: 'Harshil P — Portfolio Preview',
			},
		],
		locale: 'en_IN',
		type: 'profile',
		username: 'harshilp1',
		firstName: 'Harshil',
		lastName: 'P',
	},

	robots: {
		index: true,
		follow: true,
	},
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
				/>
				<script
					// biome-ignore lint/security/noDangerouslySetInnerHtml: theme resolution blocking script to prevent flash
					dangerouslySetInnerHTML={{
						__html: `
							(function() {
								try {
									var saved = localStorage.getItem('theme');
									if (saved) {
										document.documentElement.className = saved;
									} else {
										var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
										if (darkQuery.matches) {
											document.documentElement.className = 'theme-night';
										} else {
											document.documentElement.className = 'theme-day';
										}
									}
								} catch (e) {}
							})();
						`,
					}}
				/>
			</head>
			<body>{children}</body>
		</html>
	);
}
