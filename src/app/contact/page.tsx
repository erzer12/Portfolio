import { ContactForm } from '@/components/ContactForm';
import { LayoutWrapper } from '@/components/LayoutWrapper';
import { getProfile } from '@/lib/data/profile';

export const dynamic = 'force-dynamic';

export default async function ContactPage() {
	const profile = await getProfile();

	const linkGroups = [
		{
			category: 'Professional',
			links: [
				{
					label: 'LinkedIn',
					url: profile?.social?.linkedin || 'https://www.linkedin.com/in/harshilp1',
				},
				{
					label: 'Resume PDF',
					url:
						profile?.resume ||
						'https://hlbmzefstbersvrafzji.supabase.co/storage/v1/object/public/portfolio_media/1778125303389-6bz4xb.pdf',
				},
			],
		},
		{
			category: 'Coding',
			links: [
				{ label: 'GitHub', url: profile?.social?.github || 'https://github.com/erzer12' },
				{ label: 'LeetCode', url: 'https://leetcode.com/u/erzer12/' },
			],
		},
		{
			category: 'AI & ML',
			links: [
				{ label: 'Kaggle', url: 'https://www.kaggle.com/erzer12' },
				{ label: 'HuggingFace', url: 'https://huggingface.co/Erzer12' },
			],
		},
	];

	return (
		<LayoutWrapper>
			<div className="space-y-8 py-4 max-w-[650px] mx-auto">
				{/* Header */}
				<header className="space-y-2">
					<h1 className="text-3xl font-semibold tracking-tight text-on-surface">Get in touch</h1>
					<p className="text-xs font-mono text-on-surface-variant uppercase tracking-widest">
						I read everything. Usually reply within a day.
					</p>
					<hr className="border-border-muted/40 mt-3" />
				</header>

				{/* Two Column Layout */}
				<div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-10">
					{/* Left: Contact Form */}
					<ContactForm />

					{/* Right: Categorized Links */}
					<div className="flex flex-col gap-6">
						{linkGroups.map((group) => (
							<div key={group.category} className="space-y-2">
								<h3 className="font-mono text-[9px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">
									{group.category}
								</h3>
								<ul className="flex flex-col gap-1.5">
									{group.links.map((link) => (
										<li key={link.label}>
											<a
												href={link.url}
												target="_blank"
												rel="noopener noreferrer"
												className="text-xs text-on-surface hover:text-primary transition-colors flex items-center justify-between group py-0.5 border-b border-border-muted/20 hover:border-primary/50"
											>
												<span className="font-mono">{link.label}</span>
												<span className="material-symbols-outlined text-[12px] opacity-60 group-hover:opacity-100 transition-opacity">
													open_in_new
												</span>
											</a>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>
			</div>
		</LayoutWrapper>
	);
}
