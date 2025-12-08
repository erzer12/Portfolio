'use client';

import React from 'react';
import { useCertifications } from '@/hooks/use-data';
import { Badge } from '@/components/ui/badge';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

export default function Certifications() {
    const { certifications } = useCertifications();

    return (
        <section id="certifications" className="px-8 md:px-20 py-20 bg-neutral-900 border-t border-white/5">
            <div className="flex items-end justify-between mb-16">
                <div>
                    <h2 className="text-4xl md:text-6xl font-playfair mb-4">Certifications</h2>
                    <p className="text-muted-foreground font-inter max-w-lg">
                        Recognized credentials and verified expertise from industry leaders.
                    </p>
                </div>
                <div className="hidden md:block">
                    <span className="text-sm font-inter tracking-widest uppercase opacity-50">Swipe to Explore</span>
                </div>
            </div>

            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="w-full"
            >
                <CarouselContent className="-ml-4">
                    {certifications.map((cert) => (
                        <CarouselItem key={cert.id} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 h-full">
                            <a
                                href={cert.link || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col h-[300px] p-8 border border-white/5 hover:border-white/20 transition-all duration-500 group hover:bg-white/5 rounded-2xl relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-32 bg-white/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-white/10 transition-colors" />

                                <div className="flex justify-between items-start mb-auto z-10">
                                    {cert.image ? (
                                        <div className="w-16 h-16 flex-shrink-0 grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all bg-white/5 p-2 rounded-xl border border-white/5">
                                            <img src={cert.image} alt="" className="w-full h-full object-contain" />
                                        </div>
                                    ) : (
                                        <div className="w-16 h-16 bg-white/5 rounded-xl border border-white/5" />
                                    )}
                                    <Badge variant="outline" className="border-white/10 text-white/70 font-inter text-[10px] uppercase tracking-wider backdrop-blur-sm">
                                        {cert.issuer}
                                    </Badge>
                                </div>

                                <div className="z-10 mt-8">
                                    <span className="text-xs font-inter tracking-widest uppercase opacity-50 block mb-2">{cert.date}</span>
                                    <h3 className="text-xl font-playfair italic leading-tight group-hover:translate-x-1 transition-transform duration-500">
                                        {cert.name}
                                    </h3>
                                </div>
                            </a>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <div className="flex justify-end gap-2 mt-8 md:mt-12 pr-4">
                    <CarouselPrevious className="static translate-y-0" />
                    <CarouselNext className="static translate-y-0" />
                </div>
            </Carousel>
        </section>
    );
}
