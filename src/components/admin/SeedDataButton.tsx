"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Database, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RESUME_DATA } from '@/data/resume';
import { saveProject, saveSkill, saveExperience, saveCertification, saveProfile, saveEducation } from '@/app/actions';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export type SeedContentType = 'profile' | 'projects' | 'skills' | 'experience' | 'certifications' | 'education' | 'testimonials';

interface SeedDataButtonProps {
    contentType: SeedContentType;
    className?: string;
}

export default function SeedDataButton({ contentType, className }: SeedDataButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const getLabel = () => {
        switch (contentType) {
            case 'profile': return 'Seed Profile';
            case 'projects': return 'Seed Projects';
            case 'skills': return 'Seed Skills';
            case 'experience': return 'Seed Experience';
            case 'certifications': return 'Seed Certifications';
            case 'education': return 'Seed Education';
            default: return 'Seed Data';
        }
    };

    const handleSeed = async () => {
        setIsLoading(true);
        try {
            switch (contentType) {
                case 'profile':
                    await saveProfile({
                        name: RESUME_DATA.name,
                        tagline: RESUME_DATA.tagline,
                        summary: RESUME_DATA.summary,
                        location: RESUME_DATA.location,
                        email: RESUME_DATA.contact.email,
                        phone: RESUME_DATA.contact.phone,
                        social: {
                            github: RESUME_DATA.contact.social.find(s => s.name === 'GitHub')?.url || '',
                            linkedin: RESUME_DATA.contact.social.find(s => s.name === 'LinkedIn')?.url || '',
                            website: RESUME_DATA.contact.social.find(s => s.name === 'Website')?.url || '',
                            email: RESUME_DATA.contact.social.find(s => s.name === 'Email')?.url || '',
                        }
                    });
                    break;

                case 'projects':
                    for (const project of RESUME_DATA.projects) {
                        await saveProject({
                            title: project.title,
                            description: project.description,
                            image: '',
                            tags: project.tech,
                            github: project.links.github,
                            live: project.links.demo,
                            aiHint: 'Imported from resume.ts',
                            order: 0
                        });
                    }
                    break;

                case 'skills':
                    const skillGroups = [
                        { title: 'Languages', icons: 'Code2', skills: RESUME_DATA.skills.languages },
                        { title: 'Frontend', icons: 'Layout', skills: RESUME_DATA.skills.frontend },
                        { title: 'Backend', icons: 'Server', skills: RESUME_DATA.skills.backend },
                        { title: 'AI & ML', icons: 'Brain', skills: RESUME_DATA.skills.ai },
                        { title: 'Tools', icons: 'Wrench', skills: RESUME_DATA.skills.tools },
                    ];
                    for (const group of skillGroups) {
                        await saveSkill({
                            title: group.title,
                            icon: group.icons,
                            skills: group.skills
                        });
                    }
                    break;

                case 'experience':
                    for (const job of RESUME_DATA.workExperience) {
                        await saveExperience({
                            company: job.company,
                            role: job.role,
                            start: job.date.split(' - ')[0] || job.date,
                            end: job.date.split(' - ')[1] || 'Present',
                            description: job.description
                        });
                    }
                    break;

                case 'certifications':
                    for (const cert of RESUME_DATA.certifications) {
                        await saveCertification({
                            name: cert.name,
                            issuer: cert.issuer,
                            date: cert.date,
                            link: cert.link
                        });
                    }
                    break;

                case 'education':
                    for (const edu of RESUME_DATA.education) {
                        await saveEducation({
                            school: edu.school,
                            degree: edu.degree,
                            year: edu.year,
                            description: edu.grade ? `Grade: ${edu.grade}` : ''
                        });
                    }
                    break;
                case 'testimonials':
                    // Optional: Seed testimonials if available in RESUME_DATA in the future
                    toast({ title: "Info", description: "No static testimonials to seed yet." });
                    break;
            }

            toast({ title: "Success", description: `${contentType.charAt(0).toUpperCase() + contentType.slice(1)} seeded successfully!` });
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to seed data.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={isLoading} className={className}>
                    {isLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Database className="mr-2 h-4 w-4" />}
                    {getLabel()}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-black/90 border-white/10 text-white">
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription className="text-white/70">
                        This action will overwrite or add to your existing <strong>{contentType}</strong> data in the database using the initial data from <code>resume.ts</code>.
                        <br /><br />
                        This cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="bg-transparent border-white/10 text-white hover:bg-white/10 hover:text-white">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSeed} className="bg-white text-black hover:bg-white/90">Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
