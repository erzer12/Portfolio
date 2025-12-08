'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Home, User, Code, Mail, Terminal } from 'lucide-react';

const navItems = [
    { icon: Home, label: 'Home', href: '#home' },
    { icon: User, label: 'About', href: '#about' },
    { icon: Code, label: 'Projects', href: '#projects' },
    { icon: Terminal, label: 'Skills', href: '#skills' },
    { icon: Mail, label: 'Contact', href: '#contact' },
];

export default function FloatingDock() {
    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center gap-2 px-4 py-3 rounded-full bg-black/40 backdrop-blur-xl border border-primary/20 shadow-[0_0_20px_rgba(0,243,255,0.15)]">
                {navItems.map((item) => (
                    <a
                        key={item.label}
                        href={item.href}
                        className="group relative p-3 rounded-full hover:bg-white/5 transition-all duration-300"
                    >
                        <item.icon size={24} className="text-muted-foreground group-hover:text-primary transition-colors" />

                        {/* Tooltip */}
                        <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 border border-primary/20 rounded text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            {item.label}
                        </span>

                        {/* Active Indicator (Simple dot for now) */}
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                ))}
            </div>
        </div>
    );
}
