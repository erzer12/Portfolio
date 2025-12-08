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
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { saveTestimonial } from '@/app/actions';
import { Loader2 } from 'lucide-react';

// Type from actions (replicated here for simplicity or import if shared)
const schema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Name is required'),
    role: z.string().min(1, 'Role is required'),
    message: z.string().min(1, 'Message is required'),
    rating: z.number().min(1).max(5).default(5),
    approved: z.boolean().default(true), // Default to approved when adding from admin
});

type FormData = z.infer<typeof schema>;

// Manual Type definition to avoid circular hook dependency issues if any
type Testimonial = {
    id: string;
    name: string;
    role: string;
    message: string;
    rating: number;
    approved: boolean;
    createdAt: any;
};

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    testimonial?: Testimonial;
}

export default function TestimonialDialog({ open, onOpenChange, testimonial }: Props) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, reset, setValue, watch } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            role: '',
            message: '',
            rating: 5,
            approved: true
        }
    });

    const approved = watch('approved');

    useEffect(() => {
        if (testimonial) {
            setValue('id', testimonial.id);
            setValue('name', testimonial.name);
            setValue('role', testimonial.role);
            setValue('message', testimonial.message);
            setValue('rating', testimonial.rating);
            setValue('approved', testimonial.approved);
        } else {
            reset({
                name: '',
                role: '',
                message: '',
                rating: 5,
                approved: true
            });
        }
    }, [testimonial, open, setValue, reset]);

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        const res = await saveTestimonial(data);
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
                    <DialogTitle>{testimonial ? 'Edit Recommendation' : 'Add Recommendation'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" {...register('name')} className="bg-white/5 border-white/10" placeholder="Jane Doe" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="role">Role / Company</Label>
                        <Input id="role" {...register('role')} className="bg-white/5 border-white/10" placeholder="CEO at Startup" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea id="message" {...register('message')} className="bg-white/5 border-white/10 min-h-[100px]" placeholder="Harshil is amazing..." />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <Label htmlFor="rating">Rating (1-5)</Label>
                            <Input type="number" id="rating" {...register('rating', { valueAsNumber: true })} className="bg-white/5 border-white/10 w-20" min={1} max={5} />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="approved"
                                checked={approved}
                                onCheckedChange={(c) => setValue('approved', c)}
                            />
                            <Label htmlFor="approved">Approved</Label>
                        </div>
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
