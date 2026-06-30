import type { Metadata } from 'next';
import './base.css';
import './components.css';
import './app.css';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { getProfile } from '@/lib/data/profile';

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
		metadataBase: new URL('https://harshilp.codes'),
		alternates: {
			canonical: '/',
		},
		authors: [{ name }],

		openGraph: {
			title: `${name} — CS Student & Builder`,
			description: tagline,
			url: 'https://harshilp.codes',
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
		<html lang="en">
			<body>
				{children}
				<SpeedInsights />
				<Analytics />
			</body>
		</html>
	);
}
