'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { saveCertification } from '@/app/actions';
import { Loader2 } from 'lucide-react';
import { Certification } from '@/hooks/use-data';

const schema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Name is required'),
    issuer: z.string().min(1, 'Issuer is required'),
    date: z.string().min(1, 'Date is required'),
    link: z.string().optional(),
    image: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    certification?: Certification;
}

export default function CertificationDialog({ open, onOpenChange, certification }: Props) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isResolving, setIsResolving] = useState(false);

    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            issuer: '',
            date: '',
            link: '',
            image: ''
        }
    });

    useEffect(() => {
        if (certification) {
            setValue('id', certification.id);
            setValue('name', certification.name);
            setValue('issuer', certification.issuer);
            setValue('date', certification.date);
            setValue('link', certification.link);
            setValue('image', certification.image || '');
        } else {
            reset({
                name: '',
                issuer: '',
                date: '',
                link: '',
                image: ''
            });
        }
    }, [certification, open, setValue, reset]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            console.log("Starting upload...", file.name);

            // Create FormData for local API upload
            const formData = new FormData();
            formData.append('file', file);

            // Send to local API
            const response = await fetch('/api/upload', {
                method: 'POST',
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
            console.log("URL retrieved:", downloadURL);

            // Force update form state with validation options
            setValue('image', downloadURL, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true
            });

            toast({ title: "Success", description: "Badge image saved locally." });
        } catch (error) {
            console.error("Upload failed details:", error);
            toast({ variant: "destructive", title: "Error", description: `Upload failed: ${(error as Error).message}` });
        } finally {
            setIsUploading(false);
        }
    };

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        const res = await saveCertification(data);
        setIsSubmitting(false);

        if (res.success) {
            toast({ title: 'Success', description: res.message });
            onOpenChange(false);
        } else {
            toast({ title: 'Error', description: res.message, variant: 'destructive' });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-black/90 border-white/10 text-white max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{certification ? 'Edit Certification' : 'Add Certification'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" {...register('name')} className="bg-white/5 border-white/10" placeholder="AWS Certified..." />
                        {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="issuer">Issuer</Label>
                        <Input id="issuer" {...register('issuer')} className="bg-white/5 border-white/10" placeholder="Amazon Web Services" />
                        {errors.issuer && <p className="text-red-500 text-xs">{errors.issuer.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input id="date" {...register('date')} className="bg-white/5 border-white/10" placeholder="Aug 2025" />
                        {errors.date && <p className="text-red-500 text-xs">{errors.date.message}</p>}
                    </div>

                    {/* Image Upload Section */}
                    <div className="space-y-2">
                        <Label htmlFor="image">Badge Image</Label>
                        <div className="flex gap-4 items-center">
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="bg-white/5 border-white/10 file:text-white file:bg-white/10 file:border-0 file:rounded-md file:px-2 file:mr-4 hover:file:bg-white/20"
                            />
                            {(isUploading || isResolving) && <Loader2 className="animate-spin h-5 w-5" />}
                        </div>

                        <Input
                            id="image"
                            {...register('image')}
                            className="bg-white/5 border-white/10"
                            placeholder="Or enter Image URL (Auto-resolves hosting links)"
                            onBlur={async (e) => {
                                const url = e.target.value;
                                if (url && !url.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
                                    setIsResolving(true);
                                    try {
                                        const { extractOgImage } = await import('@/app/actions');
                                        const directUrl = await extractOgImage(url);
                                        if (directUrl) {
                                            setValue('image', directUrl, { shouldValidate: true, shouldDirty: true });
                                            toast({ title: "Link Resolved", description: "Expanded to direct image URL." });
                                        }
                                    } catch (err) {
                                        console.error("Failed to resolve URL", err);
                                    } finally {
                                        setIsResolving(false);
                                    }
                                }
                            }}
                        />
                        {watch('image') && (
                            <div className="mt-2 relative h-20 w-20 overflow-hidden rounded-md border border-white/10">
                                <img src={watch('image')} alt="Preview" className="h-full w-full object-cover" />
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="link">Validation Link (Optional)</Label>
                        <Input id="link" {...register('link')} className="bg-white/5 border-white/10" placeholder="https://credly.com/..." />
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={isSubmitting || isUploading}>
                            {(isSubmitting || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
