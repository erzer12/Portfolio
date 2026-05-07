'use client';

import { useState, useTransition, useEffect } from 'react';
import { saveSkillAction, deleteSkillAction, updateSkillsOrderAction } from '@/app/actions';
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
import type { Skill } from '@/types';

type Props = { skills: Skill[] };

const EMPTY: Partial<Skill> = {
  category: '',
  skills: [],
  order: 0,
};

function SortableSkillItem({ s, onEdit, onDelete }: { s: Skill; onEdit: (s: Skill) => void; onDelete: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: s.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center justify-between gap-4 border-b border-[--rule] py-2 bg-[--bg]">
      <div className="flex items-center gap-4 flex-1">
        <div {...attributes} {...listeners} className="cursor-grab text-[--ink-faint] hover:text-[--ink] active:cursor-grabbing px-2">
          ☰
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.1em] text-[--ink-muted]">
            {s.category}
          </p>
          <p className="text-[14px] text-[--ink]">{s.skills.join(' · ')}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onEdit(s)} className="admin-btn-sm">Edit</button>
        <button onClick={() => onDelete(s.id)} className="admin-btn-sm !border-red-300 !text-red-600">Del</button>
      </div>
    </div>
  );
}

export function SkillsTab({ skills }: Props) {
  const [items, setItems] = useState(skills);
  const [editing, setEditing] = useState<Partial<Skill> | null>(null);
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState('');

  useEffect(() => { setItems(skills); }, [skills]);

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
      startTransition(() => { updateSkillsOrderAction(updates); });
    }
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    startTransition(async () => {
      try {
        await saveSkillAction(editing);
        setMsg('Saved.');
        setEditing(null);
      } catch {
        setMsg('Error saving.');
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this skill category?')) return;
    startTransition(async () => { await deleteSkillAction(id); });
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setEditing((prev) =>
      prev
        ? {
            ...prev,
            [name]:
              name === 'skills'
                ? value.split(',').map((s) => s.trim())
                : value,
          }
        : prev,
    );
  }

  return (
    <div className="space-y-6">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {items.map((s) => (
              <SortableSkillItem key={s.id} s={s} onEdit={(s) => { setEditing(s); setMsg(''); }} onDelete={handleDelete} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button onClick={() => { setEditing({ ...EMPTY, order: items.length }); setMsg(''); }} className="admin-btn">
        + Add Category
      </button>

      {editing && (
        <form onSubmit={handleSave} className="space-y-4 border-t border-[--rule] pt-6">
          {[{ label: 'Category', name: 'category' }].map(({ label, name }) => (
            <div key={name}>
              <label className="mb-1 block font-mono text-xs uppercase tracking-[0.12em] text-[--ink-muted]">{label}</label>
              <input name={name} value={editing[name as keyof Skill] as string ?? ''} onChange={handleChange} className="admin-input" />
            </div>
          ))}
          <div>
            <label className="mb-1 block font-mono text-xs uppercase tracking-[0.12em] text-[--ink-muted]">Skills (comma separated)</label>
            <input name="skills" value={(editing.skills ?? []).join(', ')} onChange={handleChange} className="admin-input" />
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
