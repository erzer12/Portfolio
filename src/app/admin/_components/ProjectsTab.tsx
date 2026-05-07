'use client';

import { useState, useTransition } from 'react';
import { saveProjectAction, deleteProjectAction } from '@/app/actions';
import type { Project } from '@/types';

type Props = { projects: Project[] };

const EMPTY: Partial<Project> = {
  title: '',
  slug: '',
  description: '',
  long_description: '',
  tags: [],
  github: '',
  live: '',
  category: '',
  date: '',
  featured: false,
  order: 0,
};

export function ProjectsTab({ projects }: Props) {
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState('');

  function handleEdit(p: Project) {
    setEditing({ ...p });
    setMsg('');
  }

  function handleNew() {
    setEditing({ ...EMPTY });
    setMsg('');
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    setEditing((prev) =>
      prev
        ? {
            ...prev,
            [name]:
              type === 'checkbox'
                ? (e.target as HTMLInputElement).checked
                : name === 'tags'
                  ? value.split(',').map((t) => t.trim())
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
    setMsg('');
    startTransition(async () => {
      try {
        await saveProjectAction(editing);
        setMsg('Saved.');
        setEditing(null);
      } catch {
        setMsg('Error saving.');
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this project?')) return;
    startTransition(async () => {
      await deleteProjectAction(id);
    });
  }

  return (
    <div className="space-y-6">
      {/* List */}
      <div className="space-y-2">
        {projects.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between gap-4 border-b border-[--rule] py-2"
          >
            <div>
              <p className="text-[14px] font-medium text-[--ink]">{p.title}</p>
              <p className="font-mono text-xs text-[--ink-muted]">
                {p.featured ? '★ Featured · ' : ''}
                {p.category} · {p.date}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(p)} className="admin-btn-sm">
                Edit
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="admin-btn-sm !border-red-300 !text-red-600"
              >
                Del
              </button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={handleNew} className="admin-btn">
        + Add Project
      </button>

      {/* Editor */}
      {editing && (
        <form
          onSubmit={handleSave}
          className="space-y-4 border-t border-[--rule] pt-6"
        >
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-[--ink-muted]">
            {editing.id ? 'Edit Project' : 'New Project'}
          </p>

          {[
            { label: 'Title', name: 'title' },
            { label: 'Slug (URL)', name: 'slug' },
            { label: 'Category', name: 'category' },
            { label: 'Date', name: 'date' },
            { label: 'GitHub URL', name: 'github' },
            { label: 'Live URL', name: 'live' },
          ].map(({ label, name }) => (
            <AdminField key={name} label={label}>
              <input
                name={name}
                value={editing[name as keyof Project] as string ?? ''}
                onChange={handleChange}
                className="admin-input"
              />
            </AdminField>
          ))}

          <AdminField label="Short Description (main page)">
            <textarea
              name="description"
              value={editing.description ?? ''}
              onChange={handleChange}
              rows={2}
              className="admin-input"
            />
          </AdminField>

          <AdminField label="Full Description (detail page)">
            <textarea
              name="long_description"
              value={editing.long_description ?? ''}
              onChange={handleChange}
              rows={5}
              className="admin-input"
            />
          </AdminField>

          <AdminField label="Tags (comma separated)">
            <input
              name="tags"
              value={(editing.tags ?? []).join(', ')}
              onChange={handleChange}
              className="admin-input"
            />
          </AdminField>

          <AdminField label="Sort Order">
            <input
              name="order"
              type="number"
              value={editing.order ?? 0}
              onChange={handleChange}
              className="admin-input"
            />
          </AdminField>

          <label className="flex items-center gap-2 font-mono text-xs text-[--ink]">
            <input
              name="featured"
              type="checkbox"
              checked={editing.featured ?? false}
              onChange={handleChange}
            />
            Featured on main page (top 3)
          </label>

          <div className="flex items-center gap-4">
            <button type="submit" disabled={isPending} className="admin-btn">
              {isPending ? 'Saving…' : 'Save'}
            </button>
            <button type="button" onClick={() => setEditing(null)} className="admin-btn-sm">
              Cancel
            </button>
            {msg && <p className="font-mono text-xs text-[--ink-muted]">{msg}</p>}
          </div>
        </form>
      )}
    </div>
  );
}

function AdminField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block font-mono text-xs uppercase tracking-[0.12em] text-[--ink-muted]">
        {label}
      </label>
      {children}
    </div>
  );
}
