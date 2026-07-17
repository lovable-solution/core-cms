'use client';

import { useEffect, useState } from 'react';

export function PreviewBanner() {
  const [inIframe, setInIframe] = useState(false);

  useEffect(() => {
    setInIframe(window.self !== window.top);
  }, []);

  // Inside the CMS's visual editor iframe this banner is redundant (the CMS
  // chrome already makes the editing context clear) and "Exit preview" would
  // just break the editor's own draft-preview flow if clicked.
  if (inIframe) return null;

  return (
    <div className="sticky top-0 z-[999] bg-signal px-4 py-1.5 text-center text-xs font-medium text-ink-950">
      Preview mode: showing unpublished draft content.{' '}
      <a href="/api/preview/disable" className="underline">
        Exit preview
      </a>
    </div>
  );
}
