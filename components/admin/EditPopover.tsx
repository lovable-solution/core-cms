'use client';

import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { MediaSlotCard, type MediaDraft } from '@/components/admin/MediaSlotCard';

export type EditTarget =
  | { kind: 'content'; key: string; value: string; x: number; y: number }
  | { kind: 'media'; key: string; x: number; y: number };

export function EditPopover({
  target,
  locale,
  onClose,
  onSaved,
}: {
  target: EditTarget;
  locale: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onClickOutside);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, [onClose]);

  const width = 340;
  const style = {
    position: 'fixed' as const,
    top: Math.min(target.y + 8, window.innerHeight - 400),
    left: Math.min(Math.max(target.x, 12), window.innerWidth - width - 12),
    width,
    zIndex: 1000,
  };

  return (
    <div
      ref={ref}
      style={style}
      className="rounded-xl border border-line bg-surface shadow-2xl shadow-black/40"
    >
      <div className="flex items-center justify-between border-b border-line-soft px-4 py-2">
        <span className="font-mono text-[11px] text-subtle">{target.key.split(':')[1] ?? target.key}</span>
        <button onClick={onClose} className="rounded p-1 text-faint hover:text-signal" aria-label="Close">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="p-4">
        {target.kind === 'content' ? (
          <ContentField target={target} locale={locale} onSaved={onSaved} />
        ) : (
          <MediaField slotKey={target.key.split(':')[1]} onSaved={onSaved} />
        )}
      </div>
    </div>
  );
}

function ContentField({
  target,
  locale,
  onSaved,
}: {
  target: Extract<EditTarget, { kind: 'content' }>;
  locale: string;
  onSaved: () => void;
}) {
  const [value, setValue] = useState(target.value);
  const [status, setStatus] = useState<'idle' | 'saving' | 'error'>('idle');
  const path = target.key.split(':')[1]?.split('.') ?? [];

  async function handleSave() {
    setStatus('saving');
    const res = await fetch(`/api/content/${locale}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, value }),
    });
    if (res.ok) {
      onSaved();
    } else {
      setStatus('error');
    }
  }

  const long = value.length > 60 || value.includes('\n');

  return (
    <div>
      {long ? (
        <textarea
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={4}
          className="w-full resize-y rounded-lg border border-line bg-bg px-3 py-2 text-sm text-fg outline-none focus:border-signal"
        />
      ) : (
        <input
          autoFocus
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          className="w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm text-fg outline-none focus:border-signal"
        />
      )}
      {status === 'error' && <p className="mt-2 text-xs text-signal">Save failed, try again.</p>}
      <button
        type="button"
        onClick={handleSave}
        disabled={status === 'saving'}
        className="mt-3 w-full rounded-full bg-signal px-4 py-2 text-sm font-medium text-ink-950 hover:bg-signal-soft disabled:opacity-60"
      >
        {status === 'saving' ? 'Saving…' : 'Save'}
      </button>
    </div>
  );
}

function MediaField({ slotKey, onSaved }: { slotKey: string; onSaved: () => void }) {
  const [draft, setDraft] = useState<MediaDraft | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/media/${encodeURIComponent(slotKey)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setDraft(d?.draft ?? null))
      .finally(() => setLoading(false));
  }, [slotKey]);

  if (loading) return <p className="text-xs text-subtle">Loading…</p>;
  if (!draft) return <p className="text-xs text-signal">Slot not found.</p>;

  return <MediaSlotCard slotKey={slotKey} draft={draft} onSaved={onSaved} compact />;
}
