import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

export function AboutManager() {
  const [aboutData, setAboutData] = useState({
    name: 'John Doe',
    title: 'Computer Science Student',
    subtitle: 'Specializing in AI & Software Development',
    bio: `I'm a dedicated Computer Science student with a passion for artificial intelligence and software development. Currently in my final year, I've been exploring the intersection of AI and practical applications, working on projects that solve real-world problems.

My journey into computer science began with curiosity about how intelligent systems work, and has evolved into a deep appreciation for both the theoretical foundations and practical implementations of AI technologies.

When I'm not coding, you can find me reading research papers, contributing to open-source projects, or exploring the latest developments in machine learning and software engineering.`,
    location: 'San Francisco, CA',
    email: 'john.doe@email.com',
    linkedin: 'linkedin.com/in/johndoe',
    github: 'github.com/johndoe'
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    // Here you would typically save to a backend
    console.log('Saving about data:', aboutData);
    setIsEditing(false);
    alert('About section updated successfully!');
  };

  const handleChange = (field: string, value: string) => {
    setAboutData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-gray-900 mb-2">About</h1>
          <p className="text-gray-600">Manage your personal information and bio</p>
        </div>
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
              Edit About
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6">
        {/* Basic Information */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Full Name</label>
                {isEditing ? (
                  <Input
                    value={aboutData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                  />
                ) : (
                  <p className="text-gray-900 py-2">{aboutData.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Title</label>
                {isEditing ? (
                  <Input
                    value={aboutData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                  />
                ) : (
                  <p className="text-gray-900 py-2">{aboutData.title}</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Subtitle</label>
              {isEditing ? (
                <Input
                  value={aboutData.subtitle}
                  onChange={(e) => handleChange('subtitle', e.target.value)}
                />
              ) : (
                <p className="text-gray-900 py-2">{aboutData.subtitle}</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Location</label>
              {isEditing ? (
                <Input
                  value={aboutData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                />
              ) : (
                <p className="text-gray-900 py-2">{aboutData.location}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bio */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg">Biography</CardTitle>
          </CardHeader>
          <CardContent>
            <label className="block text-sm text-gray-700 mb-2">About Me</label>
            {isEditing ? (
              <Textarea
                value={aboutData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                rows={8}
                className="w-full"
              />
            ) : (
              <div className="text-gray-900 whitespace-pre-wrap py-2 border border-gray-200 rounded-lg p-4 bg-gray-50">
                {aboutData.bio}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Email</label>
              {isEditing ? (
                <Input
                  value={aboutData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  type="email"
                />
              ) : (
                <p className="text-gray-900 py-2">{aboutData.email}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">LinkedIn</label>
                {isEditing ? (
                  <Input
                    value={aboutData.linkedin}
                    onChange={(e) => handleChange('linkedin', e.target.value)}
                  />
                ) : (
                  <p className="text-gray-900 py-2">{aboutData.linkedin}</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">GitHub</label>
                {isEditing ? (
                  <Input
                    value={aboutData.github}
                    onChange={(e) => handleChange('github', e.target.value)}
                  />
                ) : (
                  <p className="text-gray-900 py-2">{aboutData.github}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}