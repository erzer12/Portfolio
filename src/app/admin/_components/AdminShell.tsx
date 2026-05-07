'use client';

import { useState } from 'react';
import { ProfileTab } from './ProfileTab';
import { ProjectsTab } from './ProjectsTab';
import { SkillsTab } from './SkillsTab';
import { ExperienceTab } from './ExperienceTab';
import { EducationTab } from './EducationTab';
import { CertificationsTab } from './CertificationsTab';
import { TestimonialsTab } from './TestimonialsTab';
import type {
  Profile,
  Project,
  Skill,
  Experience,
  Education,
  Certification,
  Testimonial,
  SiteSettings,
} from '@/types';

const TABS = [
  'Profile',
  'Projects',
  'Skills',
  'Experience',
  'Education',
  'Certifications',
  'Testimonials',
] as const;

type Tab = (typeof TABS)[number];

type Props = {
  profile: Profile | null;
  projects: Project[];
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  testimonials: Testimonial[];
  settings: SiteSettings;
};

export function AdminShell({
  profile,
  projects,
  skills,
  experience,
  education,
  certifications,
  testimonials,
  settings,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('Profile');

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#6B6B66]">CMS</p>
        <h1 className="mt-1 font-serif text-3xl italic text-[#1A1A18]">Content Manager</h1>
      </div>

      {/* Tab navigation */}
      <div className="overflow-x-auto">
        <div className="flex min-w-max gap-1 border-b border-[#E4E4DF] pb-0">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 pb-2 font-mono text-xs uppercase tracking-[0.12em] transition-colors ${
                activeTab === tab
                  ? 'border-b-2 border-[#1A1A18] text-[#1A1A18]'
                  : 'text-[#6B6B66] hover:text-[#1A1A18]'
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
        {activeTab === 'Testimonials' && (
          <TestimonialsTab testimonials={testimonials} settings={settings} />
        )}
      </div>
    </div>
  );
}
