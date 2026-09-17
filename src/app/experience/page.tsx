import type { Metadata } from 'next';
import { MinimalFooter } from '@/components/layout/Footer';
import { MinimalNav } from '@/components/layout/Navigation';
import { AchievementsSection } from '@/components/resume/AchievementsSection';
import { CertsList } from '@/components/resume/CertsList';
import { EducationList } from '@/components/resume/EducationList';
import { ExperienceList } from '@/components/resume/ExperienceList';
import { SkillsTable } from '@/components/resume/SkillsTable';
import { getAchievements } from '@/lib/data/achievements';
import { getCertifications } from '@/lib/data/certifications';
import { getEducation } from '@/lib/data/education';
import { getExperience } from '@/lib/data/experience';
import { getFooterLinks } from '@/lib/data/footer';
import { getProjects } from '@/lib/data/projects';
import { getSkills } from '@/lib/data/skills';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
	title: 'Experience & Credentials — Harshil P',
	description:
		'Comprehensive overview of engineering experience, skills, certifications, education, and achievements.',
};

export default async function ExperiencePage() {
	const [experience, projects, skills, certifications, education, achievements, footerLinks] =
		await Promise.all([
			getExperience(),
			getProjects(),
			getSkills(),
			getCertifications(),
			getEducation(),
			getAchievements(),
			getFooterLinks(),
		]);

	return (
		<div className="min-h-screen flex flex-col bg-base text-text selection:bg-surface1 selection:text-accent font-mono transition-colors">
			<MinimalNav
				name="harshil"
				email="harshilp1234@gmail.com"
				github="https://github.com/erzer12"
			/>

			<main className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 py-6 sm:py-10 space-y-12 pb-20">
				{/* Header banner */}
				<header className="space-y-3 border-b border-surface0/60 pb-6">
					<a
						href="/"
						className="inline-flex items-center gap-1.5 text-xs font-mono text-accent hover:underline mb-1"
					>
						<span>← Back to Home</span>
					</a>
					<h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text">
						Experience & Credentials
					</h1>
					<p className="text-subtext0 text-sm font-sans max-w-2xl leading-relaxed">
						A detailed breakdown of my engineering roles, core technical skills, verified
						certifications, academic background, and honors.
					</p>
				</header>

				{/* Section 1: Work Experience */}
				{experience.length > 0 && (
					<section className="space-y-4" aria-labelledby="experience-heading">
						<div className="flex items-center justify-between border-b border-surface0/40 pb-2">
							<h2
								id="experience-heading"
								className="text-lg font-bold text-text flex items-center gap-2"
							>
								<span className="text-accent select-none">{'//'}</span>
								<span>Work Experience</span>
							</h2>
							<span className="text-xs text-subtext1 font-mono">{experience.length} roles</span>
						</div>
						<ExperienceList items={experience} projects={projects} />
					</section>
				)}

				{/* Section 2: Technical Skills */}
				{skills.length > 0 && (
					<section className="space-y-4" aria-labelledby="skills-heading">
						<div className="flex items-center justify-between border-b border-surface0/40 pb-2">
							<h2
								id="skills-heading"
								className="text-lg font-bold text-text flex items-center gap-2"
							>
								<span className="text-accent select-none">{'//'}</span>
								<span>Skills & Technologies</span>
							</h2>
							<span className="text-xs text-subtext1 font-mono">{skills.length} categories</span>
						</div>
						<SkillsTable items={skills} />
					</section>
				)}

				{/* Section 3: Certifications */}
				{certifications.length > 0 && (
					<section className="space-y-4" aria-labelledby="certs-heading">
						<div className="flex items-center justify-between border-b border-surface0/40 pb-2">
							<h2
								id="certs-heading"
								className="text-lg font-bold text-text flex items-center gap-2"
							>
								<span className="text-accent select-none">{'//'}</span>
								<span>Certifications</span>
							</h2>
							<span className="text-xs text-subtext1 font-mono">
								{certifications.length} verified
							</span>
						</div>
						<CertsList items={certifications} />
					</section>
				)}

				{/* Section 4: Education */}
				{education.length > 0 && (
					<section className="space-y-4" aria-labelledby="education-heading">
						<div className="flex items-center justify-between border-b border-surface0/40 pb-2">
							<h2
								id="education-heading"
								className="text-lg font-bold text-text flex items-center gap-2"
							>
								<span className="text-accent select-none">{'//'}</span>
								<span>Education</span>
							</h2>
						</div>
						<EducationList items={education} />
					</section>
				)}

				{/* Section 5: Honors & Achievements */}
				{achievements.length > 0 && (
					<section className="space-y-4" aria-labelledby="achievements-heading">
						<div className="flex items-center justify-between border-b border-surface0/40 pb-2">
							<h2
								id="achievements-heading"
								className="text-lg font-bold text-text flex items-center gap-2"
							>
								<span className="text-accent select-none">{'//'}</span>
								<span>Honors & Achievements</span>
							</h2>
						</div>
						<AchievementsSection items={achievements} />
					</section>
				)}
			</main>

			<MinimalFooter links={footerLinks} />
		</div>
	);
}
