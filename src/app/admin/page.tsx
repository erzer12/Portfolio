'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Github, Trash2, Plus, Save, ExternalLink, Edit, Check, Star, Briefcase, Award, User, Code2, X } from 'lucide-react';
import {
    verifyAccessCode, fetchGithubRepos, saveProject, deleteProject,
    saveSkill, deleteSkill, saveProfile, deleteExperience, deleteCertification, deleteEducation,
    updateTestimonialApproval, deleteTestimonial
} from '@/app/actions';
import { collection, onSnapshot, query, orderBy, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ProjectDialog from '@/components/admin/ProjectDialog';
import SkillDialog from '@/components/admin/SkillDialog';
import ExperienceDialog from '@/components/admin/ExperienceDialog';
import CertificationDialog from '@/components/admin/CertificationDialog';
import EducationDialog from '@/components/admin/EducationDialog';
import TestimonialDialog from '@/components/admin/TestimonialDialog';
import SeedDataButton from '@/components/admin/SeedDataButton';
import CredlyImport from '@/components/admin/CredlyImport';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';
import { useProjects, useSkills, useExperience, useCertifications, useEducation, useProfile, Project, Skill, Experience, Certification, Education, Profile } from '@/hooks/use-data';

// --- Types ---
type Testimonial = {
    id: string;
    name: string;
    role: string;
    message: string;
    rating: number;
    approved: boolean;
    createdAt: any;
};

// --- Profile Form Component ---
const profileSchema = z.object({
    name: z.string().min(1),
    tagline: z.string(),
    summary: z.string(),
    location: z.string(),
    email: z.string().email(),
    phone: z.string(),
    resume: z.string().optional(),
    social: z.object({
        github: z.string(),
        linkedin: z.string(),
        website: z.string(),
        email: z.string()
    })
});

function ProfileForm({ profile }: { profile: Profile | null }) {
    const { toast } = useToast();
    const { register, handleSubmit, reset } = useForm<z.infer<typeof profileSchema>>();
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (profile) {
            reset(profile);
        }
    }, [profile, reset]);

    const onSubmit = async (data: z.infer<typeof profileSchema>) => {
        setIsSaving(true);
        const res = await saveProfile(data);
        setIsSaving(false);
        if (res.success) {
            toast({ title: 'Success', description: 'Profile updated.' });
        } else {
            toast({ title: 'Error', description: res.message, variant: 'destructive' });
        }
    };

    return (
        <Card className="glass-card">
            <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details visible on the Home, About, and Footer sections.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-6 flex justify-end">
                    <SeedDataButton contentType="profile" />
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm">Name</label>
                            <Input {...register('name')} className="bg-white/5 border-white/10" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm">Tagline</label>
                            <Input {...register('tagline')} className="bg-white/5 border-white/10" />
                        </div>
                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <label className="text-sm">Summary (About Me)</label>
                            <Textarea {...register('summary')} className="bg-white/5 border-white/10 min-h-[100px]" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm">Location</label>
                            <Input {...register('location')} className="bg-white/5 border-white/10" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm">Public Email</label>
                            <Input {...register('email')} className="bg-white/5 border-white/10" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm">Phone</label>
                            <Input {...register('phone')} className="bg-white/5 border-white/10" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-yellow-500">Resume URL</label>
                            <Input {...register('resume')} placeholder="https://..." className="bg-white/5 border-white/10" />
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-white/10">
                        <h3 className="text-lg font-semibold">Social Links</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm">GitHub URL</label>
                                <Input {...register('social.github')} className="bg-white/5 border-white/10" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm">LinkedIn URL</label>
                                <Input {...register('social.linkedin')} className="bg-white/5 border-white/10" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm">Website URL</label>
                                <Input {...register('social.website')} className="bg-white/5 border-white/10" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm">Mailto URL</label>
                                <Input {...register('social.email')} className="bg-white/5 border-white/10" />
                            </div>
                        </div>
                    </div>

                    <Button type="submit" disabled={isSaving}>
                        {isSaving && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                        Save Profile
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

// --- Main Admin Page ---

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [accessCode, setAccessCode] = useState('');
    const { toast } = useToast();

    // Data Hooks
    const { projects } = useProjects();
    const { skills } = useSkills();
    const { experience } = useExperience();
    const { certifications } = useCertifications();
    const { education } = useEducation();
    const { profile } = useProfile();

    // Testimonials State (Still manual query)
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

    // Dialog States
    const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | undefined>(undefined);
    const [isSkillDialogOpen, setIsSkillDialogOpen] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState<Skill | undefined>(undefined);
    const [isExperienceDialogOpen, setIsExperienceDialogOpen] = useState(false);
    const [selectedExperience, setSelectedExperience] = useState<Experience | undefined>(undefined);
    const [isCertDialogOpen, setIsCertDialogOpen] = useState(false);
    const [selectedCert, setSelectedCert] = useState<Certification | undefined>(undefined);
    const [isTestimonialDialogOpen, setIsTestimonialDialogOpen] = useState(false);
    const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | undefined>(undefined);

    // GitHub Import State
    const [githubUsername, setGithubUsername] = useState('erzer12');
    const [fetchedRepos, setFetchedRepos] = useState<any[]>([]);
    const [isFetchingRepos, setIsFetchingRepos] = useState(false);

    // Bulk Delete State
    const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
    const [selectedCerts, setSelectedCerts] = useState<string[]>([]);
    const [selectedReviews, setSelectedReviews] = useState<string[]>([]);

    // Delete Dialog State
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteConfig, setDeleteConfig] = useState<{ type: 'single' | 'bulk', category: 'project' | 'cert' | 'review' | 'skill' | 'exp' | 'edu', ids: string[] }>({ type: 'single', category: 'project', ids: [] });

    // Auth Check
    useEffect(() => {
        const auth = sessionStorage.getItem('admin_auth');
        if (auth === 'true') setIsAuthenticated(true);
        setIsLoading(false);
    }, []);

    // Testimonials Listener
    useEffect(() => {
        if (!isAuthenticated) return;
        const qTestimonials = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(qTestimonials, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));
            setTestimonials(data);
        });
        return () => unsubscribe();
    }, [isAuthenticated]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const res = await verifyAccessCode(accessCode);
        setIsLoading(false);
        if (res.success) {
            setIsAuthenticated(true);
            sessionStorage.setItem('admin_auth', 'true');
            toast({ title: 'Welcome back!', description: 'You are now logged in.' });
        } else {
            toast({ title: 'Access Denied', description: res.message, variant: 'destructive' });
        }
    };

    // ... (Testimonials logic)

    // Selection Handlers
    const toggleSelection = (id: string, list: string[], setList: (ids: string[]) => void) => {
        if (list.includes(id)) {
            setList(list.filter(item => item !== id));
        } else {
            setList([...list, id]);
        }
    };

    const handleBulkDelete = async () => {
        setIsLoading(true);
        try {
            const { category, ids } = deleteConfig;

            if (category === 'project') {
                await Promise.all(ids.map(id => deleteProject(id)));
                setSelectedProjects([]);
            } else if (category === 'cert') {
                await Promise.all(ids.map(id => deleteCertification(id)));
                setSelectedCerts([]);
            } else if (category === 'review') {
                await Promise.all(ids.map(id => deleteTestimonial(id)));
                setSelectedReviews([]);
            } else if (category === 'skill') {
                await Promise.all(ids.map(id => deleteSkill(id)));
            } else if (category === 'exp') {
                await Promise.all(ids.map(id => deleteExperience(id)));
            } else if (category === 'edu') {
                await Promise.all(ids.map(id => deleteEducation(id)));
            }

            toast({ title: "Success", description: "Items deleted successfully." });
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to delete items.", variant: "destructive" });
        } finally {
            setIsLoading(false);
            setDeleteDialogOpen(false);
        }
    };

    const confirmDelete = (category: 'project' | 'cert' | 'review' | 'skill' | 'exp' | 'edu', ids: string[]) => {
        setDeleteConfig({ type: ids.length > 1 ? 'bulk' : 'single', category, ids });
        setDeleteDialogOpen(true);
    };

    // --- Action Handlers (Legacy Wrappers) ---
    const handleDeleteProject = (id: string) => confirmDelete('project', [id]);
    const handleDeleteSkill = (id: string) => confirmDelete('skill', [id]);
    const handleDeleteExperience = (id: string) => confirmDelete('exp', [id]);
    const handleDeleteCert = (id: string) => confirmDelete('cert', [id]);
    const handleDeleteEducation = (id: string) => confirmDelete('edu', [id]);
    const deleteTestim = (id: string) => confirmDelete('review', [id]);

    const handleFetchRepos = async () => {
        // ... (existing)

        setIsFetchingRepos(true);
        const res = await fetchGithubRepos(githubUsername);
        setIsFetchingRepos(false);
        if (res.success && res.data) {
            setFetchedRepos(res.data);
            toast({ title: 'Repositories Fetched', description: `Found ${res.data.length} repositories.` });
        } else {
            toast({ title: 'Error', description: res.message, variant: 'destructive' });
        }
    };

    const handleImportRepo = async (repo: any) => {
        const projectData = {
            title: repo.name,
            description: repo.description || 'No description provided.',
            image: `https://opengraph.githubassets.com/1/${githubUsername}/${repo.name}`,
            tags: [repo.language, ...repo.topics].filter(Boolean),
            github: repo.html_url,
            live: repo.homepage || repo.html_url,
            aiHint: 'Imported from GitHub',
            order: Date.now(), // Ensure it shows up in ordered queries
        };
        const res = await saveProject(projectData);
        if (res.success) toast({ title: 'Success', description: `Imported ${repo.name}.` });
        else toast({ title: 'Error', description: res.message, variant: 'destructive' });
    };

    const toggleTestimonial = async (id: string, currentStatus: boolean) => {
        try {
            await updateTestimonialApproval(id, !currentStatus);
            toast({ title: "Updated", description: "Review status updated." });
        } catch {
            toast({ title: "Error", description: "Failed to update.", variant: "destructive" });
        }
    };




    if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

    if (!isAuthenticated) {
        return (
            <div className="flex h-screen items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md glass-card">
                    <CardHeader><CardTitle className="text-center">Admin Access</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <Input type="password" placeholder="Access Code" value={accessCode} onChange={(e) => setAccessCode(e.target.value)} />
                            <Button type="submit" className="w-full">Unlock</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-6 space-y-8 min-h-screen pb-20">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold font-headline text-gradient">Dashboard</h1>
                <div className="flex gap-4">
                    <Button variant="outline" onClick={() => { setIsAuthenticated(false); sessionStorage.removeItem('admin_auth'); }}>Logout</Button>
                </div>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-8 h-auto">
                    <TabsTrigger value="profile"><User className="w-4 h-4 mr-2" /> Profile</TabsTrigger>
                    <TabsTrigger value="projects"><Code2 className="w-4 h-4 mr-2" /> Projects</TabsTrigger>
                    <TabsTrigger value="skills"><Star className="w-4 h-4 mr-2" /> Skills</TabsTrigger>
                    <TabsTrigger value="experience"><Briefcase className="w-4 h-4 mr-2" /> Work</TabsTrigger>
                    <TabsTrigger value="education"><Code2 className="w-4 h-4 mr-2" /> Education</TabsTrigger>
                    <TabsTrigger value="certifications"><Award className="w-4 h-4 mr-2" /> Certs</TabsTrigger>
                    <TabsTrigger value="testimonials"><User className="w-4 h-4 mr-2" /> Reviews</TabsTrigger>
                    <TabsTrigger value="github"><Github className="w-4 h-4 mr-2" /> Import</TabsTrigger>
                </TabsList>

                {/* --- Profile Tab --- */}
                <TabsContent value="profile">
                    <ProfileForm profile={profile} />
                </TabsContent>

                {/* --- Projects Tab --- */}
                <TabsContent value="projects" className="space-y-6">
                    {selectedProjects.length > 0 && (
                        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-destructive text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-5">
                            <span className="font-bold">{selectedProjects.length} selected</span>
                            <Button variant="secondary" size="sm" onClick={() => confirmDelete('project', selectedProjects)}>
                                <Trash2 className="w-4 h-4 mr-2" /> Delete Selected
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setSelectedProjects([])} className="h-6 w-6 rounded-full hover:bg-white/20 p-0 text-white">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card className="glass-card border-dashed border-2 flex flex-col items-center justify-center min-h-[300px] cursor-pointer hover:bg-white/5 transition-colors gap-4">
                            <div onClick={() => { setSelectedProject(undefined); setIsProjectDialogOpen(true); }} className="text-center w-full h-full flex flex-col items-center justify-center">
                                <Plus className="mx-auto h-12 w-12 text-white/50" />
                                <h3>Add Project</h3>
                            </div>
                            <SeedDataButton contentType="projects" className="z-10" />
                        </Card>
                        {projects.map(project => (
                            <Card key={project.id} className={`glass-card flex flex-col group relative overflow-hidden transition-all duration-200 ${selectedProjects.includes(project.id) ? 'ring-2 ring-primary bg-primary/10' : ''}`}>
                                {project.image && <div className="h-40 w-full overflow-hidden"><img src={project.image} alt="" className="w-full h-full object-cover" /></div>}

                                <div className="absolute top-2 left-2 z-20">
                                    <Checkbox
                                        checked={selectedProjects.includes(project.id)}
                                        onCheckedChange={() => toggleSelection(project.id, selectedProjects, setSelectedProjects)}
                                        className="bg-black/50 border-white/50 data-[state=checked]:bg-primary"
                                    />
                                </div>

                                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <Button size="icon" variant="secondary" onClick={(e) => { e.stopPropagation(); setSelectedProject(project); setIsProjectDialogOpen(true); }}><Edit className="h-4 w-4" /></Button>
                                    <Button size="icon" variant="destructive" onClick={(e) => { e.stopPropagation(); handleDeleteProject(project.id); }}><Trash2 className="h-4 w-4" /></Button>
                                </div>
                                <CardHeader><CardTitle>{project.title}</CardTitle></CardHeader>
                                <CardContent><p className="line-clamp-3 text-sm text-white/70">{project.description}</p></CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* --- Skills Tab --- */}
                <TabsContent value="skills" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card className="glass-card border-dashed border-2 flex flex-col items-center justify-center min-h-[200px] gap-4">
                            <div className="cursor-pointer flex flex-col items-center" onClick={() => { setSelectedSkill(undefined); setIsSkillDialogOpen(true); }}>
                                <Plus className="mx-auto h-10 w-10 text-white/50" />
                                <h3>Add Skill Group</h3>
                            </div>
                            <SeedDataButton contentType="skills" />
                        </Card>
                        {skills.map(skill => (
                            <Card key={skill.id} className="glass-card group relative">
                                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="icon" variant="secondary" onClick={() => { setSelectedSkill(skill); setIsSkillDialogOpen(true); }}><Edit className="h-4 w-4" /></Button>
                                    <Button size="icon" variant="destructive" onClick={() => handleDeleteSkill(skill.id)}><Trash2 className="h-4 w-4" /></Button>
                                </div>
                                <CardHeader><CardTitle>{skill.title}</CardTitle></CardHeader>
                                <CardContent><div className="flex flex-wrap gap-2">{skill.skills.map(s => <Badge key={s} variant="outline">{s}</Badge>)}</div></CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* --- Experience Tab --- */}
                <TabsContent value="experience" className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Button onClick={() => { setSelectedExperience(undefined); setIsExperienceDialogOpen(true); }}>
                            <Plus className="mr-2 h-4 w-4" /> Add Work Experience
                        </Button>
                        <SeedDataButton contentType="experience" />
                    </div>
                    <div className="grid gap-4">
                        {experience.map(job => (
                            <Card key={job.id} className="glass-card flex justify-between items-center p-6">
                                <div>
                                    <h3 className="font-bold text-lg">{job.role}</h3>
                                    <p className="text-white/70">{job.company} • {job.start} - {job.end}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="icon" variant="secondary" onClick={() => { setSelectedExperience(job); setIsExperienceDialogOpen(true); }}><Edit className="h-4 w-4" /></Button>
                                    <Button size="icon" variant="destructive" onClick={() => handleDeleteExperience(job.id)}><Trash2 className="h-4 w-4" /></Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* --- Education Tab --- */}
                <TabsContent value="education" className="space-y-4">
                    <Card className="glass-card">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Education</CardTitle>
                                <CardDescription>Manage your academic background.</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <SeedDataButton contentType="education" />
                                <EducationDialog />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {education.map((edu) => (
                                    <div key={edu.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                                        <div>
                                            <h3 className="font-bold text-white">{edu.school}</h3>
                                            <p className="text-sm text-gray-400">{edu.degree}</p>
                                            <p className="text-xs text-gray-500">{edu.year}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <EducationDialog education={edu} />
                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteEducation(edu.id)} className="text-red-400 hover:text-red-300 hover:bg-red-400/10">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- Certifications Tab --- */}
                <TabsContent value="certifications" className="space-y-6">
                    {selectedCerts.length > 0 && (
                        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-destructive text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-5">
                            <span className="font-bold">{selectedCerts.length} selected</span>
                            <Button variant="secondary" size="sm" onClick={() => confirmDelete('cert', selectedCerts)}>
                                <Trash2 className="w-4 h-4 mr-2" /> Delete Selected
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setSelectedCerts([])} className="h-6 w-6 rounded-full hover:bg-white/20 p-0 text-white">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                    <div className="flex items-center gap-4 mb-6">
                        <Button onClick={() => { setSelectedCert(undefined); setIsCertDialogOpen(true); }}>
                            <Plus className="mr-2 h-4 w-4" /> Add Certification
                        </Button>
                        <SeedDataButton contentType="certifications" />
                    </div>
                    <CredlyImport />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {certifications.map(cert => (
                            <Card key={cert.id} className={`glass-card group relative transition-all duration-200 ${selectedCerts.includes(cert.id) ? 'ring-2 ring-primary bg-primary/10' : ''}`}>
                                <div className="absolute top-2 left-2 z-20">
                                    <Checkbox
                                        checked={selectedCerts.includes(cert.id)}
                                        onCheckedChange={() => toggleSelection(cert.id, selectedCerts, setSelectedCerts)}
                                        className="bg-black/50 border-white/50 data-[state=checked]:bg-primary"
                                    />
                                </div>
                                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="icon" variant="secondary" onClick={() => { setSelectedCert(cert); setIsCertDialogOpen(true); }}><Edit className="h-4 w-4" /></Button>
                                    <Button size="icon" variant="destructive" onClick={() => handleDeleteCert(cert.id)}><Trash2 className="h-4 w-4" /></Button>
                                </div>
                                <CardHeader>
                                    <CardTitle className="text-lg">{cert.name}</CardTitle>
                                    <CardDescription>{cert.issuer} • {cert.date}</CardDescription>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* --- Reviews (Testimonials) Tab --- */}
                <TabsContent value="testimonials" className="space-y-6">
                    {selectedReviews.length > 0 && (
                        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-destructive text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-5">
                            <span className="font-bold">{selectedReviews.length} selected</span>
                            <Button variant="secondary" size="sm" onClick={() => confirmDelete('review', selectedReviews)}>
                                <Trash2 className="w-4 h-4 mr-2" /> Delete Selected
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setSelectedReviews([])} className="h-6 w-6 rounded-full hover:bg-white/20 p-0 text-white">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                    <div className="flex items-center gap-4 mb-4">
                        <Button onClick={() => { setSelectedTestimonial(undefined); setIsTestimonialDialogOpen(true); }}>
                            <Plus className="mr-2 h-4 w-4" /> Add Review
                        </Button>
                        <SeedDataButton contentType="testimonials" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {testimonials.map(t => (
                            <Card key={t.id} className={`glass-card flex flex-col relative transition-all duration-200 ${selectedReviews.includes(t.id) ? 'ring-2 ring-primary bg-primary/10' : ''}`}>
                                <div className="absolute top-2 left-2 z-20">
                                    <Checkbox
                                        checked={selectedReviews.includes(t.id)}
                                        onCheckedChange={() => toggleSelection(t.id, selectedReviews, setSelectedReviews)}
                                        className="bg-black/50 border-white/50 data-[state=checked]:bg-primary"
                                    />
                                </div>
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <Button size="icon" variant="ghost" onClick={() => toggleTestimonial(t.id, t.approved)} className={t.approved ? "text-green-400" : "text-gray-500"}>
                                        <Check className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" onClick={() => { setSelectedTestimonial(t); setIsTestimonialDialogOpen(true); }}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" onClick={() => deleteTestim(t.id)} className="text-red-400 hover:text-red-300">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-lg">{t.name}</CardTitle>
                                            <CardDescription>{t.role}</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-white/70 italic mb-4">"{t.message}"</p>
                                    <div className="mt-auto flex gap-1">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star key={i} className={`h-3 w-3 ${i < t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* --- GitHub Import Tab --- */}
                <TabsContent value="github" className="space-y-6">
                    <div className="flex gap-4">
                        <Input placeholder="GitHub Username" value={githubUsername} onChange={(e) => setGithubUsername(e.target.value)} className="max-w-xs bg-white/5" />
                        <Button onClick={handleFetchRepos} disabled={isFetchingRepos}>
                            {isFetchingRepos ? <Loader2 className="animate-spin mr-2" /> : <Github className="mr-2" />} Fetch
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {fetchedRepos.map((repo) => (
                            <Card key={repo.id} className="glass-card flex flex-col">
                                <CardHeader><CardTitle className="text-lg truncate">{repo.name}</CardTitle><CardDescription className="line-clamp-2">{repo.description}</CardDescription></CardHeader>
                                <CardContent className="mt-auto"><Button className="w-full" onClick={() => handleImportRepo(repo)}>Import</Button></CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

            </Tabs>

            {/* Dialogs */}
            < ProjectDialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen} project={selectedProject} />
            <SkillDialog open={isSkillDialogOpen} onOpenChange={setIsSkillDialogOpen} skill={selectedSkill} />
            <ExperienceDialog open={isExperienceDialogOpen} onOpenChange={setIsExperienceDialogOpen} experience={selectedExperience} />
            <CertificationDialog open={isCertDialogOpen} onOpenChange={setIsCertDialogOpen} certification={selectedCert} />
            <TestimonialDialog open={isTestimonialDialogOpen} onOpenChange={setIsTestimonialDialogOpen} testimonial={selectedTestimonial} />

            <DeleteConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleBulkDelete}
                count={deleteConfig.ids.length}
                description={deleteConfig.type === 'bulk' ? undefined : "Are you sure you want to delete this item?"} // Default desc otherwise
            />
        </div >
    );
}

