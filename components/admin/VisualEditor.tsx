'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Palette, RefreshCw, X } from 'lucide-react';
import { PublishButton } from '@/components/admin/PublishButton';
import { EditPopover, type EditTarget } from '@/components/admin/EditPopover';
import { SiteStylesPanel } from '@/components/admin/SiteStylesPanel';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
const PREVIEW_SECRET = process.env.NEXT_PUBLIC_PREVIEW_SECRET ?? '';

function siteOrigin() {
  try {
    return new URL(SITE_URL).origin;
  } catch {
    return SITE_URL;
  }
}

export function VisualEditor() {
  const [locale, setLocale] = useState<'en' | 'ar'>('en');
  const [target, setTarget] = useState<EditTarget | null>(null);
  const [stylesOpen, setStylesOpen] = useState(false);
  const [reloadTick, setReloadTick] = useState(0);
  const [hintDismissed, setHintDismissed] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const previewSrc = `${SITE_URL}/api/preview?secret=${encodeURIComponent(PREVIEW_SECRET)}&path=%2F${locale}`;

  const refreshIframe = useCallback(() => {
    setReloadTick((n) => n + 1);
  }, []);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.origin !== siteOrigin()) return;
      if (e.data?.type !== 'cms:edit') return;
      const iframeEl = iframeRef.current;
      if (!iframeEl) return;
      const iframeRect = iframeEl.getBoundingClientRect();
      const r = e.data.rect as { top: number; left: number; width: number; height: number };
      const x = iframeRect.left + r.left;
      const y = iframeRect.top + r.top + r.height;

      const key = e.data.key as string;
      if (key.startsWith('media:')) {
        setTarget({ kind: 'media', key, x, y });
      } else {
        setTarget({ kind: 'content', key, value: e.data.value ?? '', x, y });
      }
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  function handleSaved() {
    setTarget(null);
    refreshIframe();
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between border-b border-line bg-surface/40 px-6 py-3">
        <div className="flex items-center gap-4">
          <span className="font-display text-base font-medium text-fg">Core CMS</span>
          <div className="flex items-center gap-1 rounded-full border border-line p-0.5">
            {(['en', 'ar'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLocale(l)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  locale === l ? 'bg-signal text-ink-950' : 'text-subtle hover:text-fg'
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <button
            onClick={refreshIframe}
            className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs text-subtle hover:border-signal hover:text-signal"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setStylesOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm text-fg hover:border-signal hover:text-signal"
          >
            <Palette className="h-4 w-4" />
            Site styles
          </button>
          <a
            href="/admin/content/en"
            className="text-xs text-subtle underline decoration-line underline-offset-4 hover:text-fg"
          >
            Advanced editor
          </a>
          <PublishButton />
        </div>
      </header>

      {!hintDismissed && (
        <div className="flex items-center justify-center gap-3 border-b border-line bg-surface/60 px-4 py-1.5 text-xs text-subtle">
          <span>Hover any highlighted text or image below and click to edit it directly.</span>
          <button
            onClick={() => setHintDismissed(true)}
            className="rounded p-0.5 text-faint hover:text-signal"
            aria-label="Dismiss hint"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      <div className="relative flex-1 overflow-hidden bg-ink-950">
        <iframe
          key={reloadTick}
          ref={iframeRef}
          src={previewSrc}
          className="h-full w-full border-0"
          title="Site preview"
        />
      </div>

      {target && <EditPopover target={target} locale={locale} onClose={() => setTarget(null)} onSaved={handleSaved} />}
      {stylesOpen && <SiteStylesPanel onClose={() => setStylesOpen(false)} />}
    </div>
  );
}
