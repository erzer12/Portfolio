'use client';

import React, { useRef } from 'react';
import { useProjects, Project } from '@/hooks/use-data';
import { ArrowUpRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import TiltContainer from '@/components/cinematic/TiltContainer';

export default function ProjectShowcase() {
    const { projects, loading } = useProjects();

    if (loading) {
        return (
            <section className="h-screen flex items-center justify-center bg-neutral-900">
                <div className="animate-pulse text-2xl font-playfair text-white">Loading Works...</div>
            </section>
        );
    }

    return <ProjectShowcaseContent projects={projects} />;
}

function ProjectShowcaseContent({ projects }: { projects: Project[] }) {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-55%"]);

    return (
        <section id="work" ref={targetRef} className="relative border-t border-white/5">
            {/* Desktop View: Sticky Horizontal Scroll */}
            <div className="hidden md:block h-[400vh]">
                <div className="sticky top-[26vh] flex h-[48vh] items-center overflow-hidden bg-neutral-900 rounded-2xl mx-8">
                    <motion.div style={{ x }} className="flex gap-8 px-12">
                        <TitleCard />
                        {projects.slice(0, 4).map((project, i) => (
                            <ProjectCard key={project.id} project={project} index={i} />
                        ))}
                        <ViewAllCard />
                    </motion.div>
                </div>
            </div>

            {/* Mobile View: Vertical Stack */}
            {/* Mobile View: Vertical Stack -> Horizontal Scroll */}
            <div className="md:hidden flex flex-col py-12 mx-4 bg-neutral-900 rounded-2xl">
                <div className="px-4 mb-6">
                    <h2 className="text-3xl font-playfair text-white mb-3">
                        Selected <br /> <span className="italic text-white/50">Works</span>
                    </h2>
                    <p className="text-muted-foreground font-inter text-xs">
                        A collection of digital experiences, applications, and experiments.
                    </p>
                </div>

                {/* Scroll Container */}
                <div className="flex overflow-x-auto snap-x snap-mandatory px-4 gap-3 pb-6 scrollbar-hide">
                    {projects.slice(0, 4).map((project, i) => (
                        <ProjectCardMobile key={project.id} project={project} index={i} />
                    ))}
                    <ViewAllCardMobile />
                    {/* Spacer for right padding */}
                    <div className="w-4 flex-shrink-0" />
                </div>
            </div>
        </section>
    );
}

function TitleCard() {
    return (
        <div className="flex-shrink-0 w-[30vw] md:w-[22vw] flex flex-col justify-center">
            <h2 className="text-4xl md:text-6xl font-playfair text-white mb-4">
                Selected <br /> <span className="italic text-white/50">Works</span>
            </h2>
            <p className="text-muted-foreground font-inter max-w-xs text-xs">
                A collection of digital experiences and applications.
            </p>
            <div className="mt-6 flex items-center gap-3">
                <span className="text-[10px] font-inter tracking-widest uppercase opacity-50">Scroll to Explore</span>
                <div className="w-8 h-px bg-white/20" />
            </div>
        </div>
    )
}

function ViewAllCard() {
    return (
        <div className="h-[40vh] w-[30vw] md:w-[18vw] flex-shrink-0">
            <TiltContainer className="h-full w-full" rotationIntensity={5} scale={1.05}>
                <div className="group relative h-full w-full bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-colors flex items-center justify-center">
                    <a href="/projects" className="flex flex-col items-center gap-2 group-hover:scale-110 transition-transform duration-500">
                        <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                            <ArrowUpRight size={22} />
                        </div>
                        <span className="text-lg font-playfair italic text-white">View All</span>
                    </a>
                </div>
            </TiltContainer>
        </div>
    )
}

function ViewAllCardMobile() {
    return (
        <div className="h-[280px] w-[65vw] flex-shrink-0 snap-center">
            <div className="group relative h-full w-full bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-colors flex items-center justify-center">
                <a href="/projects" className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-white text-black">
                        <ArrowUpRight size={18} />
                    </div>
                    <span className="text-base font-playfair italic text-white">View All</span>
                </a>
            </div>
        </div>
    )
}

function ProjectCard({ project, index }: { project: Project, index: number }) {
    return (
        <div className="h-[40vh] w-[50vw] md:w-[28vw] flex-shrink-0">
            <TiltContainer className="h-full w-full" rotationIntensity={3} scale={1.02}>
                <div className="group relative h-full w-full bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/30 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90 z-10" />
                    <div className="absolute inset-0 bg-neutral-800 group-hover:scale-105 transition-transform duration-700">
                        {project.image ? (
                            <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity duration-700"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-8xl font-playfair text-white/5 italic select-none">
                                {index + 1}
                            </div>
                        )}
                    </div>

                    <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 z-20 flex flex-col justify-end h-full">
                        <div className="transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-xs font-inter tracking-widest uppercase opacity-50">0{index + 1}</span>
                                <div className="h-px w-6 bg-white/20" />
                                <div className="flex gap-1.5 flex-wrap">
                                    {project.tags.slice(0, 3).map(tag => (
                                        <span key={tag} className="text-[10px] font-inter tracking-wider uppercase border border-white/10 px-1.5 py-0.5 rounded-full">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <h3 className="text-2xl md:text-4xl font-playfair italic mb-2 text-white leading-tight">
                                {project.title}
                            </h3>

                            <p className="text-muted-foreground font-inter text-sm max-w-md mb-4 line-clamp-2 group-hover:line-clamp-none transition-all">
                                {project.description}
                            </p>

                            <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                <a
                                    href={project.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-xs uppercase tracking-widest hover:text-white transition-colors"
                                >
                                    GitHub <ArrowUpRight size={14} />
                                </a>
                                {project.live && project.live !== '#' && (
                                    <a
                                        href={project.live}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 text-xs uppercase tracking-widest hover:text-white transition-colors"
                                    >
                                        Live Demo <ArrowUpRight size={14} />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </TiltContainer>
        </div>
    );
}

function ProjectCardMobile({ project, index }: { project: Project, index: number }) {
    return (
        <div className="w-[65vw] flex-shrink-0 snap-center">
            <div className="group relative h-[280px] w-full bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                {/* Image or Placeholder */}
                <div className="absolute inset-0 bg-neutral-800">
                    {project.image ? (
                        <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover opacity-60"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl font-playfair text-white/5 italic select-none">
                            {index + 1}
                        </div>
                    )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black z-10" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 w-full p-6 z-20 flex flex-col justify-end h-full">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-inter tracking-widest uppercase opacity-50">0{index + 1}</span>
                        <div className="h-px w-6 bg-white/20" />
                    </div>

                    <h3 className="text-2xl font-playfair italic mb-1.5 text-white leading-tight">
                        {project.title}
                    </h3>

                    <p className="text-muted-foreground font-inter text-xs mb-4 line-clamp-2">
                        {project.description}
                    </p>

                    <div className="flex gap-4">
                        <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs uppercase tracking-widest hover:text-white transition-colors">
                            GitHub <ArrowUpRight size={12} />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
