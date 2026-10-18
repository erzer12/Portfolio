import { MinimalFooter } from '@/components/layout/Footer';
import { MinimalNav } from '@/components/layout/Navigation';
import { AffiliationRibbon } from '@/components/resume/AffiliationRibbon';
import { DashboardWidgets } from '@/components/resume/DashboardWidgets';
import { FeaturedProjects } from '@/components/resume/FeaturedProjects';
import { Header } from '@/components/resume/Header';
import { getFooterLinks } from '@/lib/data/footer';
import { getLatestPortfolioCommitSha } from '@/lib/data/git';
import { getRecentCommits } from '@/lib/data/github';
import { getProfile } from '@/lib/data/profile';
import { getFeaturedProjects } from '@/lib/data/projects';

export const dynamic = 'force-dynamic';

export default async function Home() {
	const githubUsername = 'erzer12';
	const [profile, featuredProjects, footerLinks, lastCommitSha, recentCommits] = await Promise.all([
		getProfile(),
		getFeaturedProjects(),
		getFooterLinks(),
		getLatestPortfolioCommitSha(),
		getRecentCommits(githubUsername),
	]);

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
				{/* §1 Hero Section (Jason Cameron Style) */}
				<section id="about">
					<Header
						name={profile?.name ?? 'Harshil P'}
						tagline={profile?.tagline ?? 'CS Student & Builder'}
						location={profile?.location ?? 'Kerala, India'}
						status="Open to opportunities"
						summary={profile?.summary}
						email={profile?.email ?? 'harshilp1234@gmail.com'}
						github={profile?.social?.github ?? 'https://github.com/erzer12'}
						linkedin={profile?.social?.linkedin ?? 'https://www.linkedin.com/in/harshilp1/'}
						resume={profile?.resume}
						image={profile?.image}
						customAscii={profile?.social?.ascii_art}
					/>
				</section>

				{/* §2 Affiliation / Role Ribbon */}
				<AffiliationRibbon items={profile?.social?.affiliations} />

				{/* §3 Featured Projects (Lab Spec Sheet Grid) */}
				<section id="projects">
					<FeaturedProjects items={featuredProjects} viewAllHref="/projects" />
				</section>

				{/* §4 Highlights Dashboard (Interactive Bento Widgets ending with Recent Engineering Activity) */}
				<section id="dashboard">
					<DashboardWidgets
						username={
							profile?.social?.github
								? profile.social.github.split('/').filter(Boolean).pop() || githubUsername
								: githubUsername
						}
						initialCommits={recentCommits}
					/>
				</section>
			</main>

			{/* §5 Sticky Docked Developer Footer */}
			<MinimalFooter
				links={footerLinks}
				lastCommitSha={lastCommitSha}
				email={profile?.email}
				github={profile?.social?.github}
				linkedin={profile?.social?.linkedin}
				instagram={profile?.social?.instagram}
			/>
		</div>
	);
}
