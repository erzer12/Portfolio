import React from 'react';

const tabs = [
  { name: 'Dashboard', icon: '📊' },
  { name: 'Projects', icon: '💼' },
  { name: 'Skills', icon: '🛠️' },
  { name: 'About', icon: '👤' },
  { name: 'Contact Settings', icon: '✉️' },
];

export function AdminSidebar({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-gray-50 border-r border-gray-200 shadow-sm flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-medium">A</span>
          </div>
          <div>
            <h1 className="text-lg font-medium text-gray-900">Admin Panel</h1>
            <p className="text-sm text-gray-500">Portfolio Management</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => onTabChange(tab.name)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors font-medium
              ${activeTab === tab.name
                ? 'bg-blue-50 text-blue-600 shadow border border-blue-100'
                : 'text-gray-700 hover:bg-gray-100'}
            `}
          >
            <span className="text-base">{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200 mt-auto">
        <button
          className="w-full text-sm text-gray-500 hover:text-blue-600 transition-colors"
          onClick={() => window.location.reload()}
        >
          ← Back to Portfolio
        </button>
      </div>
    </aside>
  );
}