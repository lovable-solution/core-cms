'use client';

import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { uploadImage } from '@/lib/uploadImage';

export type MediaDraft = { url: string; alt: string; focalX: number; focalY: number; scale: number };

export function MediaSlotCard({
  slotKey,
  draft,
  onSaved,
  compact = false,
}: {
  slotKey: string;
  draft: MediaDraft;
  onSaved?: () => void;
  compact?: boolean;
}) {
  const [value, setValue] = useState(draft);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'saving' | 'saved' | 'error'>('idle');
  const imgRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function persist(next: MediaDraft) {
    setStatus('saving');
    const res = await fetch(`/api/media/${encodeURIComponent(slotKey)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(next),
    });
    setStatus(res.ok ? 'saved' : 'error');
    if (res.ok) {
      onSaved?.();
      setTimeout(() => setStatus('idle'), 1500);
    }
  }

  async function handleFile(file: File) {
    setStatus('uploading');
    try {
      const url = await uploadImage(file, slotKey);
      const next = { ...value, url };
      setValue(next);
      await persist(next);
    } catch {
      setStatus('error');
    }
  }

  function handleFocalClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = imgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const focalX = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const focalY = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
    const next = { ...value, focalX, focalY };
    setValue(next);
    persist(next);
  }

  return (
    <div className={compact ? '' : 'rounded-xl border border-line bg-surface/50 p-4'}>
      {!compact && (
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-subtle">{slotKey}</span>
          <span className="text-[10px] text-faint">
            {status === 'uploading' && 'Uploading…'}
            {status === 'saving' && 'Saving…'}
            {status === 'saved' && 'Saved'}
            {status === 'error' && 'Failed'}
          </span>
        </div>
      )}
      {compact && (status === 'uploading' || status === 'saving' || status === 'error') && (
        <div className="mb-2 text-[10px] text-faint">
          {status === 'uploading' && 'Uploading…'}
          {status === 'saving' && 'Saving…'}
          {status === 'error' && 'Failed'}
        </div>
      )}

      <div
        ref={imgRef}
        onClick={handleFocalClick}
        className={`relative overflow-hidden rounded-lg border border-line-soft bg-bg cursor-crosshair ${compact ? 'h-32' : 'mt-3 h-40'}`}
        title="Click to set focal point"
      >
        {value.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value.url}
            alt={value.alt}
            className="h-full w-full object-cover"
            style={{
              objectPosition: `${value.focalX * 100}% ${value.focalY * 100}%`,
              transform: `scale(${value.scale})`,
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-faint">No image</div>
        )}
        <div
          className="pointer-events-none absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white bg-signal"
          style={{ left: `${value.focalX * 100}%`, top: `${value.focalY * 100}%` }}
        />
      </div>

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs text-subtle hover:border-signal hover:text-signal"
      >
        <Upload className="h-3.5 w-3.5" />
        Replace image
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />

      <input
        type="text"
        placeholder="Alt text"
        value={value.alt}
        onChange={(e) => setValue((prev) => ({ ...prev, alt: e.target.value }))}
        onBlur={() => persist(value)}
        className="mt-3 w-full rounded-lg border border-line bg-bg px-3 py-1.5 text-xs text-fg outline-none focus:border-signal"
      />

      <label className="mt-3 block text-[10px] uppercase tracking-wide text-subtle">
        Scale ({value.scale.toFixed(2)}×)
      </label>
      <input
        type="range"
        min={1}
        max={1.6}
        step={0.01}
        value={value.scale}
        onChange={(e) => setValue((prev) => ({ ...prev, scale: Number(e.target.value) }))}
        onMouseUp={() => persist(value)}
        onTouchEnd={() => persist(value)}
        className="mt-1 w-full"
      />
    </div>
  );
}
