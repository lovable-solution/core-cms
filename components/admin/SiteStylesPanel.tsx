'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { ThemeEditor, type ThemeShape } from '@/app/admin/(panels)/theme/ThemeEditor';
import { TypographyEditor, type TypographyShape } from '@/app/admin/(panels)/typography/TypographyEditor';

export function SiteStylesPanel({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<'colors' | 'fonts'>('colors');
  const [theme, setTheme] = useState<ThemeShape | null>(null);
  const [typography, setTypography] = useState<TypographyShape | null>(null);

  useEffect(() => {
    fetch('/api/theme')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setTheme(d?.draft ?? null));
    fetch('/api/typography')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setTypography(d?.draft ?? null));
  }, []);

  return (
    <div className="fixed inset-0 z-[1000] flex justify-end bg-black/40" onClick={onClose}>
      <div
        className="h-full w-full max-w-xl overflow-y-auto bg-bg p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-medium text-fg">Site styles</h2>
          <button onClick={onClose} className="rounded p-1.5 text-faint hover:text-signal" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 flex items-center gap-1 rounded-full border border-line p-0.5 w-fit">
          {(['colors', 'fonts'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
                tab === t ? 'bg-signal text-ink-950' : 'text-subtle hover:text-fg'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === 'colors' && (theme ? <ThemeEditor initialValue={theme} /> : <Loading />)}
          {tab === 'fonts' && (typography ? <TypographyEditor initialValue={typography} /> : <Loading />)}
        </div>
      </div>
    </div>
  );
}

function Loading() {
  return <p className="text-sm text-subtle">Loading…</p>;
}
