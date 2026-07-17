'use client';

import { useEffect, useState } from 'react';
import type { CmsSelection, SaveState } from '../types';
import type { ElementStyleOverride } from '@/lib/styleOverride';
import { Field, Slider, ColorInput, Segmented, Textarea } from '../controls';
import { SaveIndicator } from '../SaveIndicator';
import { useDebouncedCallback } from '../useDebouncedCallback';

export function TextPanel({
  selection,
  locale,
  onSaved,
}: {
  selection: CmsSelection;
  locale: string;
  onSaved: () => void;
}) {
  const path = selection.key.replace(/^content:/, '');
  const [text, setText] = useState(selection.value);
  const [override, setOverride] = useState<ElementStyleOverride>({});
  const [saveState, setSaveState] = useState<SaveState>('idle');

  useEffect(() => {
    setText(selection.value);
    setSaveState('idle');
    fetch(`/api/admin/style?key=${encodeURIComponent(selection.key)}`)
      .then((r) => r.json())
      .then((json) => setOverride(json.override ?? {}))
      .catch(() => setOverride({}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection.key]);

  const saveText = useDebouncedCallback(async (value: string) => {
    setSaveState('saving');
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale, key: path, value }),
      });
      setSaveState(res.ok ? 'saved' : 'error');
      if (res.ok) onSaved();
    } catch {
      setSaveState('error');
    }
  }, 600);

  const saveStyle = useDebouncedCallback(async (patch: ElementStyleOverride) => {
    setSaveState('saving');
    try {
      const res = await fetch('/api/admin/style', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: selection.key, patch }),
      });
      setSaveState(res.ok ? 'saved' : 'error');
      if (res.ok) onSaved();
    } catch {
      setSaveState('error');
    }
  }, 400);

  function updateStyle(patch: ElementStyleOverride) {
    const next = { ...override, ...patch };
    setOverride(next);
    saveStyle(patch);
  }

  const fontSize = override.fontSize ?? Math.round(selection.computedStyle.fontSize ?? 16);
  const fontWeight = override.fontWeight ?? selection.computedStyle.fontWeight ?? 400;
  const color = override.color ?? '#ffffff';
  const align = override.textAlign ?? 'left';
  const offsetX = override.offsetX ?? 0;
  const offsetY = override.offsetY ?? 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-fg">Text</h3>
        <SaveIndicator state={saveState} />
      </div>

      <Field label="Content">
        <Textarea
          value={text}
          onChange={(v) => {
            setText(v);
            saveText(v);
          }}
        />
      </Field>

      <Field label="Font size">
        <Slider value={fontSize} min={10} max={96} unit="px" onChange={(v) => updateStyle({ fontSize: v })} />
      </Field>

      <Field label="Font weight">
        <Slider
          value={fontWeight}
          min={300}
          max={800}
          step={100}
          onChange={(v) => updateStyle({ fontWeight: v })}
        />
      </Field>

      <Field label="Color">
        <ColorInput value={color} onChange={(v) => updateStyle({ color: v })} />
      </Field>

      <Field label="Alignment">
        <Segmented
          value={align}
          onChange={(v) => updateStyle({ textAlign: v })}
          options={[
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
          ]}
        />
      </Field>

      <Field label="Position nudge">
        <div className="grid grid-cols-2 gap-3">
          <Slider value={offsetX} min={-100} max={100} unit="px" onChange={(v) => updateStyle({ offsetX: v })} />
          <Slider value={offsetY} min={-100} max={100} unit="px" onChange={(v) => updateStyle({ offsetY: v })} />
        </div>
      </Field>

      <button
        type="button"
        onClick={() => updateStyle({ fontSize: null as never, fontWeight: null as never, color: null as never, textAlign: null as never, offsetX: null as never, offsetY: null as never })}
        className="mt-1 text-left text-xs text-subtle underline decoration-dotted hover:text-fg"
      >
        Reset style overrides
      </button>
    </div>
  );
}
