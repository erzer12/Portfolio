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
import TOC from '@/components/TOC';

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
    <main className="mx-auto min-h-screen max-w-[760px] px-4 py-6 text-sm text-[--ink] relative">
      <MinimalNav
        name="HP."
        email={profile?.email ?? 'harshilp1234@gmail.com'}
        github={profile?.social?.github ?? 'https://github.com/erzer12'}
        resume={profile?.resume}
        linkedin={profile?.social?.linkedin}
      />

      <div className="space-y-12 py-10">
        {/** Build TOC items dynamically so sections (like testimonials) appear only when present */}
        {
          /* Server-side build of items array */
        }
        {
          (() => {
            const items: { id: string; label: string }[] = [];
            if (profile?.summary) items.push({ id: 'section-profile', label: 'Profile' });
            if (skills.length > 0) items.push({ id: 'section-skills', label: 'Skills' });
            if (experience.length > 0) items.push({ id: 'section-experience', label: 'Experience' });
            items.push({ id: 'section-projects', label: 'Projects' });
            if (education.length > 0) items.push({ id: 'section-education', label: 'Education' });
            if (achievements.length > 0) items.push({ id: 'section-achievements', label: 'Achievements' });
            if (certifications.length > 0) items.push({ id: 'section-certs', label: 'Certifications' });
            if (settings?.show_testimonials && testimonials.length > 0) items.push({ id: 'section-testimonials', label: 'Testimonials' });
            items.push({ id: 'section-contact', label: 'Contact' });
            // JSX needs a stable value; render the client TOC with computed items
            return <TOC items={items} />;
          })()
        }
        {/* §1 Header */}
        <section id="section-header">
          <Header
            name={profile?.name ?? 'Harshil P'}
            tagline={profile?.tagline ?? ''}
            location={profile?.location ?? 'Kerala, India'}
            status="Open to work"
            image={profile?.image}
            imageMeta={profile?.social?.imageMeta ?? null}
            imageCrop={profile?.social?.imageCrop ?? null}
          />
        </section>

        {/* §2 Profile Summary */}
        {profile?.summary && (
          <section id="section-profile">
            <SectionLabel>Profile</SectionLabel>
            <SectionRule />
            <ProfileSummary summary={profile.summary} />
          </section>
        )}

        {/* §3 Skills */}
        {skills.length > 0 && (
          <section id="section-skills">
            <SectionLabel>Skills</SectionLabel>
            <SectionRule />
            <SkillsTable items={skills} />
          </section>
        )}

        {/* §4 Experience */}
        {experience.length > 0 && (
          <section id="section-experience">
            <SectionLabel>Experience</SectionLabel>
            <SectionRule />
            <ExperienceList items={experience} projects={allProjects} />
          </section>
        )}

        {/* §5 Projects — top 3 featured */}
        <section id="section-projects">
          <SectionLabel>Projects</SectionLabel>
          <SectionRule />
          <FeaturedProjects items={featuredProjects} viewAllHref="/projects" />
        </section>

        {/* §6 Education */}
        {education.length > 0 && (
          <section id="section-education">
            <SectionLabel>Education</SectionLabel>
            <SectionRule />
            <EducationList items={education} />
          </section>
        )}

        {/* §7 Achievements */}
        {achievements.length > 0 && (
          <section id="section-achievements">
            <SectionLabel>Achievements</SectionLabel>
            <SectionRule />
            <AchievementsSection items={achievements} />
          </section>
        )}

        {/* §8 Certifications */}
        {certifications.length > 0 && (
          <section id="section-certs">
            <SectionLabel>Certifications</SectionLabel>
            <SectionRule />
            <CertsList items={certifications} />
          </section>
        )}

        {/* §9 Testimonials — conditionally shown via CMS toggle */}
        {settings.show_testimonials && testimonials.length > 0 && (
          <section id="section-testimonials">
            <SectionLabel>Testimonials</SectionLabel>
            <SectionRule />
            <TestimonialsSection items={testimonials} />
          </section>
        )}

        {/* §10 Contact */}
        <section id="section-contact">
          <SectionLabel>Contact</SectionLabel>
          <SectionRule />
          <ContactSection />
        </section>
      </div>

      <MinimalFooter links={footerLinks} />
    </main>
  );
}
