'use client';

import { Check, Loader2, AlertCircle } from 'lucide-react';
import type { SaveState } from './types';

export function SaveIndicator({ state }: { state: SaveState }) {
  if (state === 'idle') return null;
  return (
    <div className="flex items-center gap-1.5 text-xs text-subtle">
      {state === 'saving' && (
        <>
          <Loader2 className="h-3 w-3 animate-spin" /> Saving…
        </>
      )}
      {state === 'saved' && (
        <>
          <Check className="h-3 w-3 text-emerald-400" /> Saved
        </>
      )}
      {state === 'error' && (
        <>
          <AlertCircle className="h-3 w-3 text-signal" /> Failed to save
        </>
      )}
    </div>
  );
}
