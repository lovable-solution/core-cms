'use client';

import { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Sun,
  Moon,
  Globe,
  FileText,
  Briefcase,
  Cpu,
  Radar,
  Wind,
  Mail,
  Users,
  Building,
  GraduationCap,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  HardDrive,
  Blocks,
  Brain,
  type LucideIcon,
} from 'lucide-react';
import { usePathname as useNextPathname, useRouter as useNextRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { routing, type Locale } from '@/i18n/routing';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const t = useTranslations('commandPalette');
  const nav = useTranslations('nav');
  const { setTheme, resolvedTheme } = useTheme();
  const locale = useLocale() as Locale;
  const nextPathname = useNextPathname();
  const nextRouter = useNextRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener('core:open-command-palette', onOpen);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('core:open-command-palette', onOpen);
    };
  }, []);

  const go = (href: string) => {
    setOpen(false);
    router.push(href as never);
  };

  const switchLocale = () => {
    const next: Locale = locale === 'en' ? 'ar' : 'en';
    const segments = (nextPathname ?? '/').split('/');
    if (routing.locales.includes(segments[1] as Locale)) segments[1] = next;
    else segments.splice(1, 0, next);
    const q = typeof window !== 'undefined' ? window.location.search : '';
    nextRouter.replace(segments.join('/') + q);
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-start justify-center bg-ink-950/60 p-4 pt-[18vh] backdrop-blur-md"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal
        >
          <motion.div
            initial={{ y: -16, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.2, 0.7, 0.2, 1] }}
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-bg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Command
              label="Command menu"
              loop
              className="w-full"
            >
              <div className="flex items-center gap-3 border-b border-line px-4 py-3">
                <Search className="h-4 w-4 text-subtle" strokeWidth={1.7} />
                <Command.Input
                  placeholder={t('placeholder')}
                  className="flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-subtle"
                />
                <kbd className="rounded bg-surface px-2 py-0.5 font-mono text-[10px] text-subtle">ESC</kbd>
              </div>
              <Command.List className="max-h-[60vh] overflow-y-auto py-2">
                <Command.Empty className="px-4 py-8 text-center text-sm text-subtle">
                  {t('empty')}
                </Command.Empty>

                <Group label={t('groups.navigate')}>
                  <Item icon={FileText} label={nav('services')} onSelect={() => go('/services')} />
                  <Item icon={Cpu} label={nav('products')} onSelect={() => go('/products')} />
                  <Item icon={Users} label={nav('about')} onSelect={() => go('/about')} />
                  <Item icon={Mail} label={nav('contact')} onSelect={() => go('/contact')} />
                </Group>

                <Group label={t('groups.services')}>
                  <Item icon={Brain} label="Human Factors & Operational Performance" onSelect={() => go('/services#human-factors')} />
                  <Item icon={TrendingUp} label="Operational Excellence" onSelect={() => go('/services#operational-excellence')} />
                  <Item icon={ShieldCheck} label="Compliance & Assurance" onSelect={() => go('/services#compliance-assurance')} />
                  <Item icon={Sparkles} label="Digital Transformation & AI" onSelect={() => go('/services#digital-ai')} />
                  <Item icon={GraduationCap} label="Competency Development & Technical Training" onSelect={() => go('/services#competency-training')} />
                  <Item icon={Briefcase} label="Commercial Strategy, Budget & Bid Support" onSelect={() => go('/services#commercial-strategy')} />
                  <Item icon={HardDrive} label="Legacy Systems Modernisation" onSelect={() => go('/services#legacy-modernisation')} />
                  <Item icon={Blocks} label="Bespoke Systems Collaboration" onSelect={() => go('/services#bespoke-collaboration')} />
                </Group>

                <Group label={t('groups.products')}>
                  <Item icon={Cpu} label="Human Performance Engine" onSelect={() => go('/products#hpe')} />
                  <Item icon={Wind} label="Environmental Intelligence" onSelect={() => go('/products#environmental')} />
                  <Item icon={Radar} label="Smart Safety & Performance Station" onSelect={() => go('/products#station')} />
                  <Item icon={FileText} label="Document Production Engine" onSelect={() => go('/products#dpe')} />
                  <Item icon={Building} label="Bespoke Systems" onSelect={() => go('/products#bespoke')} />
                </Group>

                <Group label={t('groups.actions')}>
                  <Item
                    icon={resolvedTheme === 'dark' ? Sun : Moon}
                    label={t('actions.toggleTheme')}
                    onSelect={() => {
                      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
                      setOpen(false);
                    }}
                  />
                  <Item icon={Globe} label={t('actions.switchLanguage')} onSelect={switchLocale} />
                  <Item icon={Mail} label={t('actions.contact')} onSelect={() => go('/contact')} accent />
                  <Item icon={Users} label={t('actions.pilot')} onSelect={() => go('/contact?type=pilot')} accent />
                </Group>
              </Command.List>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Command.Group
      heading={label}
      className="px-2 py-1 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.2em] [&_[cmdk-group-heading]]:text-subtle"
    >
      {children}
    </Command.Group>
  );
}

function Item({
  icon: Icon,
  label,
  onSelect,
  accent = false,
}: {
  icon: LucideIcon;
  label: string;
  onSelect: () => void;
  accent?: boolean;
}) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-fg/90 transition-colors data-[selected=true]:bg-surface-alt data-[selected=true]:text-fg"
    >
      <Icon
        className={`h-4 w-4 ${accent ? 'text-signal' : 'text-subtle group-data-[selected=true]:text-fg'}`}
        strokeWidth={1.7}
      />
      <span className="flex-1">{label}</span>
    </Command.Item>
  );
}
