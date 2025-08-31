
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Github, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Project {
  title: string;
  description: string;
  image: string;
  tags: string[];
  github: string;
  live: string;
  aiHint: string;
}

interface ProjectCarouselProps {
  projects: Project[];
}

export default function ProjectCarousel({ projects }: ProjectCarouselProps) {
    const scrollerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const scroller = scrollerRef.current;
        if (scroller) {
            scroller.setAttribute('data-animated', 'true');
        }
    }, []);
  
  return (
    <div ref={scrollerRef} className="scroller w-full overflow-hidden">
      <div className="scroller__inner flex gap-4 py-4 w-max">
        {[...projects, ...projects].map((project, index) => (
          <div key={index} className="w-[350px] md:w-[450px] group">
             <div className="p-1 h-full">
                <Card className="bg-card/50 backdrop-blur-sm border-border/50 transition-all duration-300 flex flex-col h-full transform-gpu group-hover:scale-105 group-hover:border-primary/80">
                    <CardHeader>
                    <div className="overflow-hidden rounded-t-lg">
                        <Image
                        src={project.image}
                        alt={project.title}
                        width={600}
                        height={400}
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        data-ai-hint={project.aiHint}
                        />
                    </div>
                    <CardTitle className="font-headline text-3xl flex justify-between items-center pt-4">
                        {project.title}
                        <div className="flex gap-4">
                        <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                            <Github size={24} />
                        </a>
                        <a href={project.live} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                            <ExternalLink size={24} />
                        </a>
                        </div>
                    </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                    <CardDescription className="text-muted-foreground/80">
                        {project.description}
                    </CardDescription>
                    </CardContent>
                    <CardContent>
                    <div className="flex flex-wrap gap-2 pt-2">
                        {project.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="font-body">{tag}</Badge>
                        ))}
                    </div>
                    </CardContent>
                </Card>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
