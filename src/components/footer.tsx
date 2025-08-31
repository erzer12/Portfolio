import { Github, Linkedin } from 'lucide-react';

const socialLinks = [
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
];

export default function Footer() {
  return (
    <footer className="w-full py-8 mt-16 border-t border-border/20">
      <div className="container mx-auto px-4 md:px-8 text-center text-muted-foreground flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-4">
          {socialLinks.map(({ icon: Icon, href, label }) => (
            <a 
              key={label} 
              href={href} 
              aria-label={label} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-muted-foreground hover:text-primary transition-colors glitch-hover"
              data-text={label}
            >
              <Icon size={24} />
            </a>
          ))}
        </div>
        <p className="font-body text-sm">
          © 2025 Harshil P
        </p>
      </div>
    </footer>
  );
}
