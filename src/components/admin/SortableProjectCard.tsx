'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { GripVertical, Edit, Trash2 } from 'lucide-react';
import { Project } from '@/hooks/use-data';

interface SortableProjectCardProps {
    project: Project;
    isSelected: boolean;
    onToggleSelect: () => void;
    onEdit: () => void;
    onDelete: () => void;
    isDragging?: boolean;
}

export function SortableProjectCard({
    project,
    isSelected,
    onToggleSelect,
    onEdit,
    onDelete,
}: SortableProjectCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: project.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 1000 : 'auto',
    };

    return (
        <Card
            ref={setNodeRef}
            style={style}
            className={`glass-card flex flex-col group relative overflow-hidden transition-all duration-200 ${isSelected ? 'ring-2 ring-primary bg-primary/10' : ''} ${isDragging ? 'shadow-2xl scale-105' : ''}`}
        >
            {project.image && (
                <div className="h-40 w-full overflow-hidden">
                    <img src={project.image} alt="" className="w-full h-full object-cover" />
                </div>
            )}

            {/* Drag Handle */}
            <button
                {...attributes}
                {...listeners}
                className="absolute top-2 left-10 z-20 p-1 rounded bg-black/50 hover:bg-black/70 cursor-grab active:cursor-grabbing touch-none"
                aria-label="Drag to reorder"
            >
                <GripVertical className="h-4 w-4 text-white/70" />
            </button>

            {/* Selection Checkbox */}
            <div className="absolute top-2 left-2 z-20">
                <Checkbox
                    checked={isSelected}
                    onCheckedChange={onToggleSelect}
                    className="bg-black/50 border-white/50 data-[state=checked]:bg-primary"
                />
            </div>

            {/* Action Buttons */}
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <Button size="icon" variant="secondary" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
                    <Edit className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="destructive" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>

            <CardHeader>
                <CardTitle>{project.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="line-clamp-3 text-sm text-white/70">{project.description}</p>
            </CardContent>
        </Card>
    );
}
