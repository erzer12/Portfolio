'use client';

import { useState, useTransition, useEffect } from 'react';
import { saveCertificationAction, deleteCertificationAction, updateCertificationsOrderAction } from '@/app/actions';
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
import type { Certification } from '@/types';

type Props = { certifications: Certification[] };

const EMPTY: Partial<Certification> = {
  name: '',
  issuer: '',
  date: '',
  link: '',
  order: 0,
};

function SortableCertificationItem({ cert, onEdit, onDelete }: { cert: Certification; onEdit: (cert: Certification) => void; onDelete: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: cert.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center justify-between gap-4 border-b border-[--rule] py-2 bg-[--bg]">
      <div className="flex items-start gap-4 flex-1">
        <div {...attributes} {...listeners} className="cursor-grab text-[--ink-faint] hover:text-[--ink] active:cursor-grabbing px-2 pt-1">
          ☰
        </div>
        <div>
          <p className="text-[14px] font-medium text-[--ink]">{cert.name}</p>
          <p className="font-mono text-xs text-[--ink-muted]">{cert.issuer} · {cert.date}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onEdit(cert)} className="admin-btn-sm">Edit</button>
        <button onClick={() => onDelete(cert.id)} className="admin-btn-sm !border-red-300 !text-red-600">Del</button>
      </div>
    </div>
  );
}

export function CertificationsTab({ certifications }: Props) {
  const [items, setItems] = useState(certifications);
  const [editing, setEditing] = useState<Partial<Certification> | null>(null);
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState('');

  useEffect(() => { setItems(certifications); }, [certifications]);

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
      startTransition(() => { updateCertificationsOrderAction(updates); });
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setEditing((prev) => prev ? { ...prev, [name]: name === 'order' ? Number(value) : value } : prev);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    startTransition(async () => {
      try {
        await saveCertificationAction(editing);
        setMsg('Saved.');
        setEditing(null);
      } catch { setMsg('Error saving.'); }
    });
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this certification?')) return;
    startTransition(async () => { await deleteCertificationAction(id); });
  }

  return (
    <div className="space-y-6">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {items.map((cert) => (
              <SortableCertificationItem key={cert.id} cert={cert} onEdit={(cert) => { setEditing(cert); setMsg(''); }} onDelete={handleDelete} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button onClick={() => { setEditing({ ...EMPTY, order: items.length }); setMsg(''); }} className="admin-btn">+ Add Certification</button>

      {editing && (
        <form onSubmit={handleSave} className="space-y-4 border-t border-[--rule] pt-6">
          {[
            { label: 'Name', name: 'name' },
            { label: 'Issuer', name: 'issuer' },
            { label: 'Date', name: 'date' },
            { label: 'Verification URL', name: 'link' },
          ].map(({ label, name }) => (
            <div key={name}>
              <label className="mb-1 block font-mono text-xs uppercase tracking-[0.12em] text-[--ink-muted]">{label}</label>
              <input name={name} value={editing[name as keyof Certification] as string ?? ''} onChange={handleChange} className="admin-input" />
            </div>
          ))}
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
