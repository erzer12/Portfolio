'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);
    const subtextRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const tl = gsap.timeline();

        tl.fromTo(textRef.current,
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: 'power4.out', delay: 0.2 }
        )
            .fromTo(subtextRef.current,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
                "-=0.5"
            );

        // Parallax effect on scroll
        gsap.to(textRef.current, {
            y: -100,
            opacity: 0,
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });

    }, []);

    return (
        <section ref={containerRef} className="relative min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20 overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10 pointer-events-none animate-pulse" />

            <h1 ref={textRef} className="text-6xl md:text-9xl font-bold tracking-tighter mb-6">
                <span className="text-gradient">Harshil P</span>
            </h1>

            <p ref={subtextRef} className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Architecting intelligent systems & <br className="hidden md:block" />
                crafting immersive digital experiences.
            </p>
        </section>
    );
}
