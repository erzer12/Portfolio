'use client';

import React from 'react';
import { useProjects } from '@/hooks/use-data';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import TiltContainer from '@/components/cinematic/TiltContainer';

export default function ProjectsPage() {
    const { projects, loading } = useProjects();

    return (
        <main className="min-h-screen bg-neutral-900 text-white">
            {/* Header */}
            <header className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center bg-neutral-900/50 backdrop-blur-md border-b border-white/5">
                <Link href="/" className="flex items-center gap-2 group text-sm uppercase tracking-widest hover:text-white/80 transition-colors">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>
                <span className="font-playfair italic text-xl">Projects</span>
            </header>

            <div className="pt-32 px-8 md:px-20 pb-20">
                <div className="mb-20">
                    <h1 className="text-5xl md:text-8xl font-playfair mb-6">
                        All <span className="italic text-white/50">Works</span>
                    </h1>
                    <p className="text-muted-foreground font-inter max-w-xl text-lg">
                        A comprehensive archive of my digital creations, experiments, and applications.
                    </p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-[400px] w-full bg-white/5 animate-pulse rounded-3xl" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project, index) => (
                            <ProjectGridCard key={project.id} project={project} index={index} />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

function ProjectGridCard({ project, index }: { project: any, index: number }) {
    return (
        <div className="h-[500px]">
            <TiltContainer className="h-full w-full" rotationIntensity={5} scale={1.02}>
                <div className="group relative h-full w-full bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-white/30 transition-colors flex flex-col">
                    {/* Project Image */}
                    <div className="h-1/2 bg-neutral-800 relative overflow-hidden group-hover:brightness-110 transition-all">
                        {project.image ? (
                            <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-6xl font-playfair text-white/5 italic select-none">
                                {index + 1}
                            </div>
                        )}
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent" />
                    </div>

                    <div className="flex-1 p-8 flex flex-col justify-between bg-neutral-900/50 backdrop-blur-sm">
                        <div>
                            <div className="flex gap-2 flex-wrap mb-4">
                                {project.tags.slice(0, 3).map((tag: string) => (
                                    <span key={tag} className="text-[10px] font-inter tracking-wider uppercase border border-white/10 px-2 py-1 rounded-full">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <h3 className="text-3xl font-playfair italic mb-3 group-hover:translate-x-1 transition-transform">
                                {project.title}
                            </h3>
                            <p className="text-muted-foreground text-sm font-inter line-clamp-3">
                                {project.description}
                            </p>
                        </div>

                        <div className="flex gap-4 mt-6 pt-6 border-t border-white/5">
                            <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-xs uppercase tracking-widest hover:text-white transition-colors"
                            >
                                GitHub <ArrowUpRight size={14} />
                            </a>
                            {project.live && project.live !== '#' && (
                                <a
                                    href={project.live}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-xs uppercase tracking-widest hover:text-white transition-colors"
                                >
                                    Live Demo <ArrowUpRight size={14} />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </TiltContainer>
        </div>
    )
}
