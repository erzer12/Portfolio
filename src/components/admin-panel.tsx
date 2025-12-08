"use client";

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { saveSkill, deleteSkill, saveProject, deleteProject } from '@/app/actions';
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const skillSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  icon: z.string().min(1, 'Icon is required'),
  skills: z.string().min(3, 'Enter skills as comma-separated values.'),
});

const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  image: z.string().url('Must be a valid URL').min(1, 'Image URL is required'),
  tags: z.string().min(1, 'Enter tags as comma-separated values.'),
  github: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  live: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  aiHint: z.string().optional(),
  order: z.coerce.number().optional(),
});

interface AdminPanelProps {
  skills: any[];
  projects: any[];
}

export default function AdminPanel({ skills, projects }: AdminPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("skills");
  const [selectedSkill, setSelectedSkill] = useState<any>(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'A') {
        event.preventDefault();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Clear selection when switching tabs
  useEffect(() => {
    if (activeTab === "skills") setSelectedProject(null);
    if (activeTab === "projects") setSelectedSkill(null);
  }, [activeTab]);

  const skillForm = useForm({
    resolver: zodResolver(skillSchema),
    defaultValues: { id: '', title: '', icon: '', skills: '' },
  });

  const projectForm = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: { id: '', title: '', description: '', image: '', tags: '', github: '', live: '', aiHint: '', order: 0 },
  });

  useEffect(() => {
    if (selectedSkill) {
      skillForm.reset({
        id: selectedSkill.id,
        title: selectedSkill.title,
        icon: selectedSkill.icon,
        skills: selectedSkill.skills.join(', '),
      });
    } else {
      skillForm.reset({ id: '', title: '', icon: '', skills: '' });
    }
  }, [selectedSkill, skillForm]);

  useEffect(() => {
    if (selectedProject) {
      projectForm.reset({
        id: selectedProject.id,
        title: selectedProject.title,
        description: selectedProject.description,
        image: selectedProject.image,
        tags: selectedProject.tags.join(', '),
        github: selectedProject.github,
        live: selectedProject.live,
        aiHint: selectedProject.aiHint,
        order: selectedProject.order,
      });
    } else {
      projectForm.reset({ id: '', title: '', description: '', image: '', tags: '', github: '', live: '', aiHint: '', order: 0 });
    }
  }, [selectedProject, projectForm]);

  const handleSaveSkill = async (values: z.infer<typeof skillSchema>) => {
    const skillData = {
      ...values,
      skills: values.skills.split(',').map(s => s.trim()).filter(Boolean),
    };

    const result = await saveSkill(skillData);
    if (result.success) {
      toast({ title: "Success", description: result.message });
      setSelectedSkill(null);
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
  };

  const handleDeleteSkill = async (id: string) => {
    const result = await deleteSkill(id);
    if (result.success) {
      toast({ title: "Success", description: result.message });
      setSelectedSkill(null);
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
  };

  const handleSaveProject = async (values: z.infer<typeof projectSchema>) => {
    const projectData = {
      ...values,
      tags: values.tags.split(',').map(s => s.trim()).filter(Boolean),
    };
    const result = await saveProject(projectData);
    if (result.success) {
      toast({ title: "Success", description: result.message });
      setSelectedProject(null);
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
  };

  const handleDeleteProject = async (id: string) => {
    const result = await deleteProject(id);
    if (result.success) {
      toast({ title: "Success", description: result.message });
      setSelectedProject(null);
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Admin Panel</DialogTitle>
          <DialogDescription>
            Add, edit, or delete skills and projects. Changes will be live immediately.
          </DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col min-h-0">
          <TabsList>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>
          <div className="flex-grow mt-4 overflow-hidden">
            <div className="grid grid-cols-3 gap-4 h-full">
              {/* List Column */}
              <div className="col-span-1 overflow-y-auto border-r pr-4">
                <Button
                  onClick={() => {
                    if (activeTab === "skills") setSelectedSkill(null);
                    if (activeTab === "projects") setSelectedProject(null);
                  }}
                  className="w-full mb-4"
                >
                  <PlusCircle className="mr-2" />
                  Add New
                </Button>
                <TabsContent value="skills" className="m-0">
                  <ul className="space-y-2">
                    {skills.map(skill => (
                      <li key={skill.id} onClick={() => setSelectedSkill(skill)} className={`p-2 rounded-md cursor-pointer ${selectedSkill?.id === skill.id ? 'bg-primary/20' : 'hover:bg-muted'}`}>
                        {skill.title}
                      </li>
                    ))}
                  </ul>
                </TabsContent>
                <TabsContent value="projects" className="m-0">
                  <ul className="space-y-2">
                    {projects.map(project => (
                      <li key={project.id} onClick={() => setSelectedProject(project)} className={`p-2 rounded-md cursor-pointer ${selectedProject?.id === project.id ? 'bg-primary/20' : 'hover:bg-muted'}`}>
                        {project.title}
                      </li>
                    ))}
                  </ul>
                </TabsContent>
              </div>

              {/* Form Column */}
              <div className="col-span-2 overflow-y-auto pl-4">
                <TabsContent value="skills" className="m-0">
                  <h3 className="font-bold text-lg mb-4">{selectedSkill ? 'Edit Skill' : 'Add New Skill'}</h3>
                  <Form {...skillForm}>
                    <form onSubmit={skillForm.handleSubmit(handleSaveSkill)} className="space-y-4">
                      <FormField control={skillForm.control} name="title" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={skillForm.control} name="icon" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Icon</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select an icon" /></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="BrainCircuit">BrainCircuit</SelectItem>
                              <SelectItem value="Bot">Bot</SelectItem>
                              <SelectItem value="TerminalSquare">TerminalSquare</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={skillForm.control} name="skills" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Skills (comma-separated)</FormLabel>
                          <FormControl><Textarea {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <div className="flex justify-between">
                        <Button type="submit" disabled={skillForm.formState.isSubmitting}>
                          {skillForm.formState.isSubmitting && <Loader2 className="mr-2 animate-spin" />}
                          Save Skill
                        </Button>
                        {selectedSkill && (
                          <Button variant="destructive" type="button" onClick={() => handleDeleteSkill(selectedSkill.id)}>
                            <Trash2 className="mr-2" /> Delete
                          </Button>
                        )}
                      </div>
                    </form>
                  </Form>
                </TabsContent>
                <TabsContent value="projects" className="m-0">
                  <h3 className="font-bold text-lg mb-4">{selectedProject ? 'Edit Project' : 'Add New Project'}</h3>
                  <Form {...projectForm}>
                    <form onSubmit={projectForm.handleSubmit(handleSaveProject)} className="space-y-4">
                      <FormField control={projectForm.control} name="title" render={({ field }) => (
                        <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={projectForm.control} name="description" render={({ field }) => (
                        <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={projectForm.control} name="image" render={({ field }) => (
                        <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} placeholder="https://picsum.photos/600/400" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={projectForm.control} name="tags" render={({ field }) => (
                        <FormItem><FormLabel>Tags (comma-separated)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={projectForm.control} name="github" render={({ field }) => (
                        <FormItem><FormLabel>GitHub URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={projectForm.control} name="live" render={({ field }) => (
                        <FormItem><FormLabel>Live URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={projectForm.control} name="aiHint" render={({ field }) => (
                        <FormItem><FormLabel>AI Image Hint</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={projectForm.control} name="order" render={({ field }) => (
                        <FormItem><FormLabel>Order</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />

                      <div className="flex justify-between">
                        <Button type="submit" disabled={projectForm.formState.isSubmitting}>
                          {projectForm.formState.isSubmitting && <Loader2 className="mr-2 animate-spin" />}
                          Save Project
                        </Button>
                        {selectedProject && (
                          <Button variant="destructive" type="button" onClick={() => handleDeleteProject(selectedProject.id)}>
                            <Trash2 className="mr-2" /> Delete
                          </Button>
                        )}
                      </div>
                    </form>
                  </Form>
                </TabsContent>
              </div>
            </div>
          </div>
        </Tabs>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
