import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';

interface HeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

export function Header({ currentPage, onPageChange, isDarkMode, onThemeToggle }: HeaderProps) {
  const pages = ['Home', 'About', 'Skills', 'Projects', 'Contact'];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-b border-border z-50 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <nav className="flex items-center justify-between" role="navigation" aria-label="Main navigation">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onPageChange('Home')}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-neon-blue to-neon-green rounded-lg flex items-center justify-center group-hover:shadow-lg transition-all duration-300">
                <span className="text-white font-mono text-lg">AI</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-neon-blue to-neon-green rounded-lg blur opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-mono text-foreground group-hover:text-neon-blue transition-colors duration-300">
                &lt;AI_DEV /&gt;
              </h1>
              <p className="text-xs text-muted-foreground font-mono">Machine Learning Engineer</p>
            </div>
          </motion.div>
          
          {/* Navigation Links */}
          <ul className="flex items-center gap-1 bg-secondary/50 rounded-lg p-1 backdrop-blur-sm" role="menubar">
            {pages.map((page, index) => (
              <motion.li
                key={page}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                role="none"
              >
                <motion.button
                  onClick={() => onPageChange(page)}
                  className={`px-4 py-2 text-sm transition-all duration-300 relative rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                    currentPage === page
                      ? 'text-neon-blue bg-background shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                  }`}
                  whileHover={{ 
                    y: -1,
                    transition: { type: "spring", stiffness: 400, damping: 10 }
                  }}
                  whileTap={{ scale: 0.98 }}
                  role="menuitem"
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page}
                  {currentPage === page && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-neon-blue/10 to-neon-green/10 rounded-md border border-neon-blue/20"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.button>
              </motion.li>
            ))}
          </ul>

          {/* Theme Toggle & Status */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <motion.button
              onClick={onThemeToggle}
              className="relative w-12 h-6 bg-secondary rounded-full p-1 transition-all duration-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            >
              <motion.div
                className="w-4 h-4 bg-gradient-to-r from-neon-blue to-neon-green rounded-full shadow-sm flex items-center justify-center"
                animate={{
                  x: isDarkMode ? 24 : 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={isDarkMode ? 'dark' : 'light'}
                    initial={{ opacity: 0, rotate: -180 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 180 }}
                    transition={{ duration: 0.2 }}
                    className="text-xs"
                  >
                    {isDarkMode ? '🌙' : '☀️'}
                  </motion.span>
                </AnimatePresence>
              </motion.div>
            </motion.button>

            {/* Status Indicator */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex items-center gap-2"
            >
              <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse-slow" />
              <span className="text-xs font-mono text-muted-foreground hidden sm:inline">
                AVAILABLE
              </span>
            </motion.div>
          </div>
        </nav>
      </div>
    </motion.header>
  );
}