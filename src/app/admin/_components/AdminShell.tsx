'use client';

import { useState } from 'react';
import { ProfileTab } from './ProfileTab';
import { ProjectsTab } from './ProjectsTab';
import { SkillsTab } from './SkillsTab';
import { ExperienceTab } from './ExperienceTab';
import { EducationTab } from './EducationTab';
import { CertificationsTab } from './CertificationsTab';
import { AchievementsTab } from './AchievementsTab';
import { TestimonialsTab } from './TestimonialsTab';
import { FooterLinksTab } from './FooterLinksTab';
import type {
  Profile,
  Project,
  Skill,
  Experience,
  Education,
  Certification,
  Achievement,
  Testimonial,
  SiteSettings,
  FooterLink,
} from '@/types';

const TABS = [
  'Profile',
  'Projects',
  'Skills',
  'Experience',
  'Education',
  'Certifications',
  'Achievements',
  'Testimonials',
  'Footer Links',
] as const;

type Tab = (typeof TABS)[number];

type Props = {
  profile: Profile | null;
  projects: Project[];
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  achievements: Achievement[];
  testimonials: Testimonial[];
  settings: SiteSettings;
  footerLinks: FooterLink[];
};

export function AdminShell({
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
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('Profile');

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[--ink-muted]">CMS</p>
        <h1 className="mt-1 font-serif text-3xl italic text-[--ink]">Content Manager</h1>
      </div>

      {/* Tab navigation */}
      <div className="overflow-x-auto">
        <div className="flex min-w-max gap-1 border-b border-[--rule] pb-0">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 pb-2 font-mono text-xs uppercase tracking-[0.12em] transition-colors ${
                activeTab === tab
                  ? 'border-b-2 border-[--ink] text-[--ink]'
                  : 'text-[--ink-muted] hover:text-[--ink]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="min-h-[400px]">
        {activeTab === 'Profile' && <ProfileTab profile={profile} />}
        {activeTab === 'Projects' && <ProjectsTab projects={projects} />}
        {activeTab === 'Skills' && <SkillsTab skills={skills} />}
        {activeTab === 'Experience' && <ExperienceTab experience={experience} />}
        {activeTab === 'Education' && <EducationTab education={education} />}
        {activeTab === 'Certifications' && <CertificationsTab certifications={certifications} />}
        {activeTab === 'Achievements' && <AchievementsTab achievements={achievements} />}
        {activeTab === 'Testimonials' && (
          <TestimonialsTab testimonials={testimonials} settings={settings} />
        )}
        {activeTab === 'Footer Links' && <FooterLinksTab links={footerLinks} />}
      </div>
    </div>
  );
}
