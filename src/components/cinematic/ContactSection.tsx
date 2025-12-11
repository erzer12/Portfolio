'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageSquare, Star, User, Mail } from 'lucide-react';
import { sendEmail, submitTestimonial } from '@/app/actions';

export default function ContactSection() {
    const [mode, setMode] = useState<'contact' | 'review'>('contact');
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Form States
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [role, setRole] = useState('');
    const [rating, setRating] = useState(5);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setErrorMessage('');

        try {
            if (mode === 'contact') {
                // Send email via Resend API
                const result = await sendEmail({ name, email, message });

                if (!result.success) {
                    setErrorMessage(result.message || 'Failed to send message. Please try again.');
                    return;
                }
            } else {
                // Submit Review
                const result = await submitTestimonial({
                    name,
                    role: role || 'Visitor',
                    message,
                    rating
                });

                if (!result.success) {
                    setErrorMessage(result.message || 'Failed to submit review. Please try again.');
                    return;
                }
            }
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                setName('');
                setEmail('');
                setMessage('');
                setRole('');
                setRating(5);
            }, 3000);
        } catch (error) {
            console.error("Error submitting:", error);
            setErrorMessage('An unexpected error occurred. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Toggle Switch */}
            <div className="flex justify-center mb-12">
                <div className="bg-white/5 border border-white/10 p-1 rounded-full flex relative">
                    <motion.div
                        className="absolute top-1 bottom-1 bg-white/10 rounded-full"
                        initial={false}
                        animate={{
                            x: mode === 'contact' ? 0 : '100%',
                            width: '50%'
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                    <button
                        onClick={() => setMode('contact')}
                        className={`relative z-10 px-8 py-3 rounded-full text-sm font-inter tracking-widest uppercase transition-colors ${mode === 'contact' ? 'text-white' : 'text-white/50'}`}
                    >
                        Contact
                    </button>
                    <button
                        onClick={() => setMode('review')}
                        className={`relative z-10 px-8 py-3 rounded-full text-sm font-inter tracking-widest uppercase transition-colors ${mode === 'review' ? 'text-white' : 'text-white/50'}`}
                    >
                        Review
                    </button>
                </div>
            </div>

            {/* Form Container */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-sm">
                <AnimatePresence mode="wait">
                    {success ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="text-center py-20"
                        >
                            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                                <Send size={32} />
                            </div>
                            <h3 className="text-3xl font-playfair text-white mb-4">
                                {mode === 'contact' ? 'Message Sent!' : 'Review Submitted!'}
                            </h3>
                            <p className="text-white/50 font-inter">
                                {mode === 'contact'
                                    ? "I'll get back to you as soon as possible."
                                    : "Your review has been sent for approval."}
                            </p>
                        </motion.div>
                    ) : (
                        <motion.form
                            key={mode}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            onSubmit={handleSubmit}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 text-left">
                                    <label className="text-xs uppercase tracking-widest text-white/50 ml-1">Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl p-4 pl-12 text-white focus:outline-none focus:border-white/30 transition-colors"
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                </div>

                                {mode === 'contact' ? (
                                    <div className="space-y-2 text-left">
                                        <label className="text-xs uppercase tracking-widest text-white/50 ml-1">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 pl-12 text-white focus:outline-none focus:border-white/30 transition-colors"
                                                placeholder="john@example.com"
                                                required
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2 text-left">
                                        <label className="text-xs uppercase tracking-widest text-white/50 ml-1">Role / Company</label>
                                        <div className="relative">
                                            <Star className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                                            <input
                                                type="text"
                                                value={role}
                                                onChange={(e) => setRole(e.target.value)}
                                                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 pl-12 text-white focus:outline-none focus:border-white/30 transition-colors"
                                                placeholder="Developer @ Tech"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2 text-left">
                                <label className="text-xs uppercase tracking-widest text-white/50 ml-1">Message</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-white/30 transition-colors h-40 resize-none"
                                    placeholder={mode === 'contact' ? "Tell me about your project..." : "Share your experience working with me..."}
                                    required
                                />
                            </div>

                            {errorMessage && (
                                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
                                    {errorMessage}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-white text-black font-inter tracking-widest uppercase py-4 rounded-xl hover:bg-white/90 transition-colors flex items-center justify-center gap-2 font-bold"
                            >
                                {submitting ? 'Sending...' : (
                                    <>
                                        {mode === 'contact' ? 'Send Message' : 'Submit Review'}
                                        <Send size={16} />
                                    </>
                                )}
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
