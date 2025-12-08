'use client';

import dynamic from 'next/dynamic';
import QuantumHero from '@/components/quantum/QuantumHero';
import BentoSection from '@/components/bento/BentoSection';
import MinimalNav from '@/components/cinematic/MinimalNav';
import SmoothScroll from '@/components/cinematic/SmoothScroll';
import PageLoader from '@/components/cinematic/PageLoader';
import MinimalFooter from '@/components/cinematic/MinimalFooter';


// Dynamic Imports for performance
const ExperienceTimeline = dynamic(() => import('@/components/cinematic/ExperienceTimeline'));
const SkillsConstellation = dynamic(() => import('@/components/quantum/SkillsConstellation'), { ssr: false });
const Certifications = dynamic(() => import('@/components/cinematic/Certifications'));
const ProjectShowcase = dynamic(() => import('@/components/cinematic/ProjectShowcase'));
const ContactSection = dynamic(() => import('@/components/cinematic/ContactSection'));
const Testimonials = dynamic(() => import('@/components/cinematic/Testimonials'));
import { useProfile } from '@/hooks/use-data';
import { Github, Linkedin, Mail } from 'lucide-react';

function DynamicSocialLinks() {
  const { profile } = useProfile();
  if (!profile || !profile.social) return null;
  return (
    <>
      {profile.social.github && (
        <a href={profile.social.github} target="_blank" rel="noreferrer" className="hover:opacity-50 transition-opacity flex items-center gap-2">
          <Github size={16} /> GitHub
        </a>
      )}
      {profile.social.linkedin && (
        <a href={profile.social.linkedin} target="_blank" rel="noreferrer" className="hover:opacity-50 transition-opacity flex items-center gap-2">
          <Linkedin size={16} /> LinkedIn
        </a>
      )}

      {profile.social.email && (
        <a href={`mailto:${profile.social.email}`} className="hover:opacity-50 transition-opacity flex items-center gap-2">
          <Mail size={16} /> Email
        </a>
      )}
    </>
  );
}

export default function Home() {
  return (
    <PageLoader>
      <SmoothScroll>
        <main className="min-h-screen bg-background text-foreground selection:bg-white selection:text-black">
          <MinimalNav />

          <QuantumHero />
          <BentoSection />

          {/* Selected Works */}
          <ProjectShowcase />

          <ExperienceTimeline />
          <SkillsConstellation />
          <Certifications />
          <Testimonials />

          {/* Footer / Contact */}
          <section id="contact" className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-20">
            <p className="text-sm font-inter tracking-[0.2em] uppercase mb-8 opacity-50">Get in Touch</p>
            <h2 className="text-5xl md:text-8xl font-playfair mb-12">
              Let's Talk.
            </h2>

            <ContactSection />

            <div className="mt-20 flex gap-8 text-sm font-inter tracking-widest uppercase items-center justify-center">
              <DynamicSocialLinks />
            </div>
          </section>

          <MinimalFooter />

        </main>
      </SmoothScroll>
    </PageLoader>
  );
}
