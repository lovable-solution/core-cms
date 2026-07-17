'use client';

import { useState } from 'react';
import { humanize } from '@/lib/jsonPath';

export type ThemeTokens = {
  bg: string;
  surface: string;
  surfaceAlt: string;
  fg: string;
  muted: string;
  subtle: string;
  faint: string;
  line: string;
  lineSoft: string;
  signal: string;
  signalSoft: string;
  signalMuted: string;
};

export type ThemeShape = { light: ThemeTokens; dark: ThemeTokens };

const TOKEN_KEYS: (keyof ThemeTokens)[] = [
  'bg', 'surface', 'surfaceAlt', 'fg', 'muted', 'subtle', 'faint', 'line', 'lineSoft', 'signal', 'signalSoft', 'signalMuted',
];

export function ThemeEditor({ initialValue }: { initialValue: ThemeShape }) {
  const [value, setValue] = useState(initialValue);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  function setToken(mode: 'light' | 'dark', key: keyof ThemeTokens, hex: string) {
    setValue((prev) => ({ ...prev, [mode]: { ...prev[mode], [key]: hex } }));
  }

  async function handleSave() {
    setStatus('saving');
    const res = await fetch('/api/theme', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(value),
    });
    setStatus(res.ok ? 'saved' : 'error');
    if (res.ok) setTimeout(() => setStatus('idle'), 2000);
  }

  return (
    <div>
      <div className="sticky top-0 z-10 -mx-8 mb-4 flex items-center justify-between border-b border-line bg-bg/95 px-8 py-3 backdrop-blur">
        <span className="text-xs text-subtle">
          {status === 'saving' && 'Saving draft…'}
          {status === 'saved' && 'Draft saved.'}
          {status === 'error' && 'Failed to save.'}
          {status === 'idle' && ' '}
        </span>
        <button
          type="button"
          onClick={handleSave}
          disabled={status === 'saving'}
          className="rounded-full border border-line px-4 py-1.5 text-sm text-fg hover:border-signal hover:text-signal disabled:opacity-60"
        >
          Save draft
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {(['light', 'dark'] as const).map((mode) => (
          <div key={mode} className="rounded-xl border border-line bg-surface/50 p-5">
            <h2 className="font-display text-sm font-medium capitalize text-fg">{mode} mode</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {TOKEN_KEYS.map((key) => (
                <label key={key} className="flex items-center justify-between gap-2 rounded-lg border border-line-soft px-3 py-2">
                  <span className="text-xs text-subtle">{humanize(key)}</span>
                  <span className="flex items-center gap-2">
                    <input
                      type="color"
                      value={value[mode][key]}
                      onChange={(e) => setToken(mode, key, e.target.value)}
                      className="h-6 w-8 cursor-pointer rounded border border-line-soft bg-transparent"
                    />
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
