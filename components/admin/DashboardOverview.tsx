import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

export function DashboardOverview() {
  const stats = [
    { title: 'Total Projects', value: '4', change: '+1 this month' },
    { title: 'Skills Listed', value: '20', change: '+3 recently' },
    { title: 'Page Views', value: '1,234', change: '+12% this week' },
    { title: 'Contact Messages', value: '8', change: '2 unread' }
  ];

  const recentActivity = [
    { action: 'Added new project "AI Chat Assistant"', time: '2 hours ago' },
    { action: 'Updated skills section', time: '1 day ago' },
    { action: 'Received contact message from John Smith', time: '3 days ago' },
    { action: 'Updated about page content', time: '1 week ago' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-medium text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Overview of your portfolio management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white justify-start">
              + Add New Project
            </Button>
            <Button variant="outline" className="w-full justify-start border-gray-300">
              📝 Update About Section
            </Button>
            <Button variant="outline" className="w-full justify-start border-gray-300">
              🛠️ Manage Skills
            </Button>
            <Button variant="outline" className="w-full justify-start border-gray-300">
              ⚙️ Contact Settings
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}