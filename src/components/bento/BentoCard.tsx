'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import TiltContainer from '@/components/cinematic/TiltContainer';

interface BentoCardProps {
    children: React.ReactNode;
    className?: string;
    colSpan?: 1 | 2 | 3;
    rowSpan?: 1 | 2;
    title?: string;
    href?: string;
    target?: string;
    rel?: string;
}

export default function BentoCard({
    children,
    className,
    colSpan = 1,
    rowSpan = 1,
    title,
    href,
    target,
    rel
}: BentoCardProps) {
    const Component = href ? 'a' : 'div';

    const CardContent = (
        <div className={cn(
            "h-full w-full group relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20",
            className
        )}>
            {/* Gradient Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <div className="relative z-10 h-full p-6 flex flex-col">
                {title && (
                    <h3 className="mb-2 text-lg font-semibold text-white/90 group-hover:text-white transition-colors">
                        {title}
                    </h3>
                )}
                <div className="flex-grow">
                    {children}
                </div>
            </div>
        </div>
    );

    const Wrapper = ({ children }: { children: React.ReactNode }) => {
        if (href) {
            return <a href={href} target={target} rel={rel} className="block h-full">{children}</a>;
        }
        return <div className="h-full">{children}</div>;
    };

    return (
        <div className={cn(
            colSpan === 2 && "md:col-span-2",
            colSpan === 3 && "md:col-span-3",
            rowSpan === 2 && "md:row-span-2",
        )}>
            <Wrapper>
                <TiltContainer className="h-full" rotationIntensity={5} scale={1.02}>
                    {CardContent}
                </TiltContainer>
            </Wrapper>
        </div>
    );
}
