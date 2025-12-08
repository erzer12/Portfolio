'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useProfile } from '@/hooks/use-data';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Terminal } from 'lucide-react';
import TiltContainer from '@/components/cinematic/TiltContainer';


export default function QuantumHero() {
    const { profile } = useProfile();
    const [displayedCode, setDisplayedCode] = useState('');
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        let currentIndex = 0;
        // Construct code snippet dynamically if profile is loaded
        const name = profile?.name || "Harshil P";
        const role = profile?.tagline || "Full Stack Developer";

        const dynamicSnippet = `const Hero = () => {
  const name = "${name}";
  const role = "${role}";

  return (
    <div className="hero">
      <h1>{name}</h1>
      <p>{role}</p>
      <InteractivePortrait />
    </div>
  );
};`;

        const interval = setInterval(() => {
            if (currentIndex <= dynamicSnippet.length) {
                setDisplayedCode(dynamicSnippet.slice(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(interval);
                setIsHydrated(true);
            }
        }, 10);

        return () => clearInterval(interval);
    }, [profile]);

    const scrollToWork = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const element = document.getElementById('work');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="relative min-h-screen flex flex-col-reverse md:flex-row items-center bg-black text-white overflow-hidden">
            {/* Left: Code Editor (Desktop) / Info (Mobile) */}
            <div className="w-full md:w-1/2 h-auto md:h-full p-8 md:p-20 flex flex-col justify-center z-10 bg-black/90 border-r border-white/10">
                {/* Code Visuals - Hidden on Mobile, Visible on Desktop */}
                <div className="hidden md:block font-mono text-sm md:text-base text-green-400 whitespace-pre-wrap min-h-[300px]">
                    {displayedCode}
                    <span className="animate-pulse">_</span>
                </div>

                {/* Name & Content - Always Visible */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: isHydrated ? 1 : 0, y: isHydrated ? 0 : 20 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-8 md:mt-8"
                >
                    <h1 className="text-4xl md:text-6xl font-bold font-playfair mb-4">
                        {profile?.name || "Harshil P"}
                    </h1>
                    <p className="text-xl text-gray-400 mb-8 font-inter">
                        Turning complex code into <span className="text-white">cinematic experiences</span>.
                    </p>
                    <a href="#work" onClick={scrollToWork}>
                        <Button className="rounded-full px-8 py-6 text-lg bg-white text-black hover:bg-gray-200 transition-colors w-full md:w-auto">
                            View Projects <ArrowRight className="ml-2" />
                        </Button>
                    </a>
                </motion.div>
            </div>

            {/* Right: Portrait */}
            <div className="w-full md:w-1/2 h-1/2 md:h-full relative flex items-center justify-center p-10">
                <TiltContainer rotationIntensity={15} scale={1.05}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{
                            opacity: isHydrated ? 1 : 0,
                            scale: isHydrated ? 1 : 0.9,
                            y: [0, -10, 0] // Floating animation
                        }}
                        transition={{
                            opacity: { duration: 1.5, ease: "easeOut" },
                            scale: { duration: 1.5, ease: "easeOut" },
                            y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className="relative w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                        {/* Static image fallback or dynamic if configured */}
                        <img
                            src="/hero-portrait.png"
                            alt={profile?.name || "Portrait"}
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                </TiltContainer>
            </div>
        </section>
    );
}
