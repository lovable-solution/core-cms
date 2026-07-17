'use client';

import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { PreviewFrame, type DeviceWidth } from './PreviewFrame';
import { Inspector, type InspectorMode } from './Inspector';
import type { CmsSelection } from './types';

export function AdminEditor({
  mode,
  locale,
  path,
}: {
  mode: InspectorMode;
  locale: string;
  path: string;
}) {
  const [selection, setSelection] = useState<CmsSelection | null>(null);
  const [device, setDevice] = useState<DeviceWidth>('full');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Reset the selection whenever the admin navigates to a different page/locale/section.
  useEffect(() => {
    setSelection(null);
  }, [mode, locale, path]);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.origin !== window.location.origin) return;
      if (e.source !== iframeRef.current?.contentWindow) return;
      if (e.data?.type === 'cms:edit') {
        setSelection({
          key: e.data.key,
          kind: e.data.kind,
          value: e.data.value,
          tagName: e.data.tagName,
          rect: e.data.rect,
          computedStyle: e.data.computedStyle ?? {},
        });
      }
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  function refreshPreview() {
    iframeRef.current?.contentWindow?.postMessage({ type: 'cms:refresh' }, window.location.origin);
  }

  function selectMediaSlot(cmsKey: string) {
    setSelection({
      key: cmsKey,
      kind: 'media',
      value: '',
      tagName: 'img',
      rect: { top: 0, left: 0, width: 0, height: 0 },
      computedStyle: {},
    });
  }

  const targetPath = path === '/' ? `/${locale}` : `/${locale}${path}`;
  const src = `/api/admin/preview/enable?path=${encodeURIComponent(targetPath)}`;

  return (
    <div className="flex h-full">
      <div className="flex-1 overflow-hidden">
        <PreviewFrame src={src} device={device} onDeviceChange={setDevice} iframeRef={iframeRef} />
      </div>
      <aside className="flex w-[340px] shrink-0 flex-col overflow-y-auto border-l border-white/10 bg-black/20 p-5">
        {selection && (
          <button
            type="button"
            onClick={() => setSelection(null)}
            className="mb-4 inline-flex items-center gap-1.5 self-start rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-subtle hover:text-fg"
          >
            <X className="h-3 w-3" />
            {selection.key}
          </button>
        )}
        <Inspector
          mode={mode}
          selection={selection}
          locale={locale}
          onSaved={refreshPreview}
          onSelectMediaSlot={selectMediaSlot}
        />
      </aside>
    </div>
  );
}
