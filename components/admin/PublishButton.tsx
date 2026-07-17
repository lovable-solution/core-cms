'use client';

import { useState } from 'react';
import { Rocket } from 'lucide-react';

export function PublishButton() {
  const [state, setState] = useState<'idle' | 'publishing' | 'done'>('idle');

  async function handlePublish() {
    setState('publishing');
    const res = await fetch('/api/publish', { method: 'POST' });
    if (res.ok) {
      setState('done');
      setTimeout(() => setState('idle'), 2000);
    } else {
      setState('idle');
      alert('Publish failed. Please try again.');
    }
  }

  return (
    <button
      type="button"
      onClick={handlePublish}
      disabled={state === 'publishing'}
      className="inline-flex items-center gap-2 rounded-full bg-signal px-4 py-2 text-sm font-medium text-ink-950 transition-colors hover:bg-signal-soft disabled:opacity-60"
    >
      <Rocket className="h-4 w-4" />
      {state === 'publishing' ? 'Publishing…' : state === 'done' ? 'Published' : 'Publish changes'}
    </button>
  );
}
