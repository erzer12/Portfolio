import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
import { Loader2, Upload } from 'lucide-react';
import { saveProject } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const projectSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    image: z.string().optional(),
    tags: z.string().min(1, 'Enter tags as comma-separated values.'),
    github: z.string().optional().or(z.literal('')),
    live: z.string().optional().or(z.literal('')),
    aiHint: z.string().optional(),
    order: z.coerce.number().optional(),
});

interface ProjectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    project?: any;
    onSave?: () => void;
}

export default function ProjectDialog({ open, onOpenChange, project, onSave }: ProjectDialogProps) {
    const { toast } = useToast();
    const [isUploading, setIsUploading] = useState(false);
    const [isResolving, setIsResolving] = useState(false);
    const form = useForm<z.infer<typeof projectSchema>>({
        resolver: zodResolver(projectSchema),
        defaultValues: { id: '', title: '', description: '', image: '', tags: '', github: '', live: '', aiHint: '', order: 0 },
    });

    useEffect(() => {
        if (project) {
            form.reset({
                id: project.id,
                title: project.title,
                description: project.description,
                image: project.image || '',
                tags: Array.isArray(project.tags) ? project.tags.join(', ') : project.tags,
                github: project.github || '',
                live: project.live || '',
                aiHint: project.aiHint || '',
                order: project.order || 0,
            });
        } else {
            form.reset({ id: '', title: '', description: '', image: '', tags: '', github: '', live: '', aiHint: '', order: 0 });
        }
    }, [project, form, open]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            if (process.env.NODE_ENV === 'development') console.log("Starting upload...", file.name);

            // Create FormData for local API upload
            const formData = new FormData();
            formData.append('file', file);

            // Get access code from sessionStorage (admin should be authenticated)
            const accessCode = sessionStorage.getItem('admin_auth') === 'true'
                ? process.env.NEXT_PUBLIC_ADMIN_CODE || prompt('Enter access code:')
                : prompt('Enter access code:');

            // Send to local API with authentication
            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'x-access-code': accessCode || '',
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Upload failed');
            }

            const downloadURL = data.url;
            if (process.env.NODE_ENV === 'development') console.log("URL retrieved:", downloadURL);

            // Force update form state with validation options
            form.setValue('image', downloadURL, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true
            });
            if (process.env.NODE_ENV === 'development') console.log("Form 'image' field updated to:", form.getValues('image'));

            toast({ title: "Success", description: "Image saved to public/images/" });
        } catch (error) {
            console.error("Upload failed details:", error);
            toast({ variant: "destructive", title: "Error", description: `Upload failed: ${(error as Error).message}` });
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (values: z.infer<typeof projectSchema>) => {
        const projectData = {
            ...values,
            tags: values.tags.split(',').map(s => s.trim()).filter(Boolean),
        };

        const result = await saveProject(projectData);
        if (result.success) {
            toast({ title: "Success", description: result.message });
            onOpenChange(false);
            if (onSave) onSave();
        } else {
            toast({ variant: "destructive", title: "Error", description: result.message });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-black/90 border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle>{project ? 'Edit Project' : 'Add New Project'}</DialogTitle>
                    <DialogDescription>
                        Fill in the details for your project.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} className="bg-white/5 border-white/10" /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} className="bg-white/5 border-white/10" /></FormControl><FormMessage /></FormItem>
                        )} />

                        <div className="space-y-2">
                            <FormLabel>Project Image</FormLabel>
                            <div className="flex gap-4 items-center">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="bg-white/5 border-white/10 file:text-white file:bg-white/10 file:border-0 file:rounded-md file:px-2 file:mr-4 hover:file:bg-white/20"
                                />
                                {(isUploading || isResolving) && <Loader2 className="animate-spin h-5 w-5" />}
                            </div>
                            <FormField control={form.control} name="image" render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Enter Image URL (Auto-resolves hosting links)"
                                            className="bg-white/5 border-white/10"
                                            onBlur={async (e) => {
                                                field.onBlur(); // Call original handler
                                                const url = e.target.value;
                                                if (url && !url.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
                                                    setIsResolving(true);
                                                    const { extractOgImage } = await import('@/app/actions');
                                                    const directUrl = await extractOgImage(url);
                                                    if (directUrl) {
                                                        form.setValue('image', directUrl, { shouldValidate: true, shouldDirty: true });
                                                        toast({ title: "Link Resolved", description: "Expanded to direct image URL." });
                                                    }
                                                    setIsResolving(false);
                                                }
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            {form.watch('image') && (
                                <div className="mt-2 relative h-40 w-full overflow-hidden rounded-md border border-white/10">
                                    <img src={form.watch('image')} alt="Preview" className="h-full w-full object-cover" />
                                </div>
                            )}
                        </div>

                        <FormField control={form.control} name="tags" render={({ field }) => (
                            <FormItem><FormLabel>Tags (comma-separated)</FormLabel><FormControl><Input {...field} placeholder="React, Next.js" className="bg-white/5 border-white/10" /></FormControl><FormMessage /></FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="github" render={({ field }) => (
                                <FormItem><FormLabel>GitHub URL</FormLabel><FormControl><Input {...field} className="bg-white/5 border-white/10" /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="live" render={({ field }) => (
                                <FormItem><FormLabel>Live URL</FormLabel><FormControl><Input {...field} className="bg-white/5 border-white/10" /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="aiHint" render={({ field }) => (
                                <FormItem><FormLabel>AI Image Hint (Optional)</FormLabel><FormControl><Input {...field} className="bg-white/5 border-white/10" /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="order" render={({ field }) => (
                                <FormItem><FormLabel>Order</FormLabel><FormControl><Input type="number" {...field} className="bg-white/5 border-white/10" /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                            <Button type="submit" disabled={form.formState.isSubmitting || isUploading}>
                                {(form.formState.isSubmitting || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
