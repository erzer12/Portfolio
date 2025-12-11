'use client';

import React from 'react';
import { cn } from '@/lib/utils';

const navItems = [
    { label: 'Work', href: '#work' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
];

export default function MinimalNav() {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <nav className="fixed top-0 left-0 w-full px-8 md:px-12 py-6 flex justify-between items-center z-50 bg-black/80 backdrop-blur-md border-b border-white/5 text-white transition-all duration-300">
            <div className="text-xl font-playfair font-bold tracking-tighter">HP.</div>

            <div className="flex gap-8 items-center">
                {navItems.map((item) => (
                    <a
                        key={item.label}
                        href={item.href}
                        onClick={(e) => handleClick(e, item.href)}
                        className="relative group overflow-hidden cursor-pointer"
                    >
                        <span className="block transition-transform duration-500 group-hover:-translate-y-full">
                            {item.label}
                        </span>
                        <span className="absolute top-0 left-0 block transition-transform duration-500 translate-y-full group-hover:translate-y-0 italic font-playfair">
                            {item.label}
                        </span>
                    </a>
                ))}
            </div>
        </nav>
    );
}
