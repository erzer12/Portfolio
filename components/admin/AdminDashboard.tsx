import React, { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { Card } from './Card';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <h2 className="text-lg font-semibold mb-2">Projects</h2>
              <p className="text-3xl font-bold text-blue-600">3</p>
            </Card>
            <Card>
              <h2 className="text-lg font-semibold mb-2">Skills</h2>
              <p className="text-3xl font-bold text-blue-600">8</p>
            </Card>
            <Card>
              <h2 className="text-lg font-semibold mb-2">Testimonials</h2>
              <p className="text-3xl font-bold text-blue-600">5</p>
            </Card>
          </div>
        );
      case 'Projects':
        return (
          <Card>
            <h2 className="text-xl font-semibold mb-4">Manage Projects</h2>
            <form className="space-y-4">
              <input className="w-full border border-gray-300 rounded px-3 py-2" placeholder="Project Title" />
              <textarea className="w-full border border-gray-300 rounded px-3 py-2" placeholder="Project Description" />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Add Project</button>
            </form>
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Existing Projects</h3>
              <ul className="space-y-2">
                <li className="bg-gray-50 border border-gray-200 rounded p-3 flex justify-between items-center">
                  <span>Portfolio Website</span>
                  <div className="space-x-2">
                    <button className="text-blue-600 hover:underline">Edit</button>
                    <button className="text-red-500 hover:underline">Delete</button>
                  </div>
                </li>
                <li className="bg-gray-50 border border-gray-200 rounded p-3 flex justify-between items-center">
                  <span>AI Chatbot</span>
                  <div className="space-x-2">
                    <button className="text-blue-600 hover:underline">Edit</button>
                    <button className="text-red-500 hover:underline">Delete</button>
                  </div>
                </li>
              </ul>
            </div>
          </Card>
        );
      case 'Skills':
        return (
          <Card>
            <h2 className="text-xl font-semibold mb-4">Manage Skills</h2>
            <form className="space-y-4">
              <input className="w-full border border-gray-300 rounded px-3 py-2" placeholder="Skill Name" />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Add Skill</button>
            </form>
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Existing Skills</h3>
              <ul className="space-y-2">
                <li className="bg-gray-50 border border-gray-200 rounded p-3 flex justify-between items-center">
                  <span>React</span>
                  <div className="space-x-2">
                    <button className="text-blue-600 hover:underline">Edit</button>
                    <button className="text-red-500 hover:underline">Delete</button>
                  </div>
                </li>
                <li className="bg-gray-50 border border-gray-200 rounded p-3 flex justify-between items-center">
                  <span>Python</span>
                  <div className="space-x-2">
                    <button className="text-blue-600 hover:underline">Edit</button>
                    <button className="text-red-500 hover:underline">Delete</button>
                  </div>
                </li>
              </ul>
            </div>
          </Card>
        );
      case 'About':
        return (
          <Card>
            <h2 className="text-xl font-semibold mb-4">Edit About Section</h2>
            <textarea className="w-full border border-gray-300 rounded px-3 py-2" rows={5} placeholder="About you..." />
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Save</button>
          </Card>
        );
      case 'Contact Settings':
        return (
          <Card>
            <h2 className="text-xl font-semibold mb-4">Edit Contact Settings</h2>
            <form className="space-y-4">
              <input className="w-full border border-gray-300 rounded px-3 py-2" placeholder="Email Address" />
              <input className="w-full border border-gray-300 rounded px-3 py-2" placeholder="Phone Number" />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Save</button>
            </form>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 ml-64 p-10">
        {renderContent()}
      </main>
    </div>
  );
}