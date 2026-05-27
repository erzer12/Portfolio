'use client';

import { useState, useTransition, useEffect } from 'react';
import { saveFooterLinkAction, deleteFooterLinkAction, updateFooterLinksOrderAction } from '@/app/actions';
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
import type { FooterLink } from '@/types';

type Props = { links: FooterLink[] };

function SortableLinkRow({ link, onEdit, onDelete }: {
  link: FooterLink;
  onEdit: (link: FooterLink) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: link.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 py-1.5 bg-[--bg]">
      <div {...attributes} {...listeners} className="cursor-grab text-[--ink-faint] hover:text-[--ink] active:cursor-grabbing text-sm">
        ☰
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-[13px] text-[--ink]">{link.label}</span>
        <span className="ml-2 font-mono text-xs text-[--ink-faint] truncate">{link.url}</span>
      </div>
      <div className="flex gap-1 shrink-0">
        <button onClick={() => onEdit(link)} className="admin-btn-sm">Edit</button>
        <button onClick={() => onDelete(link.id)} className="admin-btn-sm !border-red-300 !text-red-600">Del</button>
      </div>
    </div>
  );
}

type EditingLink = Partial<FooterLink> & { _prefillCategory?: string };

export function FooterLinksTab({ links }: Props) {
  const [items, setItems] = useState(links);
  const [editing, setEditing] = useState<EditingLink | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState('');

  useEffect(() => { setItems(links); }, [links]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Group items by category
  const categories = Array.from(new Set(items.map((i) => i.category)));
  const grouped = categories.reduce((acc, cat) => {
    acc[cat] = items.filter((i) => i.category === cat);
    return acc;
  }, {} as Record<string, FooterLink[]>);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
      const updates = newItems.map((item, index) => ({ id: item.id, order: index }));
      startTransition(() => { updateFooterLinksOrderAction(updates); });
    }
  }

  function openNewLink(category: string) {
    setEditing({ category, label: '', url: '', order: items.length });
    setMsg('');
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setEditing((prev) => prev ? { ...prev, [name]: value } : prev);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    startTransition(async () => {
      try {
        await saveFooterLinkAction(editing);
        setMsg('Saved.');
        setEditing(null);
      } catch { setMsg('Error saving.'); }
    });
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this link?')) return;
    startTransition(async () => { await deleteFooterLinkAction(id); });
  }

  return (
    <div className="space-y-8">

      {/* Category groups */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          {categories.length === 0 && (
            <p className="font-mono text-xs text-[--ink-faint]">No footer links yet. Add a category to get started.</p>
          )}
          {categories.map((category) => (
            <div key={category} className="space-y-2">
              {/* Category header */}
              <div className="flex items-center justify-between border-b border-[--rule] pb-1">
                <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-[--ink]">{category}</h3>
                <button
                  onClick={() => openNewLink(category)}
                  className="font-mono text-xs text-[--ink-muted] hover:text-[--ink] transition-colors"
                >
                  + Add link
                </button>
              </div>

              {/* Links in this category */}
              <div className="pl-2 divide-y divide-[--rule]/50">
                {grouped[category].map((link) => (
                  editing && editing.id === link.id ? (
                    <form key={link.id} onSubmit={handleSave} className="flex items-center gap-3 py-1.5 bg-[--bg]">
                      <div className="flex-1 min-w-0">
                        <div className="flex gap-3">
                          <input name="label" value={editing.label ?? ''} onChange={handleChange} className="admin-input" placeholder="Label" />
                          <input name="url" value={editing.url ?? ''} onChange={handleChange} className="admin-input" placeholder="https://..." />
                        </div>
                        {editing.id && (
                          <div className="mt-1">
                            <select name="category" value={editing.category ?? ''} onChange={handleChange} className="admin-input">
                              {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button type="submit" className="admin-btn-sm">Save</button>
                        <button type="button" onClick={() => setEditing(null)} className="admin-btn-sm">Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <SortableLinkRow
                      key={link.id}
                      link={link}
                      onEdit={(link) => { setEditing(link); setMsg(''); }}
                      onDelete={handleDelete}
                    />
                  )
                ))}
              </div>
            </div>
          ))}
        </SortableContext>
      </DndContext>

      {/* Add new category */}
      <div className="border-t border-[--rule] pt-4">
        {!showNewCategory ? (
          <button
            onClick={() => setShowNewCategory(true)}
            className="admin-btn"
          >
            + New Category
          </button>
        ) : (
          <div className="flex gap-3 items-center">
            <input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Category name (e.g. Socials)"
              className="admin-input flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newCategoryName.trim()) {
                  openNewLink(newCategoryName.trim());
                  setNewCategoryName('');
                  setShowNewCategory(false);
                }
              }}
            />
            <button
              onClick={() => {
                if (newCategoryName.trim()) {
                  openNewLink(newCategoryName.trim());
                  setNewCategoryName('');
                  setShowNewCategory(false);
                }
              }}
              className="admin-btn"
            >
              Create & Add Link
            </button>
            <button onClick={() => { setShowNewCategory(false); setNewCategoryName(''); }} className="admin-btn-sm">Cancel</button>
          </div>
        )}
      </div>

      {/* Edit / Add form */}
      {editing && (
        <form onSubmit={handleSave} className="space-y-4 border border-[--rule] p-4">
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-[--ink-muted]">
            {editing.id ? 'Edit Link' : `New Link → ${editing.category}`}
          </p>

          {/* Category selector (when editing existing, allow changing) */}
          {editing.id && (
            <div>
              <label className="mb-1 block font-mono text-xs uppercase tracking-[0.12em] text-[--ink-muted]">Category</label>
              <select name="category" value={editing.category ?? ''} onChange={handleChange} className="admin-input">
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          )}

          {[
            { label: 'Label', name: 'label', placeholder: 'e.g. GitHub' },
            { label: 'URL', name: 'url', placeholder: 'https://...' },
          ].map(({ label, name, placeholder }) => (
            <div key={name}>
              <label className="mb-1 block font-mono text-xs uppercase tracking-[0.12em] text-[--ink-muted]">{label}</label>
              <input
                name={name}
                value={editing[name as keyof FooterLink] as string ?? ''}
                onChange={handleChange}
                placeholder={placeholder}
                className="admin-input"
              />
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
