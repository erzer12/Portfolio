import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { AboutPage } from './components/AboutPage';
import { SkillsPage } from './components/SkillsPage';
import { ProjectsPage } from './components/ProjectsPage';
import { ProjectCaseStudy } from './components/ProjectCaseStudy';
import { ContactPage } from './components/ContactPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Button } from './components/ui/button';
import LinesBackground from './components/LinesBackground';

export default function App() {
  const [currentPage, setCurrentPage] = useState('Home');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    setSelectedProject(null); // Clear selected project when navigating to other pages
  };

  const handleProjectSelect = (projectId: string) => {
    setSelectedProject(projectId);
    setCurrentPage('ProjectCaseStudy');
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
    setCurrentPage('Projects');
  };

  const renderPage = () => {
    if (selectedProject) {
      return (
        <ProjectCaseStudy 
          projectId={selectedProject} 
          onBack={handleBackToProjects}
        />
      );
    }

    switch (currentPage) {
      case 'Home':
        return <HomePage onPageChange={handlePageChange} />;
      case 'About':
        return <AboutPage />;
      case 'Skills':
        return <SkillsPage />;
      case 'Projects':
        return <ProjectsPage onProjectSelect={handleProjectSelect} />;
      case 'Contact':
        return <ContactPage />;
      default:
        return <HomePage onPageChange={handlePageChange} />;
    }
  };

  // Don't show header navigation for project case studies
  const showMainNavigation = !selectedProject;

  if (isAdminMode) {
    return (
      <div className="relative">
        <AdminDashboard />
        <Button
          onClick={() => setIsAdminMode(false)}
          className="fixed top-4 right-4 z-50 bg-gray-900 hover:bg-gray-800 text-white"
          size="sm"
        >
          Exit Admin
        </Button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <LinesBackground />
      {showMainNavigation && <Header currentPage={currentPage} onPageChange={handlePageChange} onThemeToggle={handleThemeToggle} isDarkMode={isDarkMode} />}
      <main className="relative z-10">
        {renderPage()}
      </main>
      <Footer onPageChange={handlePageChange} />
    </div>
  );
}