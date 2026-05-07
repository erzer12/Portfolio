'use client';

import { useState, useTransition, useEffect } from 'react';
import { saveProjectAction, deleteProjectAction, updateProjectsOrderAction, fetchGithubRepoAction } from '@/app/actions';
import { FileUpload } from '@/components/ui/FileUpload';
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
import type { Project } from '@/types';

type Props = { projects: Project[] };

const EMPTY: Partial<Project> = {
  title: '',
  slug: '',
  description: '',
  long_description: '',
  image: '',
  tags: [],
  github: '',
  live: '',
  category: '',
  date: '',
  featured: false,
  order: 0,
};

function SortableProjectItem({ p, onEdit, onDelete }: { p: Project; onEdit: (p: Project) => void; onDelete: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: p.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-4 border-b border-[--rule] py-2 bg-[--bg]">
      <div {...attributes} {...listeners} className="cursor-grab text-[--ink-faint] hover:text-[--ink] active:cursor-grabbing px-2">
        ☰
      </div>
      <div className="flex-1">
        <p className="text-[14px] font-medium text-[--ink]">{p.title}</p>
        <p className="font-mono text-xs text-[--ink-muted]">
          {p.featured ? '★ Featured · ' : ''}
          {p.category} · {p.date}
        </p>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onEdit(p)} className="admin-btn-sm">Edit</button>
        <button onClick={() => onDelete(p.id)} className="admin-btn-sm !border-red-300 !text-red-600">Del</button>
      </div>
    </div>
  );
}

export function ProjectsTab({ projects }: Props) {
  const [items, setItems] = useState(projects);
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [isFetchingGithub, setIsFetchingGithub] = useState(false);

  useEffect(() => { setItems(projects); }, [projects]);

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
      startTransition(() => { updateProjectsOrderAction(updates); });
    }
  }

  function handleEdit(p: Project) {
    setEditing({ ...p });
    setMsg('');
  }

  function handleNew() {
    setEditing({ ...EMPTY, order: items.length });
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

  function handleImageUpload(url: string) {
    setEditing((prev) => prev ? { ...prev, image: url } : prev);
  }

  async function handleGithubImport() {
    if (!githubUrl) return;
    setIsFetchingGithub(true);
    setMsg('');
    try {
      const data = await fetchGithubRepoAction(githubUrl);
      setEditing((prev) => prev ? {
        ...prev,
        title: prev.title || data.title,
        slug: prev.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: prev.description || data.description,
        github: data.github,
        tags: prev.tags?.length ? prev.tags : [data.language, ...data.tags].filter(Boolean),
      } : prev);
      setGithubUrl('');
    } catch (err: any) {
      setMsg(err.message || 'Failed to import from GitHub');
    } finally {
      setIsFetchingGithub(false);
    }
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
    startTransition(async () => { await deleteProjectAction(id); });
  }

  return (
    <div className="space-y-6">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {items.map((p) => (
              <SortableProjectItem key={p.id} p={p} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button onClick={handleNew} className="admin-btn">
        + Add Project
      </button>

      {editing && (
        <form onSubmit={handleSave} className="space-y-4 border-t border-[--rule] pt-6">
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-[--ink-muted]">
              {editing.id ? 'Edit Project' : 'New Project'}
            </p>
            <div className="flex gap-2 items-center">
              <input 
                value={githubUrl} 
                onChange={(e) => setGithubUrl(e.target.value)} 
                placeholder="https://github.com/..." 
                className="admin-input py-1 text-xs" 
              />
              <button type="button" onClick={handleGithubImport} disabled={isFetchingGithub} className="admin-btn-sm whitespace-nowrap">
                {isFetchingGithub ? 'Importing...' : 'Import GitHub'}
              </button>
            </div>
          </div>

          {[
            { label: 'Title', name: 'title' },
            { label: 'Slug (URL)', name: 'slug' },
            { label: 'Category', name: 'category' },
            { label: 'Date', name: 'date' },
            { label: 'GitHub URL', name: 'github' },
            { label: 'Live URL', name: 'live' },
          ].map(({ label, name }) => (
            <AdminField key={name} label={label}>
              <input name={name} value={editing[name as keyof Project] as string ?? ''} onChange={handleChange} className="admin-input" />
            </AdminField>
          ))}

          <AdminField label="Project Image">
            <div className="flex gap-4 items-start">
              <input name="image" value={editing.image ?? ''} onChange={handleChange} placeholder="https://..." className="admin-input flex-1" />
              <div className="w-48 shrink-0">
                <FileUpload onUploadSuccess={handleImageUpload} accept="image/*" label="Upload Image" />
              </div>
            </div>
          </AdminField>

          <AdminField label="Short Description (main page)">
            <textarea name="description" value={editing.description ?? ''} onChange={handleChange} rows={2} className="admin-input" />
          </AdminField>

          <AdminField label="Full Description (detail page)">
            <textarea name="long_description" value={editing.long_description ?? ''} onChange={handleChange} rows={5} className="admin-input" />
          </AdminField>

          <AdminField label="Tags (comma separated)">
            <input name="tags" value={(editing.tags ?? []).join(', ')} onChange={handleChange} className="admin-input" />
          </AdminField>

          <label className="flex items-center gap-2 font-mono text-xs text-[--ink]">
            <input name="featured" type="checkbox" checked={editing.featured ?? false} onChange={handleChange} />
            Featured on main page (top 3)
          </label>

          <div className="flex items-center gap-4">
            <button type="submit" disabled={isPending} className="admin-btn">
              {isPending ? 'Saving…' : 'Save'}
            </button>
            <button type="button" onClick={() => setEditing(null)} className="admin-btn-sm">Cancel</button>
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
      <label className="mb-1 block font-mono text-xs uppercase tracking-[0.12em] text-[--ink-muted]">{label}</label>
      {children}
    </div>
  );
}
