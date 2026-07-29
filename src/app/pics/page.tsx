import { LayoutWrapper } from '@/components/LayoutWrapper';
import { PicsGallery } from '@/components/PicsGallery';

export const dynamic = 'force-dynamic';

const photos = [
	{
		id: '1',
		title: 'Mist Over Munnar Hills',
		location: 'Munnar, Kerala',
		camera: 'Sony Alpha 6400',
		lens: 'Sigma 30mm f/1.4',
		settings: 'ISO 100 · 30mm · f/4.0 · 1/400s',
		url: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=600&auto=format&fit=crop',
	},
	{
		id: '2',
		title: 'Late Night Code Sessions',
		location: 'Home Studio',
		camera: 'Sony Alpha 6400',
		lens: 'Sony 18-135mm',
		settings: 'ISO 400 · 18mm · f/3.5 · 1/30s',
		url: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=600&auto=format&fit=crop',
	},
	{
		id: '3',
		title: 'Kovalam Sea Waves',
		location: 'Kovalam Beach, Trivandrum',
		camera: 'Sony Alpha 6400',
		lens: 'Sigma 30mm f/1.4',
		settings: 'ISO 100 · 30mm · f/2.8 · 1/1000s',
		url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop',
	},
	{
		id: '4',
		title: 'Tactile Keyboard Details',
		location: 'Desk Setup',
		camera: 'Sony Alpha 6400',
		lens: 'Sigma 30mm f/1.4',
		settings: 'ISO 200 · 30mm · f/1.8 · 1/125s',
		url: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=600&auto=format&fit=crop',
	},
	{
		id: '5',
		title: 'Lines of Kochi Metro',
		location: 'Kochi, Kerala',
		camera: 'Sony Alpha 6400',
		lens: 'Sigma 30mm f/1.4',
		settings: 'ISO 160 · 30mm · f/2.0 · 1/160s',
		url: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=600&auto=format&fit=crop',
	},
	{
		id: '6',
		title: 'Fort Kochi Golden Hour',
		location: 'Fort Kochi Beach',
		camera: 'Sony Alpha 6400',
		lens: 'Sony 18-135mm',
		settings: 'ISO 100 · 50mm · f/5.6 · 1/640s',
		url: 'https://images.unsplash.com/photo-1626573752520-22c6cd0c8db2?q=80&w=600&auto=format&fit=crop',
	},
];

export default async function PicsPage() {
	return (
		<LayoutWrapper>
			<div className="space-y-8 py-4 max-w-[650px] mx-auto">
				{/* Header */}
				<header className="space-y-2">
					<h1 className="text-3xl font-semibold tracking-tight text-on-surface">Pics</h1>
					<p className="text-xs font-mono text-on-surface-variant uppercase tracking-widest">
						Photography gallery from Kerala, travel, and setups.
					</p>
					<hr className="border-border-muted/40 mt-3" />
				</header>

				{/* Photography Gallery component */}
				<PicsGallery photos={photos} />
			</div>
		</LayoutWrapper>
	);
}
