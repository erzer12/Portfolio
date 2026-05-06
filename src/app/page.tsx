import { CertsList } from '@/components/resume/CertsList';
import { ContactSection } from '@/components/resume/ContactSection';
import { EducationList } from '@/components/resume/EducationList';
import { ExperienceList } from '@/components/resume/ExperienceList';
import { FeaturedProjects } from '@/components/resume/FeaturedProjects';
import { Header } from '@/components/resume/Header';
import { MinimalFooter } from '@/components/layout/MinimalFooter';
import { MinimalNav } from '@/components/layout/MinimalNav';
import { ProfileSummary } from '@/components/resume/ProfileSummary';
import { SectionLabel } from '@/components/resume/SectionLabel';
import { SectionRule } from '@/components/resume/SectionRule';
import { SkillsTable } from '@/components/resume/SkillsTable';

const profile = {
  name: 'Harshil P',
  tagline: 'Third-year CS student focused on AI, ML, and practical product work.',
  location: 'Kerala, India',
  status: 'Open to work',
  socialLinks: [
    { label: 'GitHub', href: 'https://github.com/erzer12' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/harshil-p' },
    { label: 'Email', href: 'mailto:harshilp1234@gmail.com' },
  ],
};

const summary =
  'I build lightweight products that make technical ideas easy to understand and easy to use. My focus is on AI-assisted workflows, clean interfaces, and shipping useful tools that help people work faster.';

const skills = [
  { category: 'Languages', skills: ['Python', 'JavaScript', 'TypeScript'] },
  { category: 'Frontend', skills: ['React', 'Next.js'] },
  { category: 'Backend', skills: ['Flask', 'Supabase'] },
  { category: 'AI / ML', skills: ['OpenAI', 'Prompting'] },
  { category: 'Tools', skills: ['Git', 'Figma'] },
];

const experience = [
  {
    company: 'Company Name',
    role: 'Software Engineer Intern',
    dateRange: 'Jan 2025 – Present',
    bullets: ['Built internal tooling that reduced repetitive work for the team.', 'Shipped production UI improvements with measurable speedups.'],
    tags: ['React', 'TypeScript', 'APIs'],
  },
];

const projects = [
  {
    name: 'NewsHunt',
    year: '2025',
    description: 'A focused news automation project that collects and surfaces relevant updates quickly.',
    tags: ['Python', 'MongoDB', 'Flask'],
    href: '/projects',
  },
  {
    name: 'HR Agent',
    year: '2025',
    description: 'An assistant workflow for screening and organizing hiring tasks with less friction.',
    tags: ['Python', 'GPT', 'Flask'],
    href: '/projects',
  },
  {
    name: 'Portfolio Rebuild',
    year: '2026',
    description: 'This new structure-first portfolio implementation is the base for the full redesign.',
    tags: ['Next.js', 'Design System', 'Supabase'],
    href: '/projects',
  },
];

const education = [
  {
    school: 'College of Engineering',
    year: '2027',
    degree: 'B.Tech Computer Science (AI & ML) · 7.91 CGPA',
  },
  {
    school: "Bhavan's Vidya Mandir",
    year: '2023',
    degree: 'Class 12 · 90.4%',
  },
];

const certs = [
  { name: 'AWS ML Foundations', issuer: 'Amazon' },
  { name: 'AI Fundamentals', issuer: 'IBM' },
  { name: 'Python MOOC', issuer: 'University of Helsinki' },
  { name: 'Next.js Essentials', issuer: 'Self-directed' },
];

export default function Home() {
  return (
    <main className="mx-auto min-h-screen max-w-[760px] px-4 py-6 text-sm text-neutral-900">
      <MinimalNav name="HP." email="harshilp1234@gmail.com" github="https://github.com/erzer12" />

      <div className="space-y-12 py-10">
        <Header {...profile} />

        <section>
          <SectionLabel>Profile Summary</SectionLabel>
          <SectionRule />
          <ProfileSummary summary={summary} />
        </section>

        <section>
          <SectionLabel>Skills</SectionLabel>
          <SectionRule />
          <SkillsTable items={skills} />
        </section>

        <section>
          <SectionLabel>Experience</SectionLabel>
          <SectionRule />
          <ExperienceList items={experience} />
        </section>

        <section>
          <SectionLabel>Projects</SectionLabel>
          <SectionRule />
          <FeaturedProjects items={projects} viewAllHref="/projects" />
        </section>

        <section>
          <SectionLabel>Education</SectionLabel>
          <SectionRule />
          <EducationList items={education} />
        </section>

        <section>
          <SectionLabel>Certifications</SectionLabel>
          <SectionRule />
          <CertsList items={certs} />
        </section>

        <section>
          <SectionLabel>Contact</SectionLabel>
          <SectionRule />
          <ContactSection
            email="harshilp1234@gmail.com"
            github="https://github.com/erzer12"
            linkedin="https://www.linkedin.com/in/harshil-p"
          />
        </section>
      </div>

      <MinimalFooter />
    </main>
  );
}
