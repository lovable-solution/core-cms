'use client';

import { useEffect, useState } from 'react';
import type { SaveState } from '../types';
import { SANS_FONTS, DISPLAY_FONTS, MONO_FONTS, ARABIC_FONTS, ARABIC_DISPLAY_FONTS } from '@/lib/fonts';
import { Field, Slider } from '../controls';
import { SaveIndicator } from '../SaveIndicator';
import { useDebouncedCallback } from '../useDebouncedCallback';

type TypographyShape = {
  sans: string; display: string; mono: string; arabic: string; arabicDisplay: string; scale: number;
};

const FIELDS: { key: keyof Omit<TypographyShape, 'scale'>; label: string; options: string[] }[] = [
  { key: 'sans', label: 'Body font', options: SANS_FONTS },
  { key: 'display', label: 'Display / heading font', options: DISPLAY_FONTS },
  { key: 'mono', label: 'Monospace font', options: MONO_FONTS },
  { key: 'arabic', label: 'Arabic body font', options: ARABIC_FONTS },
  { key: 'arabicDisplay', label: 'Arabic display font', options: ARABIC_DISPLAY_FONTS },
];

export function TypographyPanel({ onSaved }: { onSaved: () => void }) {
  const [typography, setTypography] = useState<TypographyShape | null>(null);
  const [saveState, setSaveState] = useState<SaveState>('idle');

  useEffect(() => {
    fetch('/api/admin/typography')
      .then((r) => r.json())
      .then((json) => setTypography(json.typography))
      .catch(() => {});
  }, []);

  const save = useDebouncedCallback(async (patch: Partial<TypographyShape>) => {
    setSaveState('saving');
    try {
      const res = await fetch('/api/admin/typography', {
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

  function update(patch: Partial<TypographyShape>) {
    if (!typography) return;
    setTypography({ ...typography, ...patch });
    save(patch);
  }

  if (!typography) return <div className="text-sm text-subtle">Loading…</div>;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-fg">Typography</h3>
        <SaveIndicator state={saveState} />
      </div>

      {FIELDS.map(({ key, label, options }) => (
        <Field key={key} label={label}>
          <select
            value={typography[key]}
            onChange={(e) => update({ [key]: e.target.value } as Partial<TypographyShape>)}
            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-1.5 text-sm text-fg outline-none focus:border-signal"
          >
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </Field>
      ))}

      <Field label="Overall text scale">
        <Slider
          value={Math.round(typography.scale * 100)}
          min={85}
          max={125}
          unit="%"
          onChange={(v) => update({ scale: v / 100 })}
        />
      </Field>
    </div>
  );
}
