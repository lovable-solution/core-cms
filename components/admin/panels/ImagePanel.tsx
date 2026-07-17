'use client';

import { useEffect, useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import type { CmsSelection, SaveState } from '../types';
import { Field, Slider, Segmented } from '../controls';
import { SaveIndicator } from '../SaveIndicator';
import { useDebouncedCallback } from '../useDebouncedCallback';

type MediaFilter = { brightness?: number; contrast?: number; saturate?: number; grayscale?: number; hueRotate?: number };
type MediaSlotState = {
  url: string;
  alt: string;
  focalX: number;
  focalY: number;
  scale: number;
  filter: MediaFilter | null;
  cropAspect: 'auto' | '1/1' | '16/9' | '4/3';
};

const EMPTY: MediaSlotState = { url: '', alt: '', focalX: 0.5, focalY: 0.5, scale: 1, filter: null, cropAspect: 'auto' };

export function ImagePanel({ selection, onSaved }: { selection: CmsSelection; onSaved: () => void }) {
  const slotKey = selection.key.replace(/^media:/, '');
  const [state, setState] = useState<MediaSlotState>(EMPTY);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [uploading, setUploading] = useState(false);
  const thumbRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSaveState('idle');
    fetch('/api/admin/media')
      .then((r) => r.json())
      .then((json) => {
        const slot = (json.slots as (MediaSlotState & { key: string })[]).find((s) => s.key === slotKey);
        if (slot) setState(slot);
      })
      .catch(() => {});
  }, [slotKey]);

  const save = useDebouncedCallback(async (patch: Partial<MediaSlotState>) => {
    setSaveState('saving');
    try {
      const res = await fetch('/api/admin/media', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slotKey, ...patch }),
      });
      setSaveState(res.ok ? 'saved' : 'error');
      if (res.ok) onSaved();
    } catch {
      setSaveState('error');
    }
  }, 400);

  function update(patch: Partial<MediaSlotState>) {
    setState((prev) => ({ ...prev, ...patch }));
    save(patch);
  }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/admin/media/upload', { method: 'POST', body: form });
      const json = await res.json();
      if (res.ok && json.url) {
        update({ url: json.url });
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function onThumbPointer(e: React.PointerEvent<HTMLDivElement>) {
    const el = thumbRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const move = (clientX: number, clientY: number) => {
      const x = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      const y = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));
      update({ focalX: Math.round(x * 100) / 100, focalY: Math.round(y * 100) / 100 });
    };
    move(e.clientX, e.clientY);
    el.setPointerCapture(e.pointerId);
    const onMove = (ev: PointerEvent) => move(ev.clientX, ev.clientY);
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }

  const filter = state.filter ?? {};

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-fg">Image</h3>
        <SaveIndicator state={saveState} />
      </div>

      <Field label="Preview · drag to set focal point">
        <div
          ref={thumbRef}
          onPointerDown={onThumbPointer}
          className="relative aspect-video w-full cursor-crosshair overflow-hidden rounded-lg border border-white/10 bg-black/40"
        >
          {state.url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={state.url}
              alt=""
              className="h-full w-full object-cover"
              style={{
                objectPosition: `${state.focalX * 100}% ${state.focalY * 100}%`,
                transform: state.scale !== 1 ? `scale(${state.scale})` : undefined,
                filter: filterCss(filter),
              }}
            />
          )}
          <div
            className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-signal bg-white/80"
            style={{ left: `${state.focalX * 100}%`, top: `${state.focalY * 100}%` }}
          />
        </div>
      </Field>

      <Field label="Replace image">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-xs text-fg hover:border-signal disabled:opacity-60"
        >
          <Upload className="h-3.5 w-3.5" />
          {uploading ? 'Uploading…' : 'Upload new image'}
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
      </Field>

      <Field label="Alt text">
        <input
          type="text"
          value={state.alt}
          onChange={(e) => update({ alt: e.target.value })}
          className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-1.5 text-sm text-fg outline-none focus:border-signal"
        />
      </Field>

      <Field label="Zoom">
        <Slider value={Math.round(state.scale * 100)} min={50} max={250} unit="%" onChange={(v) => update({ scale: v / 100 })} />
      </Field>

      <Field label="Aspect ratio">
        <Segmented
          value={state.cropAspect}
          onChange={(v) => update({ cropAspect: v })}
          options={[
            { label: 'Auto', value: 'auto' },
            { label: '1:1', value: '1/1' },
            { label: '16:9', value: '16/9' },
            { label: '4:3', value: '4/3' },
          ]}
        />
      </Field>

      <Field label="Brightness">
        <Slider value={filter.brightness ?? 100} min={0} max={200} unit="%" onChange={(v) => update({ filter: { ...filter, brightness: v } })} />
      </Field>
      <Field label="Contrast">
        <Slider value={filter.contrast ?? 100} min={0} max={200} unit="%" onChange={(v) => update({ filter: { ...filter, contrast: v } })} />
      </Field>
      <Field label="Saturation">
        <Slider value={filter.saturate ?? 100} min={0} max={200} unit="%" onChange={(v) => update({ filter: { ...filter, saturate: v } })} />
      </Field>
      <Field label="Grayscale">
        <Slider value={filter.grayscale ?? 0} min={0} max={100} unit="%" onChange={(v) => update({ filter: { ...filter, grayscale: v } })} />
      </Field>
    </div>
  );
}

function filterCss(f: MediaFilter): string {
  const parts: string[] = [];
  if (f.brightness != null) parts.push(`brightness(${f.brightness}%)`);
  if (f.contrast != null) parts.push(`contrast(${f.contrast}%)`);
  if (f.saturate != null) parts.push(`saturate(${f.saturate}%)`);
  if (f.grayscale != null) parts.push(`grayscale(${f.grayscale}%)`);
  if (f.hueRotate != null) parts.push(`hue-rotate(${f.hueRotate}deg)`);
  return parts.join(' ') || 'none';
}
