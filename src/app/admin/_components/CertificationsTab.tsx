'use client';

import { useState, useTransition } from 'react';
import { saveCertificationAction, deleteCertificationAction } from '@/app/actions';
import type { Certification } from '@/types';

type Props = { certifications: Certification[] };

export function CertificationsTab({ certifications }: Props) {
  const [editing, setEditing] = useState<Partial<Certification> | null>(null);
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setEditing((prev) => prev ? { ...prev, [name]: value } : prev);
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

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        {certifications.map((cert) => (
          <div key={cert.id} className="flex items-start justify-between gap-4 border-b border-[#E4E4DF] py-2">
            <div>
              <p className="text-[14px] font-medium text-[#1A1A18]">{cert.name}</p>
              <p className="font-mono text-xs text-[#6B6B66]">{cert.issuer} · {cert.date}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditing({ ...cert }); setMsg(''); }} className="admin-btn-sm">Edit</button>
              <button onClick={() => startTransition(() => deleteCertificationAction(cert.id))} className="admin-btn-sm !border-red-300 !text-red-600">Del</button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => { setEditing({ name: '', issuer: '', date: '', link: '' }); setMsg(''); }} className="admin-btn">+ Add Certification</button>

      {editing && (
        <form onSubmit={handleSave} className="space-y-4 border-t border-[#E4E4DF] pt-6">
          {[
            { label: 'Name', name: 'name' },
            { label: 'Issuer', name: 'issuer' },
            { label: 'Date', name: 'date' },
            { label: 'Verification URL', name: 'link' },
          ].map(({ label, name }) => (
            <div key={name}>
              <label className="mb-1 block font-mono text-xs uppercase tracking-[0.12em] text-[#6B6B66]">{label}</label>
              <input name={name} value={editing[name as keyof Certification] as string ?? ''} onChange={handleChange} className="admin-input" />
            </div>
          ))}
          <div className="flex items-center gap-4">
            <button type="submit" disabled={isPending} className="admin-btn">{isPending ? 'Saving…' : 'Save'}</button>
            <button type="button" onClick={() => setEditing(null)} className="admin-btn-sm">Cancel</button>
            {msg && <p className="font-mono text-xs text-[#6B6B66]">{msg}</p>}
          </div>
        </form>
      )}
    </div>
  );
}
