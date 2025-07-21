import React from 'react';
import { Button } from '../ui/button';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  const tabs = [
    { name: 'Dashboard', icon: '📊' },
    { name: 'Projects', icon: '💼' },
    { name: 'Skills', icon: '🛠️' },
    { name: 'About', icon: '👤' },
    { name: 'Contact Settings', icon: '✉️' }
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-medium">A</span>
          </div>
          <div>
            <h1 className="text-lg font-medium text-gray-900">Admin Panel</h1>
            <p className="text-sm text-gray-500">Portfolio Management</p>
          </div>
        </div>

        <nav className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => onTabChange(tab.name)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                activeTab === tab.name
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
        <Button
          variant="outline"
          className="w-full text-sm"
          onClick={() => window.location.reload()}
        >
          ← Back to Portfolio
        </Button>
      </div>
    </div>
  );
}