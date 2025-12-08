'use client';

import { useEffect } from 'react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2 } from 'lucide-react';
import { saveSkill } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

const skillSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, 'Title is required'),
    icon: z.string().min(1, 'Icon is required'),
    skills: z.string().min(3, 'Enter skills as comma-separated values.'),
});

interface SkillDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    skill?: any; // Using any for simplicity matching the existing type structure, or define a proper type
    onSave?: () => void;
}

export default function SkillDialog({ open, onOpenChange, skill, onSave }: SkillDialogProps) {
    const { toast } = useToast();
    const form = useForm<z.infer<typeof skillSchema>>({
        resolver: zodResolver(skillSchema),
        defaultValues: { id: '', title: '', icon: '', skills: '' },
    });

    useEffect(() => {
        if (skill) {
            form.reset({
                id: skill.id,
                title: skill.title,
                icon: skill.icon,
                skills: Array.isArray(skill.skills) ? skill.skills.join(', ') : skill.skills,
            });
        } else {
            form.reset({ id: '', title: '', icon: '', skills: '' });
        }
    }, [skill, form, open]);

    const handleSubmit = async (values: z.infer<typeof skillSchema>) => {
        const skillData = {
            ...values,
            skills: values.skills.split(',').map(s => s.trim()).filter(Boolean),
        };

        const result = await saveSkill(skillData);
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
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{skill ? 'Edit Skill Category' : 'Add New Skill Category'}</DialogTitle>
                    <DialogDescription>
                        Configure the skill category and its items.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl><Input {...field} placeholder="e.g. Frontend" /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="icon" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Icon</FormLabel>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select an icon" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="BrainCircuit">BrainCircuit</SelectItem>
                                        <SelectItem value="Bot">Bot</SelectItem>
                                        <SelectItem value="TerminalSquare">TerminalSquare</SelectItem>
                                        <SelectItem value="Code2">Code2</SelectItem>
                                        <SelectItem value="Database">Database</SelectItem>
                                        <SelectItem value="Layout">Layout</SelectItem>
                                        <SelectItem value="Smartphone">Smartphone</SelectItem>
                                        <SelectItem value="Globe">Globe</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="skills" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Skills (comma-separated)</FormLabel>
                                <FormControl><Textarea {...field} placeholder="React, Next.js, TypeScript" /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
