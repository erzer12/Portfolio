import React, { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { DashboardOverview } from './DashboardOverview';
import { ProjectsManager } from './ProjectsManager';
import { SkillsManager } from './SkillsManager';
import { AboutManager } from './AboutManager';
import { ContactSettingsManager } from './ContactSettingsManager';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <DashboardOverview />;
      case 'Projects':
        return <ProjectsManager />;
      case 'Skills':
        return <SkillsManager />;
      case 'About':
        return <AboutManager />;
      case 'Contact Settings':
        return <ContactSettingsManager />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 ml-64">
          <div className="p-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}