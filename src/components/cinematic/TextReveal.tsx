'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface TextRevealProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

export default function TextReveal({ children, className = "", delay = 0 }: TextRevealProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

    return (
        <div ref={ref} className={`overflow-hidden ${className}`}>
            <motion.div
                initial={{ y: "100%", opacity: 0, rotateX: 20 }}
                animate={isInView ? { y: 0, opacity: 1, rotateX: 0 } : {}}
                transition={{
                    duration: 1,
                    ease: [0.16, 1, 0.3, 1], // Custom ease for "cinematic" feel
                    delay: delay,
                }}
                className="origin-top-left"
            >
                {children}
            </motion.div>
        </div>
    );
}
