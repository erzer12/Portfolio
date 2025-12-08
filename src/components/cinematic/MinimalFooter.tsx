'use client';

import React from 'react';
import { useProfile } from '@/hooks/use-data';
import { ArrowUpRight } from 'lucide-react';

export default function MinimalFooter() {
    const { profile } = useProfile();
    const currentYear = new Date().getFullYear();

    if (!profile) return null;

    const socialLinks = [
        { name: 'GitHub', url: profile.social.github },
        { name: 'LinkedIn', url: profile.social.linkedin },
        { name: 'Email', url: profile.social.email },
    ].filter(s => s.url);

    return (
        <footer className="bg-black border-t border-white/10 py-12 px-4 md:px-20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                {/* Brand / Status */}
                <div className="col-span-1 md:col-span-2 space-y-4">
                    <h2 className="text-2xl font-playfair text-white">{profile.name}</h2>
                    <div className="flex items-center gap-2 text-xs font-mono text-green-500">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        SYSTEM ONLINE
                    </div>
                    <p className="text-muted-foreground text-sm max-w-xs">
                        Building digital experiences at the intersection of design and technology.
                    </p>
                </div>

                {/* Links */}
                <div className="space-y-4">
                    <h3 className="text-sm font-inter tracking-widest uppercase text-white/50">Connect</h3>
                    <ul className="space-y-2">
                        {socialLinks.map((social) => (
                            <li key={social.name}>
                                <a
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white hover:text-white/70 transition-colors inline-flex items-center gap-2 text-sm w-fit"
                                >
                                    {social.name} <ArrowUpRight size={12} className="opacity-50" />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Legal / Info */}
                <div className="space-y-4">
                    <h3 className="text-sm font-inter tracking-widest uppercase text-white/50">Info</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>Version 2.0.0</li>
                        <li>Last Updated: Dec 2025</li>
                        <li>{profile.location}</li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/30 font-mono">
                <p>© {currentYear} {profile.name}. All Rights Reserved.</p>
                <p>DESIGNED & DEVELOPED BY {profile.name.toUpperCase()}</p>
            </div>
        </footer>
    );
}
