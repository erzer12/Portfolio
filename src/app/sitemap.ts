import type { MetadataRoute } from 'next';
import { getAllProjectSlugs } from '@/lib/data/projects';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = 'https://harshilp12.vercel.app';
	const slugs = await getAllProjectSlugs();

	const projectUrls: MetadataRoute.Sitemap = slugs.map((slug) => ({
		url: `${baseUrl}/projects/${slug}`,
		lastModified: new Date(),
		changeFrequency: 'monthly',
		priority: 0.8,
	}));

	return [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 1.0,
		},
		{
			url: `${baseUrl}/projects`,
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 0.9,
		},
		{
			url: `${baseUrl}/experience`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.8,
		},
		{
			url: `${baseUrl}/contact`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.7,
		},
		...projectUrls,
	];
}
