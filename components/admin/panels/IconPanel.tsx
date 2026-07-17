'use client';

import { useEffect, useState } from 'react';
import type { CmsSelection, SaveState } from '../types';
import type { ElementStyleOverride } from '@/lib/styleOverride';
import { ICON_REGISTRY, ICON_CATEGORIES } from '@/lib/iconRegistry';
import { Field, Slider, ColorInput } from '../controls';
import { SaveIndicator } from '../SaveIndicator';
import { useDebouncedCallback } from '../useDebouncedCallback';

export function IconPanel({ selection, onSaved }: { selection: CmsSelection; onSaved: () => void }) {
  const [override, setOverride] = useState<ElementStyleOverride>({});
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setSaveState('idle');
    setSearch('');
    fetch(`/api/admin/style?key=${encodeURIComponent(selection.key)}`)
      .then((r) => r.json())
      .then((json) => setOverride(json.override ?? {}))
      .catch(() => setOverride({}));
  }, [selection.key]);

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
  }, 350);

  function updateStyle(patch: ElementStyleOverride) {
    setOverride((prev) => ({ ...prev, ...patch }));
    saveStyle(patch);
  }

  const iconColor = override.iconColor ?? '#e4002b';
  const iconSize = override.iconSize ?? 20;
  const offsetX = override.offsetX ?? 0;
  const offsetY = override.offsetY ?? 0;

  const filtered = search.trim()
    ? Object.keys(ICON_REGISTRY).filter((n) => n.toLowerCase().includes(search.toLowerCase()))
    : null;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-fg">Icon</h3>
        <SaveIndicator state={saveState} />
      </div>

      <Field label="Icon">
        <input
          type="text"
          placeholder="Search icons…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-2 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-1.5 text-sm text-fg outline-none focus:border-signal"
        />
        <div className="max-h-64 overflow-y-auto rounded-lg border border-white/10 bg-black/20 p-2">
          {filtered ? (
            <IconGrid names={filtered} onPick={(name) => updateStyle({ iconName: name })} />
          ) : (
            ICON_CATEGORIES.map((cat) => (
              <div key={cat.label} className="mb-3 last:mb-0">
                <div className="mb-1.5 px-1 text-[10px] uppercase tracking-wider text-faint">{cat.label}</div>
                <IconGrid names={cat.icons} onPick={(name) => updateStyle({ iconName: name })} />
              </div>
            ))
          )}
        </div>
      </Field>

      <Field label="Color">
        <ColorInput value={iconColor} onChange={(v) => updateStyle({ iconColor: v })} />
      </Field>

      <Field label="Size">
        <Slider value={iconSize} min={12} max={64} unit="px" onChange={(v) => updateStyle({ iconSize: v })} />
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

function IconGrid({ names, onPick }: { names: string[]; onPick: (name: string) => void }) {
  return (
    <div className="grid grid-cols-6 gap-1">
      {names.map((name) => {
        const Icon = ICON_REGISTRY[name];
        if (!Icon) return null;
        return (
          <button
            key={name}
            type="button"
            title={name}
            onClick={() => onPick(name)}
            className="grid h-9 w-9 place-items-center rounded-md text-subtle transition-colors hover:bg-white/10 hover:text-fg"
          >
            <Icon className="h-4 w-4" strokeWidth={1.6} />
          </button>
        );
      })}
    </div>
  );
}
