import { Github, Linkedin, Mail, Twitter, Code, Heart } from 'lucide-react';
import { Button } from './ui/button';

const socialLinks = [
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Mail, href: 'mailto:harshil@example.com', label: 'Email' },
];

const quickLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
];

const Logo = () => (
    <div className="font-headline text-2xl text-primary glitch-hover" data-text="HP <DEV />">
      <span>HP &lt;DEV /&gt;</span>
    </div>
);

export default function Footer() {
  return (
    <footer className="w-full py-12 mt-24 bg-card/20 border-t border-border/20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-muted-foreground">
          {/* Column 1: Bio */}
          <div className="space-y-4">
            <Logo />
            <p className="text-sm">
                Enthusiastic Computer Science undergraduate dedicated to software development, with a focus on app creation, web scraping, bot development, and AI-driven tools.
            </p>
            <p className="text-sm text-primary">Available for opportunities</p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-headline text-xl text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map(link => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm hover:text-primary transition-colors glitch-hover" data-text={link.name}>
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Connect */}
          <div>
            <h3 className="font-headline text-xl text-foreground mb-4">Connect</h3>
            <a href="#contact">
              <Button variant="outline" className="w-full mb-4 border-primary text-primary hover:bg-primary/10">
                Get In Touch
              </Button>
            </a>
            <div className="flex gap-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-full bg-secondary hover:bg-secondary/80"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border/20 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© 2025 Harshil P. All rights reserved.</p>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <span>Built with React + AI</span>
            <span className="text-primary">•</span>
            <span>Made with <Heart size={16} className="inline text-primary fill-current" /></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
