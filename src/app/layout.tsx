import type { Metadata } from 'next';
import './globals.css';

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
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
