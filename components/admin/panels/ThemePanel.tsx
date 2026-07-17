'use client';

import { useEffect, useState } from 'react';
import type { SaveState } from '../types';
import { Field, ColorInput } from '../controls';
import { SaveIndicator } from '../SaveIndicator';
import { useDebouncedCallback } from '../useDebouncedCallback';

type ThemeTokens = {
  bg: string; surface: string; surfaceAlt: string; fg: string; muted: string; subtle: string;
  faint: string; line: string; lineSoft: string; signal: string; signalSoft: string; signalMuted: string;
};
type ThemeShape = { light: ThemeTokens; dark: ThemeTokens };

const TOKEN_LABELS: [keyof ThemeTokens, string][] = [
  ['bg', 'Background'],
  ['surface', 'Surface'],
  ['surfaceAlt', 'Surface (alt)'],
  ['fg', 'Text'],
  ['muted', 'Text (muted)'],
  ['subtle', 'Text (subtle)'],
  ['faint', 'Text (faint)'],
  ['line', 'Border'],
  ['lineSoft', 'Border (soft)'],
  ['signal', 'Brand accent'],
  ['signalSoft', 'Brand accent (soft)'],
  ['signalMuted', 'Brand accent (muted)'],
];

export function ThemePanel({ onSaved }: { onSaved: () => void }) {
  const [theme, setTheme] = useState<ThemeShape | null>(null);
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [saveState, setSaveState] = useState<SaveState>('idle');

  useEffect(() => {
    fetch('/api/admin/theme')
      .then((r) => r.json())
      .then((json) => setTheme(json.theme))
      .catch(() => {});
  }, []);

  const save = useDebouncedCallback(async (patch: Partial<ThemeShape>) => {
    setSaveState('saving');
    try {
      const res = await fetch('/api/admin/theme', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      setSaveState(res.ok ? 'saved' : 'error');
      if (res.ok) onSaved();
    } catch {
      setSaveState('error');
    }
  }, 350);

  function updateToken(key: keyof ThemeTokens, value: string) {
    if (!theme) return;
    const next = { ...theme, [mode]: { ...theme[mode], [key]: value } };
    setTheme(next);
    save({ [mode]: { [key]: value } } as Partial<ThemeShape>);
  }

  if (!theme) return <div className="text-sm text-subtle">Loading…</div>;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-fg">Theme &amp; brand colors</h3>
        <SaveIndicator state={saveState} />
      </div>

      <div className="grid grid-cols-2 gap-1 rounded-lg border border-white/10 bg-black/20 p-1">
        {(['light', 'dark'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`rounded-md px-3 py-1.5 text-xs capitalize transition-colors ${
              mode === m ? 'bg-white/10 text-fg' : 'text-subtle hover:text-fg'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {TOKEN_LABELS.map(([key, label]) => (
        <Field key={key} label={label}>
          <ColorInput value={theme[mode][key]} onChange={(v) => updateToken(key, v)} />
        </Field>
      ))}
    </div>
  );
}
