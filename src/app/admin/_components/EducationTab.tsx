'use client';

import { useState, useTransition, useEffect } from 'react';
import { saveEducationAction, deleteEducationAction, updateEducationOrderAction } from '@/app/actions';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Education } from '@/types';

type Props = { education: Education[] };

const EMPTY: Partial<Education> = {
  school: '',
  degree: '',
  year: '',
  description: '',
  order: 0,
};

function SortableEducationItem({ edu, onEdit, onDelete }: { edu: Education; onEdit: (edu: Education) => void; onDelete: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: edu.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center justify-between gap-4 border-b border-[--rule] py-2 bg-[--bg]">
      <div className="flex items-start gap-4 flex-1">
        <div {...attributes} {...listeners} className="cursor-grab text-[--ink-faint] hover:text-[--ink] active:cursor-grabbing px-2 pt-1">
          ☰
        </div>
        <div>
          <p className="text-[14px] font-medium text-[--ink]">{edu.school}</p>
          <p className="font-mono text-xs text-[--ink-muted]">{edu.degree} · {edu.year}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onEdit(edu)} className="admin-btn-sm">Edit</button>
        <button onClick={() => onDelete(edu.id)} className="admin-btn-sm !border-red-300 !text-red-600">Del</button>
      </div>
    </div>
  );
}

export function EducationTab({ education }: Props) {
  const [items, setItems] = useState(education);
  const [editing, setEditing] = useState<Partial<Education> | null>(null);
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState('');

  useEffect(() => { setItems(education); }, [education]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);

      const updates = newItems.map((item, index) => ({ id: item.id, order: index }));
      startTransition(() => { updateEducationOrderAction(updates); });
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setEditing((prev) => prev ? { ...prev, [name]: name === 'order' ? Number(value) : value } : prev);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    startTransition(async () => {
      try {
        await saveEducationAction(editing);
        setMsg('Saved.');
        setEditing(null);
      } catch { setMsg('Error saving.'); }
    });
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this education?')) return;
    startTransition(async () => { await deleteEducationAction(id); });
  }

  return (
    <div className="space-y-6">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {items.map((edu) => (
              <SortableEducationItem key={edu.id} edu={edu} onEdit={(edu) => { setEditing(edu); setMsg(''); }} onDelete={handleDelete} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button onClick={() => { setEditing({ ...EMPTY, order: items.length }); setMsg(''); }} className="admin-btn">+ Add Education</button>

      {editing && (
        <form onSubmit={handleSave} className="space-y-4 border-t border-[--rule] pt-6">
          {[
            { label: 'School', name: 'school' },
            { label: 'Degree & Grade', name: 'degree' },
            { label: 'Year', name: 'year' },
          ].map(({ label, name }) => (
            <div key={name}>
              <label className="mb-1 block font-mono text-xs uppercase tracking-[0.12em] text-[--ink-muted]">{label}</label>
              <input name={name} value={editing[name as keyof Education] as string ?? ''} onChange={handleChange} className="admin-input" />
            </div>
          ))}
          <div>
            <label className="mb-1 block font-mono text-xs uppercase tracking-[0.12em] text-[--ink-muted]">Notes (optional)</label>
            <textarea name="description" value={editing.description ?? ''} onChange={handleChange} rows={2} className="admin-input" />
          </div>
          <div className="flex items-center gap-4">
            <button type="submit" disabled={isPending} className="admin-btn">{isPending ? 'Saving…' : 'Save'}</button>
            <button type="button" onClick={() => setEditing(null)} className="admin-btn-sm">Cancel</button>
            {msg && <p className="font-mono text-xs text-[--ink-muted]">{msg}</p>}
          </div>
        </form>
      )}
    </div>
  );
}
