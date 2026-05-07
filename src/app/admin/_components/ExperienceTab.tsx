'use client';

import { useState, useTransition, useEffect } from 'react';
import { saveExperienceAction, deleteExperienceAction, updateExperienceOrderAction } from '@/app/actions';
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
import type { Experience } from '@/types';

type Props = { experience: Experience[] };

const EMPTY: Partial<Experience> = {
  company: '',
  role: '',
  employment_type: '',
  start_date: '',
  end_date: '',
  description: '',
  bullets: [],
  tags: [],
  certificate_url: '',
  recommendation_url: '',
  repo_url: '',
  related_projects: [],
  order: 0,
};

function SortableExperienceItem({ ex, onEdit, onDelete }: { ex: Experience; onEdit: (ex: Experience) => void; onDelete: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: ex.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="flex items-start gap-4 border-b border-[--rule] py-2 bg-[--bg]">
      <div {...attributes} {...listeners} className="cursor-grab text-[--ink-faint] hover:text-[--ink] active:cursor-grabbing px-2 pt-1">
        ☰
      </div>
      <div className="flex-1">
        <p className="text-[14px] font-medium text-[--ink]">{ex.company}</p>
        <p className="font-mono text-xs text-[--ink-muted]">
          {ex.role} {ex.employment_type ? `(${ex.employment_type})` : ''} · {ex.start_date}–{ex.end_date ?? 'Present'}
        </p>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onEdit(ex)} className="admin-btn-sm">Edit</button>
        <button onClick={() => onDelete(ex.id)} className="admin-btn-sm !border-red-300 !text-red-600">Del</button>
      </div>
    </div>
  );
}

export function ExperienceTab({ experience }: Props) {
  const [items, setItems] = useState(experience);
  const [editing, setEditing] = useState<Partial<Experience> | null>(null);
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState('');

  useEffect(() => { setItems(experience); }, [experience]);

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
      startTransition(() => { updateExperienceOrderAction(updates); });
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setEditing((prev) =>
      prev
        ? {
            ...prev,
            [name]:
              name === 'bullets' || name === 'tags' || name === 'related_projects'
                ? value.split('\n').map((v) => v.trim()).filter(Boolean)
                : name === 'order'
                  ? Number(value)
                  : value,
          }
        : prev,
    );
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    startTransition(async () => {
      try {
        await saveExperienceAction(editing);
        setMsg('Saved.');
        setEditing(null);
      } catch {
        setMsg('Error saving.');
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this experience?')) return;
    startTransition(async () => { await deleteExperienceAction(id); });
  }

  return (
    <div className="space-y-6">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {items.map((ex) => (
              <SortableExperienceItem key={ex.id} ex={ex} onEdit={(ex) => { setEditing(ex); setMsg(''); }} onDelete={handleDelete} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button onClick={() => { setEditing({ ...EMPTY, order: items.length }); setMsg(''); }} className="admin-btn">
        + Add Experience
      </button>

      {editing && (
        <form onSubmit={handleSave} className="space-y-4 border-t border-[--rule] pt-6">
          {[
            { label: 'Company', name: 'company' },
            { label: 'Role', name: 'role' },
            { label: 'Employment Type (e.g. Remote, Hybrid, On-site)', name: 'employment_type' },
            { label: 'Start Date', name: 'start_date' },
            { label: 'End Date (leave blank for Present)', name: 'end_date' },
            { label: 'Repository / Internship Repo URL', name: 'repo_url' },
            { label: 'Certificate URL', name: 'certificate_url' },
            { label: 'Recommendation Letter URL', name: 'recommendation_url' },
          ].map(({ label, name }) => (
            <div key={name}>
              <label className="mb-1 block font-mono text-xs uppercase tracking-[0.12em] text-[--ink-muted]">{label}</label>
              <input name={name} value={editing[name as keyof Experience] as string ?? ''} onChange={handleChange} className="admin-input" />
            </div>
          ))}
          <div>
            <label className="mb-1 block font-mono text-xs uppercase tracking-[0.12em] text-[--ink-muted]">
              Related Project Slugs (one per line)
            </label>
            <textarea
              name="related_projects"
              value={(editing.related_projects ?? []).join('\n')}
              onChange={handleChange}
              rows={2}
              placeholder="e.g. newshunt&#10;hr-agent"
              className="admin-input"
            />
            <p className="mt-1 font-mono text-xs text-[--ink-faint]">Use the slug from the Projects tab (e.g. &apos;newshunt&apos;)</p>
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs uppercase tracking-[0.12em] text-[--ink-muted]">Bullet Points (one per line)</label>
            <textarea name="bullets" value={(editing.bullets ?? []).join('\n')} onChange={handleChange} rows={4} className="admin-input" />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs uppercase tracking-[0.12em] text-[--ink-muted]">Tags (one per line)</label>
            <textarea name="tags" value={(editing.tags ?? []).join('\n')} onChange={handleChange} rows={3} className="admin-input" />
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
