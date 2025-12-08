'use client';

import React from 'react';
import InteractivePortrait from './InteractivePortrait';
import TextReveal from './TextReveal';
import { useProfile } from '@/hooks/use-data';

export default function AboutSection() {
    const { profile, loading } = useProfile();

    if (!profile) return null; // Should not happen with static init

    // Helper to get array of socials for mapping
    const socialLinks = [
        { name: 'GitHub', url: profile.social.github },
        { name: 'LinkedIn', url: profile.social.linkedin },
        { name: 'Website', url: profile.social.website },
        { name: 'Email', url: profile.social.email },
    ].filter(s => s.url);

    return (
        <section className="min-h-[80vh] flex flex-col md:flex-row items-center justify-center px-8 md:px-20 pt-32 pb-12 gap-12 md:gap-20">
            {/* Left: Portrait */}
            <div className="w-full md:w-5/12 aspect-[3/4] md:aspect-auto md:h-[60vh] relative order-2 md:order-1">
                <InteractivePortrait />
            </div>

            {/* Right: Content */}
            <div className="w-full md:w-7/12 space-y-8 order-1 md:order-2 z-10 mix-blend-difference text-white">
                <div>
                    <TextReveal delay={0.1}>
                        <p className="text-xs font-inter tracking-[0.2em] uppercase mb-4 opacity-70">About Me</p>
                    </TextReveal>
                    <TextReveal delay={0.2}>
                        <h1 className="text-5xl md:text-7xl font-playfair font-bold leading-[0.9] mb-6">
                            {profile.name.split(' ')[0]} <span className="italic font-light">{profile.name.split(' ')[1]}</span>
                        </h1>
                    </TextReveal>
                    <TextReveal delay={0.3}>
                        <h2 className="text-xl md:text-2xl font-playfair italic opacity-80 mb-6">
                            {profile.tagline}
                        </h2>
                    </TextReveal>
                </div>

                <TextReveal delay={0.4}>
                    <p className="text-base md:text-lg font-inter leading-relaxed opacity-70 max-w-xl text-justify">
                        {profile.summary}
                    </p>
                </TextReveal>

                <TextReveal delay={0.5}>
                    <div className="flex gap-6 pt-4">
                        {socialLinks.map(social => (
                            <a
                                key={social.name}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-inter tracking-widest uppercase hover:opacity-50 transition-opacity flex items-center gap-2 border-b border-transparent hover:border-white pb-1"
                            >
                                {social.name}
                            </a>
                        ))}
                    </div>
                </TextReveal>
            </div>
        </section>
    );
}
