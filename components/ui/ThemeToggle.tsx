'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations('nav');

  useEffect(() => setMounted(true), []);

  const isDark = (mounted ? resolvedTheme ?? theme : 'dark') === 'dark';
  const next = isDark ? 'light' : 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={t('toggleTheme')}
      title={t('toggleTheme')}
      className={`group relative grid place-items-center rounded-full border border-line bg-surface/40 text-fg transition-colors hover:border-signal hover:text-signal ${
        compact ? 'h-9 w-9' : 'h-10 w-10'
      }`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {mounted && (
          <motion.span
            key={isDark ? 'moon' : 'sun'}
            initial={{ rotate: -45, opacity: 0, scale: 0.7 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 45, opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.25, ease: [0.2, 0.7, 0.2, 1] }}
            className="absolute inset-0 grid place-items-center"
          >
            {isDark ? <Moon className="h-4 w-4" strokeWidth={1.7} /> : <Sun className="h-4 w-4" strokeWidth={1.7} />}
          </motion.span>
        )}
        {!mounted && <Moon className="h-4 w-4 opacity-70" strokeWidth={1.7} />}
      </AnimatePresence>
    </button>
  );
}
