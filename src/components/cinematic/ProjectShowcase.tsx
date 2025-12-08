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

    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

    return (
        <section id="work" ref={targetRef} className="relative bg-neutral-900 border-t border-white/5">
            {/* Desktop View: Sticky Horizontal Scroll */}
            <div className="hidden md:block h-[300vh]">
                <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                    <motion.div style={{ x }} className="flex gap-20 px-20">
                        <TitleCard />
                        {projects.slice(0, 4).map((project, i) => (
                            <ProjectCard key={project.id} project={project} index={i} />
                        ))}
                        <ViewAllCard />
                    </motion.div>
                </div>
            </div>

            {/* Mobile View: Vertical Stack */}
            <div className="md:hidden flex flex-col gap-12 px-4 py-20">
                <div className="mb-8">
                    <h2 className="text-4xl font-playfair text-white mb-4">
                        Selected <br /> <span className="italic text-white/50">Works</span>
                    </h2>
                    <p className="text-muted-foreground font-inter text-sm">
                        A collection of digital experiences, applications, and experiments.
                    </p>
                </div>

                {projects.slice(0, 4).map((project, i) => (
                    <ProjectCardMobile key={project.id} project={project} index={i} />
                ))}

                <ViewAllCardMobile />
            </div>
        </section>
    );
}

function TitleCard() {
    return (
        <div className="flex-shrink-0 w-[40vw] md:w-[30vw] flex flex-col justify-center">
            <h2 className="text-6xl md:text-8xl font-playfair text-white mb-8">
                Selected <br /> <span className="italic text-white/50">Works</span>
            </h2>
            <p className="text-muted-foreground font-inter max-w-md">
                A collection of digital experiences, applications, and experiments.
            </p>
            <div className="mt-12 flex items-center gap-4">
                <span className="text-sm font-inter tracking-widest uppercase opacity-50">Scroll to Explore</span>
                <div className="w-12 h-px bg-white/20" />
            </div>
        </div>
    )
}

function ViewAllCard() {
    return (
        <div className="h-[70vh] w-[40vw] md:w-[30vw] flex-shrink-0">
            <TiltContainer className="h-full w-full" rotationIntensity={5} scale={1.05}>
                <div className="group relative h-full w-full bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-colors flex items-center justify-center">
                    <a href="/projects" className="flex flex-col items-center gap-4 group-hover:scale-110 transition-transform duration-500">
                        <div className="w-20 h-20 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                            <ArrowUpRight size={32} />
                        </div>
                        <span className="text-2xl font-playfair italic text-white">View All Projects</span>
                    </a>
                </div>
            </TiltContainer>
        </div>
    )
}

function ViewAllCardMobile() {
    return (
        <div className="h-[200px] w-full">
            <div className="group relative h-full w-full bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-colors flex items-center justify-center">
                <a href="/projects" className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center bg-white text-black">
                        <ArrowUpRight size={24} />
                    </div>
                    <span className="text-xl font-playfair italic text-white">View All Projects</span>
                </a>
            </div>
        </div>
    )
}

function ProjectCard({ project, index }: { project: Project, index: number }) {
    return (
        <div className="h-[70vh] w-[80vw] md:w-[50vw] flex-shrink-0">
            <TiltContainer className="h-full w-full" rotationIntensity={3} scale={1.02}>
                <div className="group relative h-full w-full bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-white/30 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90 z-10" />
                    <div className="absolute inset-0 bg-neutral-800 group-hover:scale-105 transition-transform duration-700">
                        {project.image ? (
                            <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity duration-700"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-9xl font-playfair text-white/5 italic select-none">
                                {index + 1}
                            </div>
                        )}
                    </div>

                    <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-20 flex flex-col justify-end h-full">
                        <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                            <div className="flex items-center gap-4 mb-4">
                                <span className="text-xs font-inter tracking-widest uppercase opacity-50">0{index + 1}</span>
                                <div className="h-px w-8 bg-white/20" />
                                <div className="flex gap-2">
                                    {project.tags.slice(0, 3).map(tag => (
                                        <span key={tag} className="text-xs font-inter tracking-wider uppercase border border-white/10 px-2 py-1 rounded-full">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <h3 className="text-4xl md:text-6xl font-playfair italic mb-4 text-white leading-tight">
                                {project.title}
                            </h3>

                            <p className="text-muted-foreground font-inter max-w-lg mb-8 line-clamp-3 group-hover:line-clamp-none transition-all">
                                {project.description}
                            </p>

                            <div className="flex gap-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                <a
                                    href={project.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm uppercase tracking-widest hover:text-white transition-colors"
                                >
                                    GitHub <ArrowUpRight size={16} />
                                </a>
                                {project.live && project.live !== '#' && (
                                    <a
                                        href={project.live}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-sm uppercase tracking-widest hover:text-white transition-colors"
                                    >
                                        Live Demo <ArrowUpRight size={16} />
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
        <div className="w-full md:w-[50vw] flex-shrink-0">
            <div className="group relative h-[400px] w-full bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
                {/* Image or Placeholder */}
                <div className="absolute inset-0 bg-neutral-800">
                    {project.image ? (
                        <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover opacity-60"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl font-playfair text-white/5 italic select-none">
                            {index + 1}
                        </div>
                    )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black z-10" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 w-full p-8 z-20 flex flex-col justify-end h-full">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-xs font-inter tracking-widest uppercase opacity-50">0{index + 1}</span>
                        <div className="h-px w-8 bg-white/20" />
                    </div>

                    <h3 className="text-3xl font-playfair italic mb-2 text-white leading-tight">
                        {project.title}
                    </h3>

                    <p className="text-muted-foreground font-inter text-sm mb-6 line-clamp-2">
                        {project.description}
                    </p>

                    <div className="flex gap-6">
                        <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs uppercase tracking-widest hover:text-white transition-colors">
                            GitHub <ArrowUpRight size={14} />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
