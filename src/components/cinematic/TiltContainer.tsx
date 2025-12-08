'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { cn } from '@/lib/utils';

interface TiltContainerProps {
    children: React.ReactNode;
    className?: string;
    perspective?: number;
    scale?: number;
    rotationIntensity?: number;
}

export default function TiltContainer({
    children,
    className,
    perspective = 1000,
    scale = 1.02,
    rotationIntensity = 10
}: TiltContainerProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Calculate rotation based on mouse position relative to center
            const rotateX = ((y - centerY) / centerY) * -rotationIntensity;
            const rotateY = ((x - centerX) / centerX) * rotationIntensity;

            gsap.to(container, {
                rotateX: rotateX,
                rotateY: rotateY,
                scale: scale,
                transformPerspective: perspective,
                duration: 0.4,
                ease: 'power2.out',
            });
        };

        const handleMouseLeave = () => {
            gsap.to(container, {
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                duration: 0.7,
                ease: 'elastic.out(1, 0.5)',
            });
        };

        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            container.removeEventListener('mousemove', handleMouseMove);
            container.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [perspective, scale, rotationIntensity]);

    return (
        <div
            ref={containerRef}
            className={cn("will-change-transform transform-gpu", className)}
            style={{ transformStyle: 'preserve-3d' }}
        >
            {children}
        </div>
    );
}
