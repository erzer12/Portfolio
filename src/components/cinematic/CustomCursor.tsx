'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, animate } from 'framer-motion';

export default function CustomCursor() {
    // Visibility State
    const [isVisible, setIsVisible] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);

    // Target Element State for Morphing
    const [targetRect, setTargetRect] = useState<{ width: number; height: number; x: number; y: number; radius: string } | null>(null);

    // Mouse Position
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Dot Logic (Leading) - Fast Response
    // We add a tiny bit of physics for satisfying movement, but keep it tight
    const dotX = useSpring(mouseX, { damping: 50, stiffness: 1000 });
    const dotY = useSpring(mouseY, { damping: 50, stiffness: 1000 });

    // Shape Logic (Trailing) - Smooth Follow
    // The shape mimics the dot unless it locks onto an element
    // Note: We delegated shape logic to the sub-component for better state management

    useEffect(() => {
        // Feature Detection: Hide on touch devices OR small screens (mobile responsive mode)
        const isMobile = typeof window !== 'undefined' && (
            window.matchMedia('(pointer: coarse)').matches ||
            window.innerWidth < 768 // Standard mobile breakpoint
        );

        if (isMobile) {
            return;
        }

        setIsVisible(true);
        // Hide default cursor via JS to ensure it only happens when this component is active
        document.body.style.cursor = 'none';

        const handleMouseMove = (e: MouseEvent) => {
            // Update raw mouse values instantly
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            // Check for interactive elements
            const interactiveElement = target.closest('a, button, input, textarea, [data-cursor="interactive"]');

            if (interactiveElement) {
                setIsHovering(true);
                const rect = interactiveElement.getBoundingClientRect();
                const style = window.getComputedStyle(interactiveElement);

                // Set target state for morphing
                setTargetRect({
                    width: rect.width,
                    height: rect.height,
                    x: rect.left + rect.width / 2, // Center X
                    y: rect.top + rect.height / 2, // Center Y
                    radius: style.borderRadius !== '0px' ? style.borderRadius : '8px',
                });
            } else {
                setIsHovering(false);
                setTargetRect(null);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mouseover', handleMouseOver);
            // Restore default cursor on cleanup
            document.body.style.cursor = 'auto';
        };
    }, [mouseX, mouseY]);

    if (!isVisible) return null;

    return (
        <>
            {/* Dot - Always follows mouse accurately */}
            <motion.div
                className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[10000] mix-blend-difference"
                style={{
                    x: dotX,
                    y: dotY,
                    translateX: '-50%',
                    translateY: '-50%',
                    scale: isClicking ? 0.8 : 1,
                }}
            />

            {/* Shape - The Morphing Element */}
            <CursorShape
                mouseX={mouseX}
                mouseY={mouseY}
                targetRect={targetRect}
                isClicking={isClicking}
            />
        </>
    );
}

function CursorShape({ mouseX, mouseY, targetRect, isClicking }: { mouseX: any, mouseY: any, targetRect: any, isClicking: boolean }) {
    // Tuning: Snappier physics (higher stiffness, adjusted damping)
    const springConfig = { damping: 30, stiffness: 350 };

    const targetX = useMotionValue(0);
    const targetY = useMotionValue(0);
    const targetW = useMotionValue(32);
    const targetH = useMotionValue(32);

    const x = useSpring(targetX, springConfig);
    const y = useSpring(targetY, springConfig);
    const width = useSpring(targetW, springConfig);
    const height = useSpring(targetH, springConfig);

    useEffect(() => {
        if (targetRect) {
            targetX.set(targetRect.x);
            targetY.set(targetRect.y);
            targetW.set(targetRect.width + 12); // Slightly larger padding (was +8)
            targetH.set(targetRect.height + 12);
        } else {
            // Follow mouse
            const unsubscribeX = mouseX.on("change", (latest: number) => targetX.set(latest));
            const unsubscribeY = mouseY.on("change", (latest: number) => targetY.set(latest));
            targetW.set(32);
            targetH.set(32);
            return () => {
                unsubscribeX();
                unsubscribeY();
            }
        }
    }, [targetRect, mouseX, mouseY, targetX, targetY, targetW, targetH]);

    return (
        <motion.div
            className="fixed top-0 left-0 border border-white pointer-events-none z-[9999] mix-blend-difference box-border"
            style={{
                x,
                y,
                width,
                height,
                translateX: '-50%',
                translateY: '-50%',
                borderRadius: targetRect?.radius || '50%', // Use captured radius or fallback to circle
                scale: isClicking ? 0.9 : 1,
                backgroundColor: targetRect ? 'rgba(255,255,255,0.05)' : 'transparent', // Subtle fill
            }}
        />
    )
}
