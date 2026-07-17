'use client';

import { useState } from 'react';
import { JsonEditor } from '@/components/admin/JsonEditor';
import type { JsonValue } from '@/lib/jsonPath';

export function ContentEditor({
  locale,
  initialValue,
}: {
  locale: string;
  initialValue: Record<string, JsonValue>;
}) {
  const [value, setValue] = useState(initialValue);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  async function handleSave() {
    setStatus('saving');
    const res = await fetch(`/api/content/${locale}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(value),
    });
    setStatus(res.ok ? 'saved' : 'error');
    if (res.ok) setTimeout(() => setStatus('idle'), 2000);
  }

  return (
    <div>
      <div className="sticky top-0 z-10 -mx-8 mb-4 flex items-center justify-between border-b border-line bg-bg/95 px-8 py-3 backdrop-blur">
        <span className="text-xs text-subtle">
          {status === 'saving' && 'Saving draft…'}
          {status === 'saved' && 'Draft saved.'}
          {status === 'error' && 'Failed to save.'}
          {status === 'idle' && ' '}
        </span>
        <button
          type="button"
          onClick={handleSave}
          disabled={status === 'saving'}
          className="rounded-full border border-line px-4 py-1.5 text-sm text-fg hover:border-signal hover:text-signal disabled:opacity-60"
        >
          Save draft
        </button>
      </div>
      <JsonEditor
        value={value}
        onChange={setValue}
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
      />
    </div>
  );
}
