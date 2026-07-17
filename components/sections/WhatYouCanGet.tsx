'use client';

import {
  ArrowUpRight,
  ClipboardCheck,
  LineChart,
  Shield,
  Users,
  Gauge,
  ScrollText,
  type LucideIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Reveal } from '@/components/ui/Reveal';
import { Marquee } from '@/components/ui/Marquee';

const icons: LucideIcon[] = [LineChart, ClipboardCheck, ScrollText, Shield, Users, Gauge];

export function WhatYouCanGet() {
  const t = useTranslations('whatYouCanGet');
  const items = t.raw('items') as { title: string; desc: string }[];

  return (
    <section id="what-you-can-get" className="relative border-t border-line py-24 md:py-32">
      <div className="container-wide">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
          <SectionHeader
            eyebrow={t('eyebrow')}
            title={t('title')}
            description={t('description')}
            eyebrowKey="whatYouCanGet.eyebrow"
            titleKey="whatYouCanGet.title"
            descriptionKey="whatYouCanGet.description"
          />
          <Reveal delay={0.2}>
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-subtle">
              {t('count')}
            </div>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-1 divide-y divide-line border-y border-line md:grid-cols-2 md:divide-x md:divide-y-0 lg:grid-cols-3">
          {items.map((s, i) => {
            const Icon = icons[i] ?? LineChart;
            const n = String(i + 1).padStart(2, '0');
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: [0.2, 0.7, 0.2, 1] }}
                className="group relative flex flex-col justify-between gap-10 bg-bg p-8 transition-colors hover:bg-surface/60 md:min-h-[320px] md:p-10 lg:border-b lg:border-line lg:[&:nth-child(n+4)]:border-b-0"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-subtle">{n}</span>
                    <Icon
                      className="h-5 w-5 text-subtle transition-colors group-hover:text-signal"
                      strokeWidth={1.5}
                    />
                  </div>
                  <h3
                    className="mt-8 font-display text-2xl leading-tight text-fg"
                    data-cms-key={`content:whatYouCanGet.items.${i}.title`}
                  >
                    {s.title}
                  </h3>
                  <p
                    className="mt-4 text-sm leading-relaxed text-muted"
                    data-cms-key={`content:whatYouCanGet.items.${i}.desc`}
                  >
                    {s.desc}
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 text-sm text-subtle transition-colors group-hover:text-signal">
                  <span className="font-mono uppercase tracking-wider">
                    {t('capability')}
                  </span>
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 flip-rtl" />
                </div>
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-signal/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
                />
              </motion.div>
            );
          })}
        </div>

        <div className="mt-20">
          <Marquee
            items={[
              'Rail',
              'Aviation',
              'Healthcare',
              'Energy',
              'Construction',
              'Transport',
              'Infrastructure',
              'Industrial',
            ]}
          />
        </div>
      </div>
    </section>
  );
}
