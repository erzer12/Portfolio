"use client";

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    document.body.addEventListener('mouseenter', handleMouseEnter);

    const interactiveElements = document.querySelectorAll('a, button, [role="button"], .glitch-hover');
    
    const handleElementEnter = () => setIsHovering(true);
    const handleElementLeave = () => setIsHovering(false);

    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleElementEnter);
      el.addEventListener('mouseleave', handleElementLeave);
    });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleElementEnter);
        el.removeEventListener('mouseleave', handleElementLeave);
      });
    };
  }, []);

  return (
    <div
      className={cn(
        "hidden md:block fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] transition-transform duration-200 ease-in-out",
        "border-2 border-accent rounded-full",
        isHovering ? "scale-150 bg-accent/20" : "scale-100",
        isVisible ? "opacity-100" : "opacity-0"
      )}
      style={{
        transform: `translate(${position.x - 16}px, ${position.y - 16}px) ${isHovering ? 'scale(1.5)' : 'scale(1)'}`,
      }}
    >
      <div 
        className={cn("absolute top-1/2 left-1/2 w-1 h-1 bg-accent rounded-full -translate-x-1/2 -translate-y-1/2 transition-transform duration-200", isHovering ? "scale-0" : "scale-100")}
      />
    </div>
  );
};

export default CustomCursor;
