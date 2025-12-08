'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function AITerminalContact() {
    const [step, setStep] = useState<'init' | 'name' | 'email' | 'message' | 'sending' | 'success'>('init');
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (step === 'init') {
            setTimeout(() => addLine('Initializing Secure Connection...'), 500);
            setTimeout(() => addLine('Protocol: CONTACT_V1 established.'), 1500);
            setTimeout(() => {
                addLine('Please identify yourself.');
                setStep('name');
            }, 2500);
        }
    }, [step]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [terminalOutput]);

    const addLine = (text: string) => {
        setTerminalOutput(prev => [...prev, `> ${text}`]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        addLine(inputValue); // Echo user input
        const value = inputValue;
        setInputValue('');

        if (step === 'name') {
            setFormData(prev => ({ ...prev, name: value }));
            setTimeout(() => {
                addLine(`Welcome, ${value}.`);
                addLine('Enter communication frequency (Email Address):');
                setStep('email');
            }, 500);
        } else if (step === 'email') {
            setFormData(prev => ({ ...prev, email: value }));
            setTimeout(() => {
                addLine('Target locked.');
                addLine('Enter transmission payload (Message):');
                setStep('message');
            }, 500);
        } else if (step === 'message') {
            setFormData(prev => ({ ...prev, message: value }));
            setStep('sending');
            addLine('Encrypting and transmitting data...');

            // Simulate API call
            setTimeout(() => {
                setStep('success');
                addLine('Transmission successful.');
                addLine('Session terminated.');
            }, 2000);
        }
    };

    return (
        <section id="contact" className="min-h-screen bg-black flex items-center justify-center p-4 md:p-20 font-mono">
            <div className="w-full max-w-3xl border border-green-500/30 bg-black/90 rounded-lg overflow-hidden shadow-[0_0_50px_rgba(0,255,0,0.1)]">
                {/* Header */}
                <div className="bg-green-500/10 p-4 border-b border-green-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-green-500">
                        <Terminal size={18} />
                        <span className="text-sm tracking-widest">COMM_LINK_ACTIVE</span>
                    </div>
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                    </div>
                </div>

                {/* Terminal Body */}
                <div className="p-6 h-[400px] overflow-y-auto space-y-2 text-green-400">
                    {terminalOutput.map((line, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="break-words"
                        >
                            {line}
                        </motion.div>
                    ))}

                    {step !== 'init' && step !== 'sending' && step !== 'success' && (
                        <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-4">
                            <span className="text-green-500 animate-pulse">{'>'}</span>
                            <input
                                autoFocus
                                type={step === 'email' ? 'email' : 'text'}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="bg-transparent border-none outline-none text-green-400 w-full placeholder-green-500/30"
                                placeholder={step === 'message' ? "Type your message..." : "Type here..."}
                            />
                        </form>
                    )}

                    {step === 'sending' && (
                        <div className="flex items-center gap-2 text-green-500 mt-4">
                            <Loader2 className="animate-spin" size={16} />
                            <span>TRANSMITTING...</span>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="mt-8 p-4 border border-green-500/30 text-center">
                            <p className="text-green-400 mb-4">Message received. I will respond shortly.</p>
                            <Button
                                onClick={() => {
                                    setStep('init');
                                    setTerminalOutput([]);
                                    setFormData({ name: '', email: '', message: '' });
                                }}
                                variant="outline"
                                className="border-green-500 text-green-500 hover:bg-green-500/10"
                            >
                                START_NEW_SESSION
                            </Button>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>
            </div>
        </section>
    );
}
