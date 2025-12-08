'use client';

import React from 'react';
import { useSkills } from '@/hooks/use-data';

export default function Skills() {
  const { skills, loading } = useSkills();

  if (loading) {
    return (
      <section id="skills" className="px-8 md:px-20 py-20 border-t border-white/5">
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-white/5 rounded" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="px-8 md:px-20 py-20 border-t border-white/5">
      <div className="flex items-end justify-between mb-16">
        <h2 className="text-4xl md:text-6xl font-playfair">Technical Arsenal</h2>
        <span className="text-sm font-inter tracking-widest uppercase opacity-50">Capabilities</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {skills.map((skill) => (
          <div key={skill.id}>
            <h3 className="text-lg font-playfair italic mb-6 capitalize border-b border-white/10 pb-2 flex items-center gap-2">
              {/* Icon could be rendered here if we map the string to a component, for now just title */}
              {skill.title}
            </h3>
            <div className="flex flex-wrap gap-3">
              {skill.skills.map((item) => (
                <span key={item} className="px-4 py-2 border border-white/10 rounded-full text-xs font-inter tracking-wider uppercase hover:bg-white hover:text-black transition-colors cursor-default">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
