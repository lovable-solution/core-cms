'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Command } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LocaleSwitcher } from '@/components/ui/LocaleSwitcher';
import { Link, usePathname } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import type { MediaSlotValue } from '@/lib/mediaTypes';
import { styleFromOverride, type CmsStyleMap } from '@/lib/styleOverride';

export type BrandLogos = { dark: MediaSlotValue; light: MediaSlotValue; plus: MediaSlotValue };

export function Navbar({ logos, styles }: { logos: BrandLogos; styles: CmsStyleMap }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations('nav');

  const navItems = [
    { label: t('services'), href: '/services', key: 'nav.services' },
    { label: t('products'), href: '/products', key: 'nav.products' },
    { label: t('about'), href: '/about', key: 'nav.about' },
    { label: t('contact'), href: '/contact', key: 'nav.contact' },
  ] as const;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const openCommand = () => {
    window.dispatchEvent(new Event('core:open-command-palette'));
  };

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        scrolled
          ? 'backdrop-blur-xl bg-bg/70 border-b border-line/60'
          : 'bg-transparent',
      )}
    >
      <div className="container-wide flex h-16 items-center justify-between gap-4 md:h-20">
        <Link href="/" className="group flex items-center" aria-label="core+ home">
          <span className="relative inline-block transition-transform duration-500 group-hover:scale-[1.03]">
            <Image
              src={logos.dark.src}
              alt="core+"
              width={2472}
              height={740}
              priority
              className="h-7 w-auto dark:hidden md:h-8"
              style={logos.dark.scale !== 1 ? { transform: `scale(${logos.dark.scale})` } : undefined}
              data-cms-key="media:brand.logoDark"
            />
            <Image
              src={logos.light.src}
              alt="core+"
              width={2472}
              height={740}
              priority
              className="hidden h-7 w-auto dark:block md:h-8"
              style={logos.light.scale !== 1 ? { transform: `scale(${logos.light.scale})` } : undefined}
              data-cms-key="media:brand.logoLight"
            />
            {/* Brand red plus, kept out of the dark-mode invert filter */}
            <Image
              src={logos.plus.src}
              alt=""
              aria-hidden
              width={2472}
              height={740}
              priority
              className="pointer-events-none absolute inset-0 h-full w-full"
              style={logos.plus.scale !== 1 ? { transform: `scale(${logos.plus.scale})` } : undefined}
            />
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const active =
              pathname === item.href || pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative rounded-full px-4 py-2 text-sm transition-colors',
                  active ? 'text-fg' : 'text-muted hover:text-fg',
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-full bg-surface-alt"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span
                  className="relative"
                  data-cms-key={`content:${item.key}`}
                  style={styleFromOverride(styles[`content:${item.key}`])}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <button
            type="button"
            onClick={openCommand}
            className="group inline-flex items-center gap-2 rounded-full border border-line bg-surface/40 px-3 py-1.5 font-mono text-[11px] text-muted transition-colors hover:border-signal hover:text-fg"
            aria-label={t('commandHint')}
          >
            <Command className="h-3.5 w-3.5" strokeWidth={1.7} />
            <span>⌘K</span>
          </button>
          <LocaleSwitcher />
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle compact />
          <LocaleSwitcher />
          <button
            className="grid h-9 w-9 place-items-center rounded-full border border-line text-fg"
            aria-label={open ? t('closeMenu') : t('openMenu')}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
            className="overflow-hidden border-t border-line bg-bg/95 backdrop-blur-xl lg:hidden"
          >
            <div className="container-wide flex flex-col gap-1 py-6">
              {navItems.map((item, i) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between rounded-lg px-3 py-3 text-base text-fg hover:bg-surface"
                >
                  <span
                    data-cms-key={`content:${item.key}`}
                    style={styleFromOverride(styles[`content:${item.key}`])}
                  >
                    {item.label}
                  </span>
                  <span className="font-mono text-xs text-subtle">
                    0{i + 1}
                  </span>
                </Link>
              ))}
              <div className="mt-4">
                <Button
                  href="/contact"
                  className="w-full"
                  size="md"
                  withArrow
                  cmsKey="button:nav.requestConsultation"
                  styles={styles}
                >
                  {t('requestConsultation')}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

