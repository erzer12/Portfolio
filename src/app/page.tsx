import { getProfile } from '@/lib/data/profile';
import { getFeaturedProjects, getProjects } from '@/lib/data/projects';
import { getSkills } from '@/lib/data/skills';
import { getExperience } from '@/lib/data/experience';
import { getEducation } from '@/lib/data/education';
import { getCertifications } from '@/lib/data/certifications';
import { getAchievements } from '@/lib/data/achievements';
import { getApprovedTestimonials } from '@/lib/data/testimonials';
import { getSiteSettings } from '@/lib/data/settings';
import { getFooterLinks } from '@/lib/data/footer';
import { Header } from '@/components/resume/Header';
import { ProfileSummary } from '@/components/resume/ProfileSummary';
import { SkillsTable } from '@/components/resume/SkillsTable';
import { ExperienceList } from '@/components/resume/ExperienceList';
import { FeaturedProjects } from '@/components/resume/FeaturedProjects';
import { EducationList } from '@/components/resume/EducationList';
import { CertsList } from '@/components/resume/CertsList';
import { AchievementsSection } from '@/components/resume/AchievementsSection';
import { ContactSection } from '@/components/resume/ContactSection';
import { TestimonialsSection } from '@/components/resume/TestimonialsSection';
import { SectionLabel } from '@/components/resume/SectionLabel';
import { SectionRule } from '@/components/resume/SectionRule';
import { MinimalNav } from '@/components/layout/MinimalNav';
import { MinimalFooter } from '@/components/layout/MinimalFooter';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [
    profile,
    featuredProjects,
    allProjects,
    skills,
    experience,
    education,
    certifications,
    achievements,
    testimonials,
    settings,
    footerLinks,
  ] = await Promise.all([
    getProfile(),
    getFeaturedProjects(),
    getProjects(),
    getSkills(),
    getExperience(),
    getEducation(),
    getCertifications(),
    getAchievements(),
    getApprovedTestimonials(),
    getSiteSettings(),
    getFooterLinks(),
  ]);

  return (
    <main className="mx-auto min-h-screen max-w-[760px] px-4 py-6 text-sm text-[--ink]">
      <MinimalNav
        name="HP."
        email={profile?.email ?? 'harshilp1234@gmail.com'}
        github={profile?.social?.github ?? 'https://github.com/erzer12'}
      />

      <div className="space-y-12 py-10">
        {/* §1 Header */}
        <Header
          name={profile?.name ?? 'Harshil P'}
          tagline={profile?.tagline ?? ''}
          location={profile?.location ?? 'Kerala, India'}
          status="Open to work"
          image={profile?.image}
          socialLinks={[
            { label: 'GitHub', href: profile?.social?.github ?? 'https://github.com/erzer12' },
            { label: 'LinkedIn', href: profile?.social?.linkedin ?? 'https://linkedin.com/in/harshil-p' },
            { label: 'Email', href: `mailto:${profile?.email ?? 'harshilp1234@gmail.com'}` },
            ...(profile?.resume ? [{ label: 'Resume', href: profile.resume }] : []),
          ]}
        />

        {/* §2 Profile Summary */}
        {profile?.summary && (
          <section>
            <SectionLabel>Profile</SectionLabel>
            <SectionRule />
            <ProfileSummary summary={profile.summary} />
          </section>
        )}

        {/* §3 Skills */}
        {skills.length > 0 && (
          <section>
            <SectionLabel>Skills</SectionLabel>
            <SectionRule />
            <SkillsTable items={skills} />
          </section>
        )}

        {/* §4 Experience */}
        {experience.length > 0 && (
          <section>
            <SectionLabel>Experience</SectionLabel>
            <SectionRule />
            <ExperienceList items={experience} projects={allProjects} />
          </section>
        )}

        {/* §5 Projects — top 3 featured */}
        <section>
          <SectionLabel>Projects</SectionLabel>
          <SectionRule />
          <FeaturedProjects items={featuredProjects} viewAllHref="/projects" />
        </section>

        {/* §6 Education */}
        {education.length > 0 && (
          <section>
            <SectionLabel>Education</SectionLabel>
            <SectionRule />
            <EducationList items={education} />
          </section>
        )}

        {/* §7 Achievements */}
        {achievements.length > 0 && (
          <section>
            <SectionLabel>Achievements</SectionLabel>
            <SectionRule />
            <AchievementsSection items={achievements} />
          </section>
        )}

        {/* §8 Certifications */}
        {certifications.length > 0 && (
          <section>
            <SectionLabel>Certifications</SectionLabel>
            <SectionRule />
            <CertsList items={certifications} />
          </section>
        )}

        {/* §9 Testimonials — conditionally shown via CMS toggle */}
        {settings.show_testimonials && testimonials.length > 0 && (
          <section>
            <SectionLabel>Testimonials</SectionLabel>
            <SectionRule />
            <TestimonialsSection items={testimonials} />
          </section>
        )}

        {/* §10 Contact */}
        <section>
          <SectionLabel>Contact</SectionLabel>
          <SectionRule />
          <ContactSection />
        </section>
      </div>

      <MinimalFooter links={footerLinks} />
    </main>
  );
}
