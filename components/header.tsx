"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Mail, Github, Linkedin, Download, Menu, X } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export default function EnhancedHeader() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleResumeDownload = async () => {
    setIsDownloading(true)
    try {
      const link = document.createElement("a")
      link.href = "/resume.pdf"
      link.setAttribute("download", "resume.pdf")
      link.setAttribute("target", "_blank")
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Download failed:", error)
    } finally {
      setIsDownloading(false)
    }
  }

  if (!mounted) return null

  const navItems = [
    { href: "#about", label: "About" },
    { href: "#skills", label: "Skills" },
    { href: "#projects", label: "Projects" },
    { href: "#github", label: "GitHub" },
    { href: "#toolkit", label: "Toolkit" },
    { href: "#contact", label: "Contact" },
  ]

  return (
    <motion.header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-md border-b shadow-lg" : "bg-transparent"
      }`}
      initial={{ y: 0 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div
          className={`flex items-center justify-between transition-all duration-300 ${
            isScrolled ? "h-16 lg:h-18" : "h-20 lg:h-24"
          }`}
        >
          {/* Logo/Brand */}
          <motion.div
            className="flex flex-col"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Harshil P
            </h1>
            <p className="text-sm lg:text-base text-muted-foreground">AI & Bot Enthusiast | Software Developer</p>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <motion.div key={item.href} whileHover={{ y: -2 }}>
                <Link
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Social Links */}
            <div className="hidden md:flex items-center gap-2">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="mailto:harshilp1234@gmail.com" aria-label="Email">
                    <Mail className="h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="https://github.com/erzer12" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    <Github className="h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="icon" asChild>
                  <Link
                    href="https://linkedin.com/in/harshilp1"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </div>

            {/* Download Resume Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                className="hidden lg:flex items-center gap-2"
                onClick={handleResumeDownload}
                disabled={isDownloading}
              >
                <Download className="h-4 w-4" />
                {isDownloading ? "Downloading..." : "Resume"}
              </Button>
            </motion.div>

            {/* Theme Toggle */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </motion.div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t bg-background/95 backdrop-blur-md"
            >
              <nav className="py-4 space-y-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}

                {/* Mobile Resume Download */}
                <div className="px-4 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full flex items-center gap-2"
                    onClick={handleResumeDownload}
                    disabled={isDownloading}
                  >
                    <Download className="h-4 w-4" />
                    {isDownloading ? "Downloading..." : "Download Resume"}
                  </Button>
                </div>

                {/* Mobile Social Links */}
                <div className="flex items-center justify-center gap-4 pt-4 border-t">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href="mailto:harshilp1234@gmail.com">
                      <Mail className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href="https://github.com/erzer12" target="_blank">
                      <Github className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href="https://linkedin.com/in/harshilp1" target="_blank">
                      <Linkedin className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}
