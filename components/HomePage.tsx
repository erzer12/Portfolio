import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';

interface HomePageProps {
  onPageChange: (page: string) => void;
}

export function HomePage({ onPageChange }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-cyber dark:bg-gradient-cyber grid-pattern">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background/80" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-mono text-neon-green text-sm tracking-wider"
            >
              &gt; INITIALIZING AI_DEVELOPER.EXE
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-6xl md:text-8xl font-light text-foreground leading-none tracking-tight"
            >
              Building the
              <br />
              <span className="text-neon-blue animate-pulse-slow">Future</span>
              <br />
              with AI
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="max-w-2xl mx-auto"
            >
              <p className="text-xl text-muted-foreground leading-relaxed mb-2">
                Young developer passionate about artificial intelligence,
              </p>
              <p className="text-xl text-muted-foreground leading-relaxed">
                machine learning, and creating intelligent systems that matter.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Button
                onClick={() => onPageChange('Projects')}
                className="bg-neon-blue text-primary-foreground hover:bg-neon-blue/90 px-8 py-6 text-lg hover-lift hover:shadow-lg transition-all duration-300 hover:scale-105 group"
              >
                <span className="group-hover:animate-pulse">View My Work</span>
              </Button>
              <Button
                onClick={() => onPageChange('Contact')}
                variant="outline"
                className="border-neon-green text-neon-green hover:bg-neon-green hover:text-accent-foreground px-8 py-6 text-lg hover-lift transition-all duration-300 hover:scale-105 group"
              >
                <span className="group-hover:animate-pulse">Let's Connect</span>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="flex items-center justify-center gap-8 text-sm font-mono text-muted-foreground mt-16"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
                ONLINE
              </div>
              <div className="border-gradient w-16" />
              <div>AVAILABLE FOR OPPORTUNITIES</div>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating elements */}
        <motion.div
          className="absolute top-20 left-10 w-4 h-4 border border-neon-blue/30 rotate-45"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-32 right-16 w-6 h-6 border border-neon-green/30"
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 right-10 w-2 h-2 bg-neon-blue/50 rounded-full"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* New decorative elements */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-1 h-1 bg-neon-green rounded-full"
          animate={{ 
            x: [0, 50, 0],
            y: [0, -30, 0],
            opacity: [0.3, 1, 0.3]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-3 h-3 border border-neon-blue/20 rounded-full"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Quick Stats Section */}
      <div className="py-24 bg-secondary/30 border-t border-border">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            <motion.div 
              className="text-center group"
              whileHover={{ scale: 1.02 }}
            >
              <div className="bg-card/50 border border-border rounded-lg p-8 backdrop-blur-sm hover:border-neon-blue/30 transition-all duration-300 hover-lift hover-glow group">
                <div className="text-3xl font-mono text-neon-blue mb-2 group-hover:animate-pulse">10+</div>
                <div className="text-muted-foreground">AI Projects</div>
              </div>
            </motion.div>
            <motion.div 
              className="text-center group"
              whileHover={{ scale: 1.02 }}
            >
              <div className="bg-card/50 border border-border rounded-lg p-8 backdrop-blur-sm hover:border-neon-green/30 transition-all duration-300 hover-lift hover-glow">
                <div className="text-3xl font-mono text-neon-green mb-2 group-hover:animate-pulse">3+</div>
                <div className="text-muted-foreground">Years Coding</div>
              </div>
            </motion.div>
            <motion.div 
              className="text-center group"
              whileHover={{ scale: 1.02 }}
            >
              <div className="bg-card/50 border border-border rounded-lg p-8 backdrop-blur-sm hover:border-neon-blue/30 transition-all duration-300 hover-lift hover-glow">
                <div className="text-3xl font-mono text-neon-blue mb-2 group-hover:animate-bounce">∞</div>
                <div className="text-muted-foreground">Learning</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}