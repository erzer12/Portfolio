'use client';

import { useState, useTransition } from 'react';
import { saveSkillAction, deleteSkillAction } from '@/app/actions';
import type { Skill } from '@/types';

type Props = { skills: Skill[] };

export function SkillsTab({ skills }: Props) {
  const [editing, setEditing] = useState<Partial<Skill> | null>(null);
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState('');

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

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setEditing((prev) =>
      prev
        ? {
            ...prev,
            [name]:
              name === 'skills'
                ? value.split(',').map((s) => s.trim())
                : name === 'order'
                  ? Number(value)
                  : value,
          }
        : prev,
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        {skills.map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between gap-4 border-b border-[--rule] py-2"
          >
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.1em] text-[--ink-muted]">
                {s.category}
              </p>
              <p className="text-[14px] text-[--ink]">{s.skills.join(' · ')}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditing({ ...s }); setMsg(''); }} className="admin-btn-sm">Edit</button>
              <button
                onClick={() => startTransition(() => deleteSkillAction(s.id))}
                className="admin-btn-sm !border-red-300 !text-red-600"
              >
                Del
              </button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => setEditing({ category: '', skills: [], order: 0 })} className="admin-btn">
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
          <div>
            <label className="mb-1 block font-mono text-xs uppercase tracking-[0.12em] text-[--ink-muted]">Order</label>
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
