import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth';
import { getAchievements } from '@/lib/data/achievements';
import { getCertifications } from '@/lib/data/certifications';
import { getEducation } from '@/lib/data/education';
import { getExperience } from '@/lib/data/experience';
import { getFooterLinks } from '@/lib/data/footer';
import { getContactMessages } from '@/lib/data/messages';
import { getProfile } from '@/lib/data/profile';
import { getProjects } from '@/lib/data/projects';
import { getSiteSettings } from '@/lib/data/settings';
import { getSkills } from '@/lib/data/skills';
import { getAllTestimonials } from '@/lib/data/testimonials';
import { AdminShell } from './_components/AdminShell';

export default async function AdminPage() {
	const authed = await isAdminAuthenticated();
	if (!authed) redirect('/admin/login');

	const [
		profile,
		projects,
		skills,
		experience,
		education,
		certifications,
		achievements,
		testimonials,
		settings,
		footerLinks,
		messages,
	] = await Promise.all([
		getProfile(),
		getProjects(),
		getSkills(),
		getExperience(),
		getEducation(),
		getCertifications(),
		getAchievements(),
		getAllTestimonials(),
		getSiteSettings(),
		getFooterLinks(),
		getContactMessages(),
	]);

	return (
		<main className="min-h-screen bg-base text-text selection:bg-surface1 selection:text-accent font-mono">
			<AdminShell
				profile={profile}
				projects={projects}
				skills={skills}
				experience={experience}
				education={education}
				certifications={certifications}
				achievements={achievements}
				testimonials={testimonials}
				settings={settings}
				footerLinks={footerLinks}
				messages={messages}
			/>
		</main>
	);
}
