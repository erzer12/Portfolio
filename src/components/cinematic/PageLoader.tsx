'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PageLoader({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Force scroll to top on mount
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
        window.scrollTo(0, 0);

        // Lock scroll
        document.body.style.overflow = 'hidden';

        // Simulate loading time or wait for assets
        const timer = setTimeout(() => {
            window.scrollTo(0, 0);
            setIsLoading(false);

            // Unlock scroll
            document.body.style.overflow = 'unset';

            // Double check scroll position after a slight delay to allow layout to settle
            setTimeout(() => {
                window.scrollTo(0, 0);
            }, 100);
        }, 2500); // 2.5s loader

        return () => {
            clearTimeout(timer);
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <>
            <AnimatePresence mode="wait">
                {isLoading && (
                    <motion.div
                        key="loader"
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
                        exit={{ y: '-100%', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
                    >
                        <div className="relative overflow-hidden">
                            <motion.h1
                                className="text-6xl md:text-9xl font-playfair text-white font-bold"
                                initial={{ y: 100 }}
                                animate={{ y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                            >
                                Harshil P
                            </motion.h1>
                            <motion.div
                                className="absolute top-0 left-0 w-full h-full bg-black"
                                initial={{ y: 0 }}
                                animate={{ y: '-100%' }}
                                transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }}
                            />
                        </div>

                        <motion.div
                            className="absolute bottom-10 left-10 text-white/50 font-mono text-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                        >
                            INITIALIZING SYSTEM...
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className={isLoading ? 'h-screen overflow-hidden' : ''}>
                {children}
            </div>
        </>
    );
}
