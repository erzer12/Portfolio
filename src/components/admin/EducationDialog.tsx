'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { saveEducation } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Pencil } from 'lucide-react';

const educationSchema = z.object({
    id: z.string().optional(),
    school: z.string().min(1, 'School is required'),
    degree: z.string().min(1, 'Degree is required'),
    year: z.string().min(1, 'Year is required'),
    description: z.string().optional(),
    order: z.coerce.number().optional(),
});

type EducationFormValues = z.infer<typeof educationSchema>;

export default function EducationDialog({ education, trigger }: { education?: any, trigger?: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<EducationFormValues>({
        resolver: zodResolver(educationSchema),
        defaultValues: {
            school: '',
            degree: '',
            year: '',
            description: '',
        }
    });

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (isOpen) {
            if (education) {
                setValue('id', education.id);
                setValue('school', education.school);
                setValue('degree', education.degree);
                setValue('year', education.year);
                setValue('description', education.description || '');
                setValue('order', education.order);
            } else {
                reset({
                    school: '',
                    degree: '',
                    year: '',
                    description: '',
                });
            }
        }
    };

    const onSubmit = async (data: EducationFormValues) => {
        setIsSaving(true);
        const res = await saveEducation(data);
        setIsSaving(false);
        if (res.success) {
            toast({ title: "Success", description: res.message });
            setOpen(false);
            reset();
        } else {
            toast({ title: "Error", description: res.message, variant: "destructive" });
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {trigger || (
                    education ?
                        <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button> :
                        <Button className="bg-white text-black hover:bg-white/90"><Plus className="mr-2 h-4 w-4" /> Add Education</Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-neutral-900 text-white border-white/10">
                <DialogHeader>
                    <DialogTitle>{education ? 'Edit Education' : 'Add Education'}</DialogTitle>
                    <DialogDescription>
                        Add your academic background here.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="school">School / University</Label>
                        <Input id="school" {...register('school')} className="bg-white/5 border-white/10" placeholder="University of Technology" />
                        {errors.school && <p className="text-red-500 text-xs">{errors.school.message}</p>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="degree">Degree</Label>
                        <Input id="degree" {...register('degree')} className="bg-white/5 border-white/10" placeholder="B.S. Computer Science" />
                        {errors.degree && <p className="text-red-500 text-xs">{errors.degree.message}</p>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="year">Year / Duration</Label>
                        <Input id="year" {...register('year')} className="bg-white/5 border-white/10" placeholder="2018 - 2022" />
                        {errors.year && <p className="text-red-500 text-xs">{errors.year.message}</p>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Textarea id="description" {...register('description')} className="bg-white/5 border-white/10 h-20" placeholder="Brief details about your studies..." />
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={isSaving} className="bg-white text-black hover:bg-gray-200">
                            {isSaving && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
