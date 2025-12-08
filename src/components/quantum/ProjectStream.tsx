'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight } from 'lucide-react';

interface Project {
    id: string;
    title: string;
    description: string;
    image: string;
    tags: string[];
    github: string;
    live: string;
}

export default function ProjectStream({ projects }: { projects: Project[] }) {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    const x = useTransform(scrollYProgress, [0, 1], ["1%", "-75%"]);

    return (
        <section ref={targetRef} className="relative h-[300vh] bg-background">
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">

                {/* Section Title */}
                <div className="absolute top-10 left-10 z-20">
                    <h2 className="text-4xl font-orbitron text-white/20">PROJECT_STREAM</h2>
                </div>

                <motion.div style={{ x }} className="flex gap-16 px-24">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="group relative h-[60vh] w-[40vw] min-w-[500px] overflow-hidden bg-black/40 border border-white/10 backdrop-blur-md hover:border-primary/50 transition-colors duration-500"
                        >
                            {/* Image Area */}
                            <div className="relative h-3/5 w-full overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                />
                            </div>

                            {/* Content Area */}
                            <div className="relative z-20 p-8 h-2/5 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-3xl font-orbitron font-bold text-white group-hover:text-primary transition-colors">
                                            {project.title}
                                        </h3>
                                        <a href={project.github} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-full hover:bg-primary hover:text-black transition-all">
                                            <ArrowUpRight size={24} />
                                        </a>
                                    </div>
                                    <p className="text-muted-foreground font-rajdhani text-lg line-clamp-2">
                                        {project.description}
                                    </p>
                                </div>

                                <div className="flex gap-2 flex-wrap">
                                    {project.tags.map(tag => (
                                        <Badge key={tag} variant="outline" className="border-primary/30 text-primary/80 font-rajdhani">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Decorative Corner */}
                            <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
