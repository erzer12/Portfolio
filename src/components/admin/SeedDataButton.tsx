'use client';

import { useState, useTransition } from 'react';
import { reseedPortfolioDataAction } from '@/app/actions';

export default function SeedDataButton() {
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [confirmChecked, setConfirmChecked] = useState(false);

  function handleClick() {
    // show inline warning UI instead of a blocking confirm()
    setConfirming(true);
    setConfirmChecked(false);
  }

  function handleConfirmReseed() {
    if (!confirmChecked) return;
    setMsg('');
    startTransition(async () => {
      try {
        await reseedPortfolioDataAction();
        setMsg('Reseeded. Refresh the page to see the new content.');
      } catch {
        setMsg('Reseed failed. Check your Supabase credentials and logs.');
      } finally {
        setConfirming(false);
      }
    });
  }

  return (
    <div className="flex items-center gap-4">
      {!confirming ? (
        <>
          <button type="button" onClick={handleClick} disabled={isPending} className="admin-btn">
            {isPending ? 'Reseeding…' : 'Reseed Content'}
          </button>
          {msg && <p className="font-mono text-xs text-[--ink-muted]">{msg}</p>}
        </>
      ) : (
        <div className="flex-1">
          <div className="rounded bg-yellow-900/20 border border-yellow-700 p-3">
            <p className="font-mono text-sm text-yellow-200 mb-2">Warning: This will permanently DELETE existing portfolio content and replace it with seed data.</p>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={confirmChecked} onChange={(e) => setConfirmChecked(e.target.checked)} />
              <span className="text-xs text-[--ink-muted]">I understand this will wipe data and I want to proceed.</span>
            </label>
            <div className="mt-2 flex gap-2">
              <button type="button" onClick={handleConfirmReseed} disabled={!confirmChecked || isPending} className="admin-btn">Confirm Reseed</button>
              <button type="button" onClick={() => setConfirming(false)} className="admin-btn-sm">Cancel</button>
            </div>
          </div>
          {msg && <p className="font-mono text-xs text-[--ink-muted] mt-2">{msg}</p>}
        </div>
      )}
    </div>
  );
}
