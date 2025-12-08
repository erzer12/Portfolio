'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Star, User } from 'lucide-react';

type Testimonial = {
    id: string;
    name: string;
    role: string;
    message: string;
    rating: number;
    approved: boolean;
    createdAt: any;
};

export default function Testimonials() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Only fetch approved testimonials
        const q = query(
            collection(db, 'testimonials'),
            where('approved', '==', true),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));
            setTestimonials(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Hide section if no testimonials
    if (!loading && testimonials.length === 0) return null;

    return (
        <section className="py-20 px-4 md:px-20 relative overflow-hidden bg-black z-10">
            <div className="flex items-end justify-between mb-12 border-b border-white/10 pb-8">
                <h2 className="text-4xl md:text-6xl font-playfair text-white">
                    Testimonials
                </h2>
                <span className="text-sm font-inter tracking-widest uppercase opacity-50">
                    What people say
                </span>
            </div>

            {/* Testimonials Grid */}
            {loading ? (
                <div className="text-center text-white/30 font-playfair animate-pulse">Loading Endorsements...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((t) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors group"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-700 to-neutral-900 flex items-center justify-center text-white/50">
                                    <User size={20} />
                                </div>
                                <div>
                                    <h4 className="font-playfair text-lg text-white">{t.name}</h4>
                                    <p className="text-xs font-inter uppercase tracking-wider text-white/40">{t.role}</p>
                                </div>
                            </div>
                            <p className="text-muted-foreground font-inter leading-relaxed mb-6">
                                "{t.message}"
                            </p>
                            <div className="flex gap-1 text-yellow-500/50 group-hover:text-yellow-500 transition-colors">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={12} fill="currentColor" />
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </section>
    );
}
