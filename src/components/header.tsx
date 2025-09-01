"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle, SheetHeader } from '@/components/ui/sheet';
import { Menu, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
];

const Logo = () => (
  <a href="#home" className="z-50">
    <div className="font-headline text-4xl text-primary glitch-hover" data-text="HP">
      <span>HP</span>
    </div>
  </a>
);

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('#home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      const sections = navLinks.map(link => document.getElementById(link.href.substring(1)));
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        if (section && scrollPosition >= section.offsetTop && scrollPosition < section.offsetTop + section.offsetHeight) {
          setActiveLink(`#${section.id}`);
          break;
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const section = document.getElementById(href.substring(1));
    if (section) {
      window.scrollTo({
        top: section.offsetTop,
        behavior: 'smooth',
      });
      setActiveLink(href);
    }
  };

  const NavContent = ({ isMobile = false, onLinkClick }: { isMobile?: boolean, onLinkClick?: () => void }) => (
    <>
      {navLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          onClick={(e) => {
            handleLinkClick(e, link.href);
            onLinkClick?.();
          }}
          className={cn(
            "font-headline text-lg glitch-hover hover:text-primary transition-colors",
            activeLink === link.href ? "text-primary" : "text-foreground",
            isMobile ? "block text-2xl py-4 text-center" : "text-md"
          )}
          data-text={link.name}
        >
          <span className={cn(isMobile && "text-primary mr-1")}>
            {isMobile ? `${navLinks.findIndex(l => l.href === link.href) + 1}.` : ''}
          </span>
          <span>{link.name}</span>
        </a>
      ))}
      <a href="/resume.pdf" download="Harshil_P_Resume.pdf">
        <Button variant="outline" className={cn("font-headline text-lg border-primary text-primary hover:bg-primary/10", isMobile && "w-full mt-4")}>
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
                <Menu className="h-8 w-8 text-primary" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background/90 backdrop-blur-xl border-l-border/50">
                <SheetHeader className="sr-only">
                    <SheetTitle>Mobile Navigation Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col items-center justify-center h-full gap-8">
                  <SheetClose asChild>
                    <NavContent isMobile onLinkClick={() => {}} />
                  </SheetClose>
                </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
