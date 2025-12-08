'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useExperience } from '@/hooks/use-data';
import TiltContainer from '@/components/cinematic/TiltContainer';
import { Briefcase, Calendar } from 'lucide-react';

export default function ExperienceTimeline() {
    const { experience } = useExperience();

    return (
        <section className="min-h-screen w-full bg-black relative py-20 px-4 md:px-10 flex flex-col justify-center">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.05),rgba(0,0,0,0))]" />

            <div className="max-w-4xl mx-auto w-full z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-16 text-center"
                >
                    <h2 className="text-4xl md:text-6xl font-playfair text-white mb-4">The Journey</h2>
                    <p className="text-white/50 font-inter text-lg">My professional path and achievements.</p>
                </motion.div>

                <div className="flex flex-col gap-12">
                    {/* Work Experience Section */}
                    <div className="space-y-8">
                        <div className="flex items-center justify-center gap-3 mb-8">
                            <div className="p-3 bg-white/10 rounded-xl text-white backdrop-blur-md border border-white/10">
                                <Briefcase size={28} />
                            </div>
                            <h3 className="text-3xl font-playfair text-white">Work Experience</h3>
                        </div>

                        <div className="grid grid-cols-1 gap-8 relative">
                            {/* Vertical Line */}
                            <div className="absolute left-0 md:left-1/2 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent hidden md:block transform -translate-x-1/2" />

                            {experience.map((job, i) => (
                                <TimelineCard
                                    key={job.id}
                                    title={job.company}
                                    subtitle={job.role}
                                    date={job.start + (job.end ? " - " + job.end : "")}
                                    description={job.description}
                                    index={i}
                                    align={i % 2 === 0 ? 'left' : 'right'}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function TimelineCard({ title, subtitle, date, description, index, align }:
    { title: string, subtitle: string, date: string, description?: string, index: number, align: 'left' | 'right' }) {

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`flex flex-col md:flex-row items-center gap-8 ${align === 'left' ? 'md:flex-row-reverse' : ''}`}
        >
            {/* The Dot on the Line */}
            <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center justify-center w-4 h-4 rounded-full bg-black border-2 border-white/30 z-20 group-hover:border-white transition-colors" />

            {/* Empty Space for the other side */}
            <div className="hidden md:block w-1/2" />

            {/* The Card */}
            <div className="w-full md:w-1/2">
                <TiltContainer className="w-full" rotationIntensity={2} scale={1.01}>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/10 transition-colors group relative overflow-hidden h-full">
                        {/* Glow Effect */}
                        <div className="absolute -inset-px bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="text-xl font-bold text-white font-playfair">{title}</h4>
                                <div className="flex items-center gap-2 text-white/40 text-xs font-inter uppercase tracking-wider bg-white/5 px-2 py-1 rounded">
                                    <Calendar size={12} />
                                    {date}
                                </div>
                            </div>
                            <h5 className="text-lg text-primary/90 mb-4 font-medium">{subtitle}</h5>
                            {description && (
                                <p className="text-white/60 text-sm leading-relaxed font-inter">
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>
                </TiltContainer>
            </div>
        </motion.div>
    );
}
