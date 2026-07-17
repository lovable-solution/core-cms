'use client';

import { useState } from 'react';
import { SANS_FONTS, DISPLAY_FONTS, MONO_FONTS, ARABIC_FONTS, ARABIC_DISPLAY_FONTS } from '@/lib/fonts';

export type TypographyShape = {
  sans: string;
  display: string;
  mono: string;
  arabic: string;
  arabicDisplay: string;
  scale: number;
};

const ROLES: { key: keyof Omit<TypographyShape, 'scale'>; label: string; options: string[] }[] = [
  { key: 'sans', label: 'Body text', options: SANS_FONTS },
  { key: 'display', label: 'Headings', options: DISPLAY_FONTS },
  { key: 'mono', label: 'Monospace / labels', options: MONO_FONTS },
  { key: 'arabic', label: 'Arabic body text', options: ARABIC_FONTS },
  { key: 'arabicDisplay', label: 'Arabic headings', options: ARABIC_DISPLAY_FONTS },
];

export function TypographyEditor({ initialValue }: { initialValue: TypographyShape }) {
  const [value, setValue] = useState(initialValue);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  async function handleSave() {
    setStatus('saving');
    const res = await fetch('/api/typography', {
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

      <div className="max-w-xl space-y-4">
        {ROLES.map(({ key, label, options }) => (
          <div key={key} className="rounded-xl border border-line bg-surface/50 p-4">
            <label className="block text-xs font-medium uppercase tracking-wide text-subtle">{label}</label>
            <select
              value={value[key]}
              onChange={(e) => setValue((prev) => ({ ...prev, [key]: e.target.value }))}
              className="mt-2 w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm text-fg outline-none focus:border-signal"
            >
              {options.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>
        ))}

        <div className="rounded-xl border border-line bg-surface/50 p-4">
          <label className="block text-xs font-medium uppercase tracking-wide text-subtle">
            Size scale ({value.scale.toFixed(2)}×)
          </label>
          <input
            type="range"
            min={0.85}
            max={1.2}
            step={0.01}
            value={value.scale}
            onChange={(e) => setValue((prev) => ({ ...prev, scale: Number(e.target.value) }))}
            className="mt-3 w-full"
          />
        </div>
      </div>
    </div>
  );
}
