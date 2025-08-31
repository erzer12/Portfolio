"use client";

import { useState, useEffect, useRef, type ElementType, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ScrollAnimatorProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children: React.ReactNode;
}

const ScrollAnimator = ({ as: Comp = 'div', children, className, ...props }: ScrollAnimatorProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if(ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <Comp
      ref={ref}
      className={cn('scroll-animator', { 'is-visible': isVisible }, className)}
      {...props}
    >
      {children}
    </Comp>
  );
};

export default ScrollAnimator;
