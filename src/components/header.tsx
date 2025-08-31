"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Menu, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'About', href: '#about', number: '01' },
  { name: 'Skills', href: '#skills', number: '02' },
  { name: 'Projects', href: '#projects', number: '03' },
  { name: 'Contact', href: '#contact', number: '04' },
];

const Logo = () => (
  <a href="#home" className="z-50">
    <div className="font-headline text-4xl text-accent glitch-hover" data-text="N">
      <span>N</span>
    </div>
  </a>
);

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const NavContent = ({ isMobile = false }) => (
    <>
      {navLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className={cn(
            "font-headline text-lg glitch-hover hover:text-accent transition-colors",
            isMobile ? "block text-2xl py-4 text-center" : "text-md"
          )}
          data-text={link.name}
        >
          {isMobile ? (
            <SheetClose className="w-full h-full">
              <span className="text-accent mr-1">{link.number}.</span>
              <span>{link.name}</span>
            </SheetClose>
          ) : (
            <>
              <span className="text-accent mr-1">{link.number}.</span>
              <span>{link.name}</span>
            </>
          )}
        </a>
      ))}
      <a href="/resume.pdf" download>
        <Button variant="outline" className={cn("font-headline text-lg border-accent text-accent hover:bg-accent/10", isMobile && "w-full mt-4")}>
          <Download className="mr-2 h-4 w-4" />
          Resume
        </Button>
      </a>
    </>
  );

  return (
    <header className={cn(
      "sticky top-0 z-50 transition-all duration-300",
      isScrolled ? 'h-20 bg-background/80 backdrop-blur-sm shadow-lg shadow-black/20' : 'h-24'
    )}>
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between h-full">
        <Logo />
        <nav className="hidden md:flex items-center gap-8">
          <NavContent />
        </nav>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-8 w-8 text-accent" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background/90 backdrop-blur-xl border-l-border/50">
              <div className="flex flex-col items-center justify-center h-full gap-8">
                <NavContent isMobile />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
