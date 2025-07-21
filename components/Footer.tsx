import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';

interface FooterProps {
  onPageChange: (page: string) => void;
}

export function Footer({ onPageChange }: FooterProps) {
  const socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com/username',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/username',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/username',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      )
    },
    {
      name: 'Email',
      url: 'mailto:ai.developer@example.com',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  const quickLinks = [
    { name: 'Home', page: 'Home' },
    { name: 'About', page: 'About' },
    { name: 'Projects', page: 'Projects' },
    { name: 'Contact', page: 'Contact' }
  ];

  return (
    <footer className="bg-secondary/30 border-t border-border backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand & Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-neon-blue to-neon-green rounded-lg flex items-center justify-center">
                <span className="text-white font-mono text-sm">AI</span>
              </div>
              <h3 className="text-lg font-mono text-foreground">&lt;AI_DEV /&gt;</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-sm">
              Building the future with artificial intelligence. Passionate about creating 
              intelligent systems that solve real-world problems.
            </p>
            <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
              <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
              <span>Available for opportunities</span>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h4 className="font-medium text-foreground">Quick Links</h4>
            <nav className="space-y-2" aria-label="Footer navigation">
              {quickLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => onPageChange(link.page)}
                  className="block text-muted-foreground hover:text-neon-blue transition-colors duration-200 text-left focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
                >
                  {link.name}
                </button>
              ))}
            </nav>
          </motion.div>

          {/* Contact & Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h4 className="font-medium text-foreground">Connect</h4>
            <div className="space-y-3">
              <Button
                onClick={() => onPageChange('Contact')}
                className="w-full bg-neon-blue/10 hover:bg-neon-blue/20 text-neon-blue border border-neon-blue/30 hover:border-neon-blue/50 transition-all duration-300 hover:shadow-lg"
              >
                Get In Touch
              </Button>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-secondary hover:bg-neon-blue/10 rounded-lg flex items-center justify-center text-muted-foreground hover:text-neon-blue transition-all duration-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 group"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={`Visit ${social.name} profile`}
                  >
                    <div className="group-hover:animate-pulse">
                      {social.icon}
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-border"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>&copy; 2024 AI Developer Portfolio. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-4 text-sm font-mono text-muted-foreground">
              <span>Built with React + AI</span>
              <div className="w-1 h-1 bg-muted-foreground rounded-full" />
              <span>Made with ❤️</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}