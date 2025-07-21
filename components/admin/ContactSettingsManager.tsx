import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';

export function ContactSettingsManager() {
  const [contactMessages, setContactMessages] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      subject: 'Collaboration Opportunity',
      message: 'Hi John, I\'d love to discuss a potential collaboration on an AI project.',
      date: '2024-01-20',
      read: false
    },
    {
      id: 2,
      name: 'Mike Chen',
      email: 'mike@startup.com',
      subject: 'Job Opportunity',
      message: 'We have an exciting internship opportunity that matches your skills.',
      date: '2024-01-18',
      read: true
    }
  ]);

  const [settings, setSettings] = useState({
    autoReply: true,
    autoReplyMessage: 'Thank you for your message! I\'ll get back to you within 24 hours.',
    emailNotifications: true,
    showContactForm: true,
    showEmailAddress: true,
    showSocialLinks: true
  });

  const [isEditingAutoReply, setIsEditingAutoReply] = useState(false);

  const handleMarkAsRead = (id: number) => {
    setContactMessages(prev =>
      prev.map(msg => msg.id === id ? { ...msg, read: true } : msg)
    );
  };

  const handleDeleteMessage = (id: number) => {
    setContactMessages(prev => prev.filter(msg => msg.id !== id));
  };

  const handleSettingChange = (setting: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [setting]: value }));
  };

  const handleAutoReplyChange = (value: string) => {
    setSettings(prev => ({ ...prev, autoReplyMessage: value }));
  };

  const unreadCount = contactMessages.filter(msg => !msg.read).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-medium text-gray-900 mb-2">Contact Settings</h1>
        <p className="text-gray-600">Manage contact messages and form settings</p>
      </div>

      {/* Contact Messages */}
      <Card className="border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Contact Messages</CardTitle>
            {unreadCount > 0 && (
              <Badge className="bg-blue-600 text-white">
                {unreadCount} unread
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contactMessages.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No messages yet</p>
            ) : (
              contactMessages.map((message) => (
                <div
                  key={message.id}
                  className={`border border-gray-200 rounded-lg p-4 ${
                    !message.read ? 'bg-blue-50 border-blue-200' : 'bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-gray-900">{message.name}</h4>
                        <span className="text-sm text-gray-500">{message.email}</span>
                        {!message.read && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                      <h5 className="text-sm font-medium text-gray-900 mb-2">{message.subject}</h5>
                      <p className="text-sm text-gray-600 mb-3">{message.message}</p>
                      <p className="text-xs text-gray-500">{message.date}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      {!message.read && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkAsRead(message.id)}
                        >
                          Mark Read
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteMessage(message.id)}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contact Form Settings */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg">Contact Form Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Show Contact Form</h4>
              <p className="text-sm text-gray-600">Display the contact form on your portfolio</p>
            </div>
            <Switch
              checked={settings.showContactForm}
              onCheckedChange={(checked) => handleSettingChange('showContactForm', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Show Email Address</h4>
              <p className="text-sm text-gray-600">Display your email address publicly</p>
            </div>
            <Switch
              checked={settings.showEmailAddress}
              onCheckedChange={(checked) => handleSettingChange('showEmailAddress', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Show Social Links</h4>
              <p className="text-sm text-gray-600">Display links to your social profiles</p>
            </div>
            <Switch
              checked={settings.showSocialLinks}
              onCheckedChange={(checked) => handleSettingChange('showSocialLinks', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
              <p className="text-sm text-gray-600">Receive notifications for new messages</p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Auto-Reply Settings */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg">Auto-Reply Message</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Enable Auto-Reply</h4>
              <p className="text-sm text-gray-600">Automatically send a response to new messages</p>
            </div>
            <Switch
              checked={settings.autoReply}
              onCheckedChange={(checked) => handleSettingChange('autoReply', checked)}
            />
          </div>

          {settings.autoReply && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-900">Auto-Reply Message</label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingAutoReply(!isEditingAutoReply)}
                >
                  {isEditingAutoReply ? 'Save' : 'Edit'}
                </Button>
              </div>
              {isEditingAutoReply ? (
                <Textarea
                  value={settings.autoReplyMessage}
                  onChange={(e) => handleAutoReplyChange(e.target.value)}
                  rows={4}
                />
              ) : (
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
                  {settings.autoReplyMessage}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}