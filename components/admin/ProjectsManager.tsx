import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';

export function ProjectsManager() {
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: 'AI Chat Assistant',
      description: 'A conversational AI assistant built with natural language processing capabilities.',
      technologies: ['Python', 'TensorFlow', 'Flask', 'React'],
      status: 'Published',
      lastUpdated: '2024-01-15'
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'Full-stack web application for project and task management.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Socket.io'],
      status: 'Published',
      lastUpdated: '2024-01-10'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    technologies: '',
    imageUrl: '',
    githubUrl: '',
    demoUrl: ''
  });

  const handleAddProject = () => {
    const project = {
      id: Date.now(),
      title: newProject.title,
      description: newProject.description,
      technologies: newProject.technologies.split(',').map(tech => tech.trim()),
      status: 'Published',
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setProjects([...projects, project]);
    setNewProject({ title: '', description: '', technologies: '', imageUrl: '', githubUrl: '', demoUrl: '' });
    setShowAddForm(false);
  };

  const handleDeleteProject = (id: number) => {
    setProjects(projects.filter(project => project.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-gray-900 mb-2">Projects</h1>
          <p className="text-gray-600">Manage your portfolio projects</p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          + Add Project
        </Button>
      </div>

      {showAddForm && (
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg">Add New Project</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Project Title</label>
                <Input
                  value={newProject.title}
                  onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter project title"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Technologies (comma-separated)</label>
                <Input
                  value={newProject.technologies}
                  onChange={(e) => setNewProject(prev => ({ ...prev, technologies: e.target.value }))}
                  placeholder="React, Node.js, MongoDB"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Description</label>
              <Textarea
                value={newProject.description}
                onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter project description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">GitHub URL</label>
                <Input
                  value={newProject.githubUrl}
                  onChange={(e) => setNewProject(prev => ({ ...prev, githubUrl: e.target.value }))}
                  placeholder="https://github.com/..."
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Demo URL</label>
                <Input
                  value={newProject.demoUrl}
                  onChange={(e) => setNewProject(prev => ({ ...prev, demoUrl: e.target.value }))}
                  placeholder="https://demo.example.com"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleAddProject} className="bg-blue-600 hover:bg-blue-700 text-white">
                Add Project
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-medium text-gray-900">{project.title}</h3>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      {project.status}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">Last updated: {project.lastUpdated}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button variant="outline" size="sm" className="border-gray-300">
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteProject(project.id)}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}