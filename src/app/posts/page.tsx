import { LayoutWrapper } from '@/components/LayoutWrapper';
import { PostsList } from '@/components/PostsList';

export const dynamic = 'force-dynamic';

const posts = [
	{
		id: '1',
		title: 'Building SignStream: Real-time American Sign Language Recognition on the Client',
		description:
			'A deep dive into deploying lightweight TensorFlow.js and ONNX model pipelines directly in the browser to translate sign language gestures on edge devices.',
		date: 'March 15, 2026',
		readingTime: '6 min read',
		category: 'Machine Learning',
		content: [
			'Standard sign language translation systems usually offload heavy machine learning workloads to remote servers. This introduces network latency, raises privacy concerns, and increases infrastructure costs. In SignStream, we designed a client-side architecture that runs fully local.',
			'We leveraged MediaPipe Hands for keypoint detection. By extracting hand coordinates, we obtain 21 3D landmarks. This reduces the raw input size from large megapixel images to a simple numerical coordinates array, saving massive CPU cycles.',
			'The model itself runs on PyTorch, which we compiled to ONNX format. By using ONNX Runtime Web with WebGL/WebGPU acceleration, we achieve an inference latency of under 18ms directly in the browser, translating letters and signs in real-time with over 94% accuracy.',
		],
	},
	{
		id: '2',
		title: 'Optimizing Next.js for Community Scale: Core Web Vitals at GTech MuLearn',
		description:
			'How we standardized React component libraries and database indexes to serve over 60,000 active community members with sub-second page loads.',
		date: 'January 28, 2026',
		readingTime: '4 min read',
		category: 'Frontend Engineering',
		content: [
			'GTech MuLearn has grown rapidly to over 60,000 members. With thousands of concurrent requests, our old rendering configuration was experiencing severe CPU throttling on the Next.js dev server. We set out to audit our performance bottlenecks.',
			'First, we refactored our rendering pathways. By transitioning sterile pages to Static Site Generation (SSG) with Incremental Static Regeneration (ISR), we reduced dynamic database lookups by 85%. Page load times dropped from 2.4s to under 400ms.',
			'Second, we standardized our UI component library. By replacing bloated external CSS styles with custom utility styles and cleaning up layout layout containers, we decreased our JS bundle sizes by 32KB. This directly improved our LCP and CLS scores to a perfect 100 on Lighthouse audits.',
		],
	},
	{
		id: '3',
		title: 'Geospatial Climate Risk Analysis: NASA Space Apps Global Nominee Architecture',
		description:
			'Developing Streamlit climate data visualizations to evaluate risk metrics for critical infrastructures across 20-year climate forecast models.',
		date: 'October 10, 2025',
		readingTime: '5 min read',
		category: 'Data Science',
		content: [
			'During the NASA Space Apps Challenge 2025, our team was tasked with mapping climate risk forecasts against critical regional infrastructure. We developed a tool using Streamlit, GeoPandas, and historical satellite data.',
			'By pulling regional coordinate feeds, we overlaid 20-year precipitation and temperature change projections onto public infrastructure coordinates. We evaluated susceptibility scores using custom mathematical risk indices.',
			'This lightweight, highly visual tool enabled policy planners to immediately isolate high-risk facilities in seconds. The project won local acclaim and was selected as a Global Nominee, placing in the top tiers worldwide.',
		],
	},
];

export default async function PostsPage() {
	return (
		<LayoutWrapper>
			<div className="space-y-8 py-4 max-w-[650px] mx-auto">
				{/* Header */}
				<header className="space-y-2">
					<h1 className="text-3xl font-semibold tracking-tight text-on-surface">Writing</h1>
					<p className="text-xs font-mono text-on-surface-variant uppercase tracking-widest">
						Technical thoughts, write-ups, and tutorials.
					</p>
					<hr className="border-border-muted/40 mt-3" />
				</header>

				{/* Posts List */}
				<PostsList posts={posts} />
			</div>
		</LayoutWrapper>
	);
}
