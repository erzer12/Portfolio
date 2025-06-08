"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Project {
  id: number
  title: string
  description: string
  technologies: string[]
  image: string
}

export default function AdminPage() {
  const { toast } = useToast()
  const [projects, setProjects] = useState<Project[]>([])
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [newProject, setNewProject] = useState<Omit<Project, "id">>({
    title: "",
    description: "",
    technologies: [],
    image: "",
  })

  // Load projects from localStorage or API
  useEffect(() => {
    const savedProjects = localStorage.getItem("portfolio-projects")
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects))
    }
  }, [])

  const saveProjects = (updatedProjects: Project[]) => {
    setProjects(updatedProjects)
    localStorage.setItem("portfolio-projects", JSON.stringify(updatedProjects))
    toast({
      title: "Success",
      description: "Projects updated successfully!",
    })
  }

  const addProject = () => {
    if (!newProject.title || !newProject.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const project: Project = {
      ...newProject,
      id: Date.now(),
      technologies: newProject.technologies.length > 0 ? newProject.technologies : [],
    }

    saveProjects([...projects, project])
    setNewProject({ title: "", description: "", technologies: [], image: "" })
  }

  const updateProject = () => {
    if (!editingProject) return

    const updatedProjects = projects.map((p) => (p.id === editingProject.id ? editingProject : p))
    saveProjects(updatedProjects)
    setEditingProject(null)
  }

  const deleteProject = (id: number) => {
    const updatedProjects = projects.filter((p) => p.id !== id)
    saveProjects(updatedProjects)
  }

  const addTechnology = (tech: string, isEditing = false) => {
    if (!tech.trim()) return

    if (isEditing && editingProject) {
      setEditingProject({
        ...editingProject,
        technologies: [...editingProject.technologies, tech.trim()],
      })
    } else {
      setNewProject({
        ...newProject,
        technologies: [...newProject.technologies, tech.trim()],
      })
    }
  }

  const removeTechnology = (index: number, isEditing = false) => {
    if (isEditing && editingProject) {
      setEditingProject({
        ...editingProject,
        technologies: editingProject.technologies.filter((_, i) => i !== index),
      })
    } else {
      setNewProject({
        ...newProject,
        technologies: newProject.technologies.filter((_, i) => i !== index),
      })
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Portfolio Admin</h1>
          <p className="text-muted-foreground">Manage your projects and portfolio content</p>
        </div>

        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            {/* Add New Project */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Project
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Project Title"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  />
                  <Input
                    placeholder="Image URL"
                    value={newProject.image}
                    onChange={(e) => setNewProject({ ...newProject, image: e.target.value })}
                  />
                </div>
                <Textarea
                  placeholder="Project Description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                />
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {newProject.technologies.map((tech, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => removeTechnology(index)}
                      >
                        {tech} ×
                      </Badge>
                    ))}
                  </div>
                  <Input
                    placeholder="Add technology (press Enter)"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        addTechnology(e.currentTarget.value)
                        e.currentTarget.value = ""
                      }
                    }}
                  />
                </div>
                <Button onClick={addProject}>Add Project</Button>
              </CardContent>
            </Card>

            {/* Existing Projects */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {project.image && (
                      <img
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        className="w-full h-32 object-cover rounded"
                      />
                    )}
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.map((tech, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingProject(project)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => deleteProject(project.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Edit Project Modal */}
            {editingProject && (
              <Card className="fixed inset-4 z-50 bg-background border shadow-lg overflow-auto">
                <CardHeader>
                  <CardTitle>Edit Project</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Project Title"
                      value={editingProject.title}
                      onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    />
                    <Input
                      placeholder="Image URL"
                      value={editingProject.image}
                      onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })}
                    />
                  </div>
                  <Textarea
                    placeholder="Project Description"
                    value={editingProject.description}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  />
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {editingProject.technologies.map((tech, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => removeTechnology(index, true)}
                        >
                          {tech} ×
                        </Badge>
                      ))}
                    </div>
                    <Input
                      placeholder="Add technology (press Enter)"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          addTechnology(e.currentTarget.value, true)
                          e.currentTarget.value = ""
                        }
                      }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={updateProject}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setEditingProject(null)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Settings panel coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
