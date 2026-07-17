'use client';

import { useState } from 'react';
import { Loader2, UploadCloud, Check } from 'lucide-react';

export function PublishButton() {
  const [state, setState] = useState<'idle' | 'publishing' | 'done'>('idle');

  async function publish() {
    setState('publishing');
    try {
      await fetch('/api/admin/publish', { method: 'POST' });
      setState('done');
      setTimeout(() => setState('idle'), 2000);
    } catch {
      setState('idle');
    }
  }

  return (
    <button
      type="button"
      onClick={publish}
      disabled={state === 'publishing'}
      className="inline-flex h-8 items-center gap-1.5 rounded-full bg-signal px-3.5 text-xs font-medium text-ink-950 transition-opacity hover:opacity-90 disabled:opacity-70"
    >
      {state === 'publishing' && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
      {state === 'done' ? <Check className="h-3.5 w-3.5" /> : state === 'idle' && <UploadCloud className="h-3.5 w-3.5" />}
      {state === 'publishing' ? 'Publishing…' : state === 'done' ? 'Published' : 'Publish'}
    </button>
  );
}
