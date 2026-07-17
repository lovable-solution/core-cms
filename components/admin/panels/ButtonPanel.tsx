'use client';

import { useEffect, useState } from 'react';
import type { CmsSelection, SaveState } from '../types';
import type { ElementStyleOverride } from '@/lib/styleOverride';
import { Field, Slider, Segmented, Textarea } from '../controls';
import { SaveIndicator } from '../SaveIndicator';
import { useDebouncedCallback } from '../useDebouncedCallback';

export function ButtonPanel({
  selection,
  locale,
  onSaved,
}: {
  selection: CmsSelection;
  locale: string;
  onSaved: () => void;
}) {
  const path = selection.key.replace(/^button:/, '');
  const [label, setLabel] = useState(selection.value);
  const [override, setOverride] = useState<ElementStyleOverride>({});
  const [saveState, setSaveState] = useState<SaveState>('idle');

  useEffect(() => {
    setLabel(selection.value);
    setSaveState('idle');
    fetch(`/api/admin/style?key=${encodeURIComponent(selection.key)}`)
      .then((r) => r.json())
      .then((json) => setOverride(json.override ?? {}))
      .catch(() => setOverride({}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection.key]);

  const saveLabel = useDebouncedCallback(async (value: string) => {
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
    setOverride((prev) => ({ ...prev, ...patch }));
    saveStyle(patch);
  }

  const variant = override.buttonVariant ?? 'primary';
  const size = override.buttonSize ?? 'md';
  const radius = override.radius ?? (selection.computedStyle.borderRadius ?? 999);
  const offsetX = override.offsetX ?? 0;
  const offsetY = override.offsetY ?? 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-fg">Button</h3>
        <SaveIndicator state={saveState} />
      </div>

      <Field label="Label">
        <Textarea
          rows={2}
          value={label}
          onChange={(v) => {
            setLabel(v);
            saveLabel(v);
          }}
        />
      </Field>

      <Field label="Style">
        <Segmented
          value={variant}
          onChange={(v) => updateStyle({ buttonVariant: v })}
          options={[
            { label: 'Primary', value: 'primary' },
            { label: 'Secondary', value: 'secondary' },
            { label: 'Outline', value: 'outline' },
          ]}
        />
      </Field>

      <Field label="Size">
        <Segmented
          value={size}
          onChange={(v) => updateStyle({ buttonSize: v })}
          options={[
            { label: 'Small', value: 'sm' },
            { label: 'Medium', value: 'md' },
            { label: 'Large', value: 'lg' },
          ]}
        />
      </Field>

      <Field label="Corner radius">
        <Slider value={Math.min(radius, 60)} min={0} max={60} unit="px" onChange={(v) => updateStyle({ radius: v })} />
      </Field>

      <Field label="Position nudge">
        <div className="grid grid-cols-2 gap-3">
          <Slider value={offsetX} min={-100} max={100} unit="px" onChange={(v) => updateStyle({ offsetX: v })} />
          <Slider value={offsetY} min={-100} max={100} unit="px" onChange={(v) => updateStyle({ offsetY: v })} />
        </div>
      </Field>
    </div>
  );
}
