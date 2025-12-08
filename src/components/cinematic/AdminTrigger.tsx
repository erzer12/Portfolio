'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function AdminTrigger() {
    const router = useRouter();
    const { toast } = useToast();
    const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!e.key) return; // Safety check
            setKeysPressed((prev) => {
                const newSet = new Set(prev);
                newSet.add(e.key.toLowerCase());
                return newSet;
            });
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (!e.key) return; // Safety check
            setKeysPressed((prev) => {
                const newSet = new Set(prev);
                newSet.delete(e.key.toLowerCase());
                return newSet;
            });
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    useEffect(() => {
        if (
            keysPressed.has('shift') &&
            keysPressed.has('a') &&
            keysPressed.has('d')
        ) {
            toast({ title: "Admin Sequence Initiated", description: "Redirecting to command center..." });
            router.push('/admin');
            setKeysPressed(new Set()); // Reset
        }
    }, [keysPressed, router, toast]);

    return null;
}
