// src/components/cinematic/WorkExperience.tsx (Refactored)
'use client';

import React from 'react';
import { useExperience } from '@/hooks/use-data';

export default function WorkExperience() {
    const { experience, loading } = useExperience();

    if (loading) {
        return <div className="py-20 text-center text-white/50">Loading Experience...</div>;
    }

    return (
        <section id="experience" className="px-8 md:px-20 py-20 border-t border-white/5">
            <div className="flex items-end justify-between mb-16">
                <h2 className="text-4xl md:text-6xl font-playfair">Experience</h2>
                <span className="text-sm font-inter tracking-widest uppercase opacity-50">Career History</span>
            </div>

            <div className="space-y-16">
                {experience.map((job, index) => (
                    <div key={job.id || index} className="flex flex-col md:flex-row gap-8 md:gap-20 group">
                        <div className="md:w-1/4">
                            <span className="text-sm font-inter tracking-widest uppercase opacity-50 block mb-2">
                                {job.start} - {job.end}
                            </span>
                            <h3 className="text-xl font-playfair italic">{job.company}</h3>
                        </div>
                        <div className="md:w-3/4 border-l border-white/10 pl-8 md:pl-12 relative">
                            <div className="absolute top-0 left-0 w-1 h-0 bg-white group-hover:h-full transition-all duration-700 ease-in-out" />
                            <h4 className="text-2xl font-playfair mb-4">{job.role}</h4>
                            <p className="text-muted-foreground font-inter leading-relaxed max-w-2xl">
                                {job.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
