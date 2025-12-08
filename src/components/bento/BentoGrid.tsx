import React from 'react';
import { cn } from '@/lib/utils';

interface BentoGridProps {
    children: React.ReactNode;
    className?: string;
}

export default function BentoGrid({ children, className }: BentoGridProps) {
    return (
        <div className={cn(
            "grid grid-cols-1 gap-4 md:grid-cols-3 md:auto-rows-[minmax(180px,auto)] max-w-7xl mx-auto p-4",
            className
        )}>
            {children}
        </div>
    );
}
