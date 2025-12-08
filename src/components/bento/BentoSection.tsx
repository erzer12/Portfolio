// src/components/bento/BentoSection.tsx
'use client';

import React from 'react';
import NextImage from 'next/image';
import BentoGrid from './BentoGrid';
import BentoCard from './BentoCard';
import { Github, Linkedin, MapPin, FileText, Globe, Mail } from 'lucide-react';
import { useProfile } from '@/hooks/use-data';
import { RESUME_DATA } from '@/data/resume';

export default function BentoSection() {
    const { profile } = useProfile();

    // Fallback to static data if profile not fully loaded yet (optional, or just show loading state)
    // For now, we mix them: preference to DB data
    const summary = profile?.summary || RESUME_DATA.summary;
    const location = profile?.location || RESUME_DATA.location;
    const socialGitHub = profile?.social?.github || RESUME_DATA.contact.social[0].url;
    const socialLinkedIn = profile?.social?.linkedin || RESUME_DATA.contact.social[1].url;

    return (
        <section className="py-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto mb-12">
                <h2 className="text-4xl md:text-6xl font-playfair mb-4">About Me</h2>
                <p className="text-muted-foreground font-inter max-w-2xl">
                    A glimpse into my world, my stack, and what drives me.
                </p>
            </div>

            <BentoGrid className="grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[minmax(180px,auto)]">
                {/* Row 1: About Me (Full Width) */}
                <BentoCard colSpan={3} rowSpan={2} title="About" className="bg-gradient-to-br from-neutral-900 to-black overflow-hidden group min-h-[300px]">
                    <div className="h-full flex flex-col relative z-10 p-4 md:p-0"> {/* Added padding handling */}
                        <div className="flex-1">
                            <p className="text-lg text-gray-300 leading-relaxed font-inter max-w-3xl">
                                {summary}
                            </p>
                        </div>

                        <div className="mt-auto pt-8 flex gap-6">
                            <div className="flex items-center gap-2 text-sm text-white/50">
                                <MapPin size={16} />
                                <span>{location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-green-400">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                <span>Open to Work</span>
                            </div>
                        </div>
                    </div>
                    {/* Background Gradient Blob */}
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-500" />
                </BentoCard>

                {/* Row 2: Socials & Resume */}
                <BentoCard title="LinkedIn" href={socialLinkedIn} target="_blank" rel="noopener noreferrer" className="bg-[#0077b5]/10 hover:bg-[#0077b5]/20 min-h-[180px]">
                    <div className="h-full flex items-center justify-center">
                        <Linkedin size={48} className="text-[#0077b5]" />
                    </div>
                </BentoCard>

                <BentoCard title="GitHub" href={socialGitHub} target="_blank" rel="noopener noreferrer" className="bg-white/5 hover:bg-white/10 min-h-[180px]">
                    <div className="h-full flex items-center justify-center">
                        <Github size={48} className="text-white" />
                    </div>
                </BentoCard>

                <BentoCard title="Resume" href={profile?.resume || '/Harshil_P_Resume.pdf'} target="_blank" rel="noopener noreferrer" className="bg-neutral-900/50 hover:bg-neutral-800/50 group min-h-[180px]">
                    <div className="h-full flex flex-col items-center justify-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <FileText size={32} className="text-white/70" />
                        </div>
                        <span className="text-sm font-inter tracking-widest uppercase opacity-50 group-hover:opacity-100 transition-opacity">Download</span>
                    </div>
                </BentoCard>

            </BentoGrid>
        </section>
    );
}
