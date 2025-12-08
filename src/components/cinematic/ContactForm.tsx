'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { sendEmail } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send } from 'lucide-react';

const contactSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
    });

    const onSubmit = async (data: ContactFormValues) => {
        setIsSubmitting(true);
        try {
            const result = await sendEmail(data);
            if (result.success) {
                toast({ title: 'Message Sent', description: result.message });
                reset();
            } else {
                toast({ title: 'Error', description: result.message, variant: 'destructive' });
            }
        } catch (error) {
            toast({ title: 'Error', description: 'Something went wrong. Please try again.', variant: 'destructive' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 w-full max-w-md mx-auto mt-12 text-left">
            <div className="space-y-2">
                <Input
                    {...register('name')}
                    placeholder="Your Name"
                    className="bg-transparent border-b border-white/20 border-t-0 border-x-0 rounded-none px-0 py-6 focus-visible:ring-0 focus-visible:border-white transition-colors placeholder:text-white/30 font-inter"
                />
                {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
                <Input
                    {...register('email')}
                    placeholder="Your Email"
                    className="bg-transparent border-b border-white/20 border-t-0 border-x-0 rounded-none px-0 py-6 focus-visible:ring-0 focus-visible:border-white transition-colors placeholder:text-white/30 font-inter"
                />
                {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
                <Textarea
                    {...register('message')}
                    placeholder="Your Message"
                    className="bg-transparent border-b border-white/20 border-t-0 border-x-0 rounded-none px-0 py-6 focus-visible:ring-0 focus-visible:border-white transition-colors placeholder:text-white/30 font-inter min-h-[100px] resize-none"
                />
                {errors.message && <p className="text-red-500 text-xs">{errors.message.message}</p>}
            </div>

            <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-black hover:bg-white/90 rounded-none py-6 font-playfair italic text-lg"
            >
                {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2 h-4 w-4" />}
                Send Message
            </Button>
        </form>
    );
}
