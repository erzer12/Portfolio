'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { saveExperience } from '@/app/actions';
import { Loader2 } from 'lucide-react';
import { Experience } from '@/hooks/use-data';

const schema = z.object({
    id: z.string().optional(),
    company: z.string().min(1, 'Company is required'),
    role: z.string().min(1, 'Role is required'),
    start: z.string().min(1, 'Start date is required'),
    end: z.string().optional(),
    description: z.string().min(1, 'Description is required'),
});

type FormData = z.infer<typeof schema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    experience?: Experience;
}

export default function ExperienceDialog({ open, onOpenChange, experience }: Props) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, reset, setValue } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            company: '',
            role: '',
            start: '',
            end: '',
            description: ''
        }
    });

    useEffect(() => {
        if (experience) {
            setValue('id', experience.id);
            setValue('company', experience.company);
            setValue('role', experience.role);
            setValue('start', experience.start);
            setValue('end', experience.end);
            setValue('description', experience.description);
        } else {
            reset({
                company: '',
                role: '',
                start: '',
                end: '',
                description: ''
            });
        }
    }, [experience, open, setValue, reset]);

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        const res = await saveExperience(data);
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
            <DialogContent className="sm:max-w-[425px] bg-black/90 border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle>{experience ? 'Edit Experience' : 'Add Experience'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input id="company" {...register('company')} className="bg-white/5 border-white/10" placeholder="Acme Inc." />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Input id="role" {...register('role')} className="bg-white/5 border-white/10" placeholder="Software Engineer" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="start">Start Date</Label>
                            <Input id="start" {...register('start')} className="bg-white/5 border-white/10" placeholder="Jan 2024" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="end">End Date</Label>
                            <Input id="end" {...register('end')} className="bg-white/5 border-white/10" placeholder="Present" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" {...register('description')} className="bg-white/5 border-white/10 min-h-[100px]" placeholder="Key responsibilities..." />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
