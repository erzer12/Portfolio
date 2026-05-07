'use client';

import { useState, useTransition } from 'react';
import { saveEducationAction, deleteEducationAction } from '@/app/actions';
import type { Education } from '@/types';

type Props = { education: Education[] };

export function EducationTab({ education }: Props) {
  const [editing, setEditing] = useState<Partial<Education> | null>(null);
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState('');

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

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        {education.map((edu) => (
          <div key={edu.id} className="flex items-start justify-between gap-4 border-b border-[--rule] py-2">
            <div>
              <p className="text-[14px] font-medium text-[--ink]">{edu.school}</p>
              <p className="font-mono text-xs text-[--ink-muted]">{edu.degree} · {edu.year}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditing({ ...edu }); setMsg(''); }} className="admin-btn-sm">Edit</button>
              <button onClick={() => startTransition(() => deleteEducationAction(edu.id))} className="admin-btn-sm !border-red-300 !text-red-600">Del</button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => { setEditing({ school: '', degree: '', year: '', order: 0 }); setMsg(''); }} className="admin-btn">+ Add Education</button>

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
          <div>
            <label className="mb-1 block font-mono text-xs uppercase tracking-[0.12em] text-[--ink-muted]">Sort Order</label>
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
