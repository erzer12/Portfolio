'use client';

import { useState, useTransition } from 'react';
import { saveExperienceAction, deleteExperienceAction } from '@/app/actions';
import type { Experience } from '@/types';

type Props = { experience: Experience[] };

const EMPTY: Partial<Experience> = {
  company: '',
  role: '',
  start_date: '',
  end_date: '',
  description: '',
  bullets: [],
  tags: [],
  order: 0,
};

export function ExperienceTab({ experience }: Props) {
  const [editing, setEditing] = useState<Partial<Experience> | null>(null);
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setEditing((prev) =>
      prev
        ? {
            ...prev,
            [name]:
              name === 'bullets' || name === 'tags'
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

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        {experience.map((ex) => (
          <div
            key={ex.id}
            className="flex items-start justify-between gap-4 border-b border-[--rule] py-2"
          >
            <div>
              <p className="text-[14px] font-medium text-[--ink]">{ex.company}</p>
              <p className="font-mono text-xs text-[--ink-muted]">
                {ex.role} · {ex.start_date}–{ex.end_date ?? 'Present'}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditing({ ...ex }); setMsg(''); }} className="admin-btn-sm">Edit</button>
              <button
                onClick={() => startTransition(() => deleteExperienceAction(ex.id))}
                className="admin-btn-sm !border-red-300 !text-red-600"
              >Del</button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => { setEditing({ ...EMPTY }); setMsg(''); }} className="admin-btn">
        + Add Experience
      </button>

      {editing && (
        <form onSubmit={handleSave} className="space-y-4 border-t border-[--rule] pt-6">
          {[
            { label: 'Company', name: 'company' },
            { label: 'Role', name: 'role' },
            { label: 'Start Date', name: 'start_date' },
            { label: 'End Date (leave blank for Present)', name: 'end_date' },
          ].map(({ label, name }) => (
            <div key={name}>
              <label className="mb-1 block font-mono text-xs uppercase tracking-[0.12em] text-[--ink-muted]">{label}</label>
              <input name={name} value={editing[name as keyof Experience] as string ?? ''} onChange={handleChange} className="admin-input" />
            </div>
          ))}
          <div>
            <label className="mb-1 block font-mono text-xs uppercase tracking-[0.12em] text-[--ink-muted]">Bullet Points (one per line)</label>
            <textarea name="bullets" value={(editing.bullets ?? []).join('\n')} onChange={handleChange} rows={4} className="admin-input" />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs uppercase tracking-[0.12em] text-[--ink-muted]">Tags (one per line)</label>
            <textarea name="tags" value={(editing.tags ?? []).join('\n')} onChange={handleChange} rows={3} className="admin-input" />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs uppercase tracking-[0.12em] text-[--ink-muted]">Sort Order (higher = more recent)</label>
            <input name="order" type="number" value={editing.order ?? 0} onChange={handleChange} className="admin-input" />
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
