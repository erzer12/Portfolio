'use client';

import React from 'react';
import { useEducation } from '@/hooks/use-data';

export default function Education() {
    const { education, loading } = useEducation();

    if (loading) return null;

    return (
        <section id="education" className="px-8 md:px-20 py-12 border-t border-white/5">
            <div className="flex items-end justify-between mb-16">
                <h2 className="text-4xl md:text-6xl font-playfair">Education</h2>
                <span className="text-sm font-inter tracking-widest uppercase opacity-50">Academic Path</span>
            </div>

            <div className="space-y-12">
                {education.map((edu, index) => (
                    <div key={edu.id || index} className="group flex flex-col md:flex-row md:items-center justify-between gap-4 py-8 border-b border-white/5 hover:border-white/20 transition-colors">
                        <div>
                            <h3 className="text-2xl font-playfair italic mb-2">{edu.school}</h3>
                            <p className="text-muted-foreground font-inter">{edu.degree}</p>
                        </div>
                        <div className="text-right md:text-left">
                            <p className="text-xl font-inter font-light">{edu.year}</p>
                            {/* Static data had grade, but new schema uses description. Display description if present. */}
                            {edu.description && <p className="text-sm text-muted-foreground font-inter mt-1 opacity-70">{edu.description}</p>}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
