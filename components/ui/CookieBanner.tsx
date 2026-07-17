'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Cookie, X } from 'lucide-react';

const KEY = 'core-cookie-ack-v1';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const t = useTranslations('cookies');

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) {
        const id = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(id);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(KEY, new Date().toISOString());
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
          className="fixed inset-x-4 bottom-4 z-[60] md:inset-x-auto md:end-6 md:bottom-6 md:max-w-md"
          role="region"
          aria-label="Cookie notice"
        >
          <div className="relative overflow-hidden rounded-2xl border border-line bg-surface/95 p-5 shadow-2xl backdrop-blur-xl">
            <div className="flex items-start gap-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line bg-bg">
                <Cookie className="h-4 w-4 text-signal" strokeWidth={1.7} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-display text-sm font-semibold text-fg">{t('title')}</div>
                <p className="mt-1 text-xs leading-relaxed text-muted">{t('body')}</p>
                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={accept}
                    className="rounded-full bg-signal px-4 py-1.5 font-mono text-[11px] uppercase tracking-wider text-ink-950 transition-opacity hover:opacity-90"
                  >
                    {t('accept')}
                  </button>
                </div>
              </div>
              <button
                onClick={accept}
                aria-label={t('accept')}
                className="grid h-7 w-7 place-items-center rounded-full text-subtle hover:text-fg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
