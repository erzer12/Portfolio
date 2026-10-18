import type { Metadata } from 'next';
import Link from 'next/link';
import { MinimalFooter } from '@/components/layout/Footer';
import { MinimalNav } from '@/components/layout/Navigation';
import { ExperienceTimeline } from '@/components/resume/ExperienceTimeline';
import { getFooterLinks } from '@/lib/data/footer';
import { getProfile } from '@/lib/data/profile';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
	title: 'Experience — Harshil P',
	description:
		'A timeline of engineering roles, open-source contributions, milestones, and academic background.',
};

export default async function ExperiencePage() {
	const [profile, footerLinks] = await Promise.all([getProfile(), getFooterLinks()]);

	return (
		<div className="min-h-screen flex flex-col bg-base text-text selection:bg-surface1 selection:text-accent font-mono transition-colors">
			<MinimalNav
				name={profile?.name ?? 'harshil'}
				email={profile?.email ?? 'harshilp1234@gmail.com'}
				github={profile?.social?.github ?? 'https://github.com/erzer12'}
				resume={profile?.resume}
				linkedin={profile?.social?.linkedin ?? 'https://www.linkedin.com/in/harshilp1/'}
			/>

			<main className="flex-1 mx-auto w-full max-w-7xl px-6 sm:px-8 md:px-12 lg:px-16 py-6 sm:py-10 space-y-10 pb-20">
				{/* Page Header */}
				<header className="space-y-3 border-b border-surface0/60 pb-6">
					<nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-subtext1">
						<Link href="/" className="hover:text-accent transition-colors">
							~
						</Link>
						<span className="text-surface2">/</span>
						<span className="text-accent font-bold">experience</span>
					</nav>

					<div className="space-y-1">
						<div className="flex items-center gap-2">
							<span className="text-accent text-xs font-mono font-bold">02 {'//'}</span>
							<h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text">
								Experience
							</h1>
						</div>
						<p className="text-subtext0 text-sm font-sans max-w-2xl leading-relaxed">
							A short timeline of my journey, roles and key contributions.
						</p>
					</div>
				</header>

				{/* Primary Visual Element: Twisting S-Curve Experience Timeline */}
				<section aria-label="Career and milestone timeline">
					<ExperienceTimeline />
				</section>
			</main>

			<MinimalFooter
				links={footerLinks}
				email={profile?.email}
				github={profile?.social?.github}
				linkedin={profile?.social?.linkedin}
				instagram={profile?.social?.instagram}
			/>
		</div>
	);
}
