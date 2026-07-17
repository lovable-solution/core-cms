'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname as useNextPathname } from 'next/navigation';
import { useState } from 'react';
import { routing, type Locale } from '@/i18n/routing';

const flagFor: Record<Locale, { src: string; label: string; alt: string }> = {
  en: { src: '/flags/gb.svg', label: 'English', alt: 'United Kingdom flag' },
  ar: { src: '/flags/ae.svg', label: 'العربية', alt: 'United Arab Emirates flag' },
};

export function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const t = useTranslations('nav');
  const pathname = useNextPathname();
  const [pending, setPending] = useState(false);

  function switchTo(next: Locale) {
    if (next === locale || pending) return;
    const segments = (pathname ?? '/').split('/');
    if (routing.locales.includes(segments[1] as Locale)) {
      segments[1] = next;
    } else {
      segments.splice(1, 0, next);
    }
    const q = typeof window !== 'undefined' ? window.location.search : '';
    const newPath = segments.join('/') + q;
    setPending(true);
    // A full navigation (not router.replace) rather than a client-side transition:
    // this layout renders <html lang/dir> per-locale via generateStaticParams, so a
    // soft transition swaps the whole document tree on the client, which makes React
    // warn about the JSON-LD <script> tag in layout.tsx being "rendered" client-side.
    // A real navigation re-parses fresh HTML from the server instead, same as any
    // normal first page load — no client reconciliation of the <script> involved.
    window.location.href = newPath;
  }

  return (
    <div
      className="group inline-flex items-center rounded-full border border-line bg-surface/40 p-1"
      role="group"
      aria-label={t('toggleLanguage')}
    >
      {routing.locales.map((l) => {
        const active = l === locale;
        const flag = flagFor[l];
        return (
          <button
            key={l}
            type="button"
            onClick={() => switchTo(l)}
            aria-label={flag.label}
            aria-pressed={active}
            title={flag.label}
            disabled={pending}
            className={`relative inline-flex h-7 w-9 items-center justify-center overflow-hidden rounded-full transition-all ${
              active
                ? 'ring-2 ring-signal ring-offset-2 ring-offset-bg'
                : 'opacity-55 hover:opacity-100'
            }`}
          >
            <Image
              src={flag.src}
              alt={flag.alt}
              width={36}
              height={28}
              className="h-full w-full object-cover"
              unoptimized
            />
          </button>
        );
      })}
    </div>
  );
}
