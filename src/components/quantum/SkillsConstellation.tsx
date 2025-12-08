'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSkills } from '@/hooks/use-data';
import * as SimpleIcons from 'simple-icons';

// Mapping helper to find the right icon key
const getSimpleIcon = (name: string) => {
    // Normalize name: remove spaces, dots, lowercase
    const normalized = name.toLowerCase().replace(/[\s\.\-\(\)]/g, '');

    // Explicit mappings for tricky ones
    const map: Record<string, string> = {
        'nextjs': 'siNextdotjs',
        'nodejs': 'siNodedotjs',
        'react': 'siReact',
        'reactnative': 'siReact',
        'c++': 'siCplusplus',
        'c#': 'siCsharp',
        'c': 'siC',
        'golang': 'siGo',
        'expressjs': 'siExpress',
        'postgres': 'siPostgresql',
        'postgresql': 'siPostgresql',
        'mongodb': 'siMongodb',
        'aws': 'siAmazonwebservices',
        'gcp': 'siGooglecloud',
        'azure': 'siMicrosoftazure',
        'docker': 'siDocker',
        'kubernetes': 'siKubernetes',
        'git': 'siGit',
        'github': 'siGithub',
        'html': 'siHtml5',
        'css': 'siCss3',
        'javascript': 'siJavascript',
        'typescript': 'siTypescript',
        'tailwind': 'siTailwindcss',
        'tailwindcss': 'siTailwindcss',
        'prisma': 'siPrisma',
        'framer': 'siFramer',
        'figma': 'siFigma',
        'linux': 'siLinux',
        'ubuntu': 'siUbuntu',
        'vercel': 'siVercel',
        'firebase': 'siFirebase',
        'supabase': 'siSupabase',
        'graphql': 'siGraphql',
        'redux': 'siRedux',
        'threejs': 'siThreedotjs',
        'python': 'siPython',
        'java': 'siJava',
        'kotlin': 'siKotlin',
        'swift': 'siSwift',
        'dart': 'siDart',
        'flutter': 'siFlutter',
        'rust': 'siRust',
        'mysql': 'siMysql',
        'sqlite': 'siSqlite',
        'redis': 'siRedis',
    };

    const key = map[normalized];
    if (key && (SimpleIcons as any)[key]) {
        return (SimpleIcons as any)[key];
    }

    // Fuzzy search / Default attempt
    const directKey = 'si' + normalized.charAt(0).toUpperCase() + normalized.slice(1);
    if ((SimpleIcons as any)[directKey]) {
        return (SimpleIcons as any)[directKey];
    }

    // Fallback? Return null
    return null;
};

export default function SkillsConstellation() {
    const { skills } = useSkills();

    // Flatten and track unique skills
    const tracks = useMemo(() => {
        if (!skills) return [[], [], []];

        const allSkills: { name: string, icon: any }[] = [];

        skills.forEach(cat => {
            if (cat.skills) {
                cat.skills.forEach(skill => {
                    const icon = getSimpleIcon(skill);
                    if (icon) {
                        allSkills.push({ name: skill, icon });
                    }
                });
            }
        });

        // Filter duplicates
        const unique = Array.from(new Map(allSkills.map(item => [item.name, item])).values());

        // Split into 2 tracks
        const track1 = unique.filter((_, i) => i % 2 === 0);
        const track2 = unique.filter((_, i) => i % 2 === 1);

        return [track1, track2];
    }, [skills]);

    return (
        <section className="min-h-[40vh] w-full bg-black relative py-20 flex flex-col justify-center overflow-hidden">
            {/* Simple Glow Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),rgba(0,0,0,0))]" />

            <div className="container mx-auto px-4 mb-16 text-center z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-4xl md:text-6xl font-playfair text-white mb-4">Tech Arsenal</h2>
                    <p className="text-white/50 font-inter text-lg">Powered by industry standards.</p>
                </motion.div>
            </div>

            <div className="flex flex-col gap-12 z-10">
                <MarqueeTrack items={tracks[0]} direction="left" speed={30} />
                <MarqueeTrack items={tracks[1]} direction="right" speed={35} />
            </div>

            {/* Fade Edges */}
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none" />
        </section>
    );
}

function MarqueeTrack({ items, direction, speed }: { items: any[], direction: "left" | "right", speed: number }) {
    if (!items || items.length === 0) return null;

    // Quadruple items for smooth infinite loop without gaps
    const loopItems = [...items, ...items, ...items, ...items];

    return (
        <div className="relative flex overflow-hidden group py-12">
            <motion.div
                className="flex gap-16 md:gap-24 min-w-full flex-shrink-0 px-8"
                animate={{
                    x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"]
                }}
                transition={{
                    duration: speed,
                    ease: "linear",
                    repeat: Infinity
                }}
            >
                {loopItems.map((item, i) => (
                    <SkillIcon key={`${item.name}-${i}`} item={item} />
                ))}
            </motion.div>
        </div>
    );
}

function SkillIcon({ item }: { item: any }) {
    // Check if color is too dark for black background
    const isDark = (hex: string) => {
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        // YIQ equation
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return yiq < 50; // Threshold for "too dark"
    };

    const iconColor = isDark(item.icon.hex) ? '#FFFFFF' : '#' + item.icon.hex;

    return (
        <div className="group/icon relative flex flex-col items-center justify-center gap-4 cursor-default w-20 hover:z-50">
            {/* The SVG Icon */}
            <div
                className="w-16 h-16 md:w-20 md:h-20 transition-all duration-300 transform group-hover/icon:scale-125 group-hover/icon:grayscale-0 grayscale opacity-50 group-hover/icon:opacity-100"
                style={{ color: iconColor }}
            >
                <svg
                    role="img"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full fill-current"
                >
                    <path d={item.icon.path} />
                </svg>
            </div>

            {/* Tooltip Label (Visible on Hover) */}
            <span className="absolute -bottom-8 opacity-0 group-hover/icon:opacity-100 transition-opacity text-white/90 text-sm font-inter whitespace-nowrap bg-black/80 px-2 py-1 rounded border border-white/10">
                {item.name}
            </span>

            {/* Glow Effect on Hover */}
            <div
                className="absolute inset-0 blur-2xl opacity-0 group-hover/icon:opacity-20 transition-opacity duration-300 -z-10"
                style={{ backgroundColor: iconColor }}
            />
        </div>
    );
}
