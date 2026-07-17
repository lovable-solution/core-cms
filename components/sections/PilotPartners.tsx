'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Zap,
  HandCoins,
  SlidersHorizontal,
  Puzzle,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { Reveal, RevealText } from '@/components/ui/Reveal';
import { GridLines, RadialGlow } from '@/components/ui/GridLines';
import { mediaImageStyle, type MediaSlotValue } from '@/lib/mediaTypes';

const benefitIcons: LucideIcon[] = [Zap, HandCoins, SlidersHorizontal, Puzzle, TrendingUp];

export function PilotPartners({ image }: { image: MediaSlotValue }) {
  const t = useTranslations('pilot');
  const involves = t.raw('involves') as string[];
  const benefits = t.raw('benefits') as { title: string; desc: string }[];

  return (
    <section id="pilot" className="relative overflow-hidden border-t border-line py-24 md:py-32">
      <GridLines className="opacity-40" />
      <RadialGlow from="rgba(230,47,77,0.14)" className="top-[10%]" />

      <div className="container-wide relative">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <Reveal>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-signal/40 bg-signal/10 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-signal">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
                  </span>
                  <span data-cms-key="content:pilot.badge">{t('badge')}</span>
                </span>
                <span className="eyebrow !text-signal" data-cms-key="content:pilot.eyebrow">
                  {t('eyebrow')}
                </span>
              </div>
            </Reveal>
            <h2 className="mt-6 font-display text-display-sm text-balance tracking-tightest text-fg">
              <span data-cms-key="content:pilot.title1">
                <RevealText text={t('title1')} />
              </span>
              <br />
              <span className="text-muted" data-cms-key="content:pilot.title2">
                <RevealText text={t('title2')} delay={0.15} />
              </span>
            </h2>
          </div>
          <Reveal delay={0.2}>
            <p className="text-pretty text-lg leading-relaxed text-muted" data-cms-key="content:pilot.description">
              {t('description')}
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <Reveal className="relative overflow-hidden rounded-3xl border border-line bg-surface/30">
            <div className="relative aspect-[4/5] md:aspect-[3/4]">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
                style={mediaImageStyle(image)}
                data-cms-key="media:pilotPartners.image"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-transparent" />
              <div className="absolute inset-6 flex flex-col justify-end">
                <div
                  className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal"
                  data-cms-key="content:pilot.coverEyebrow"
                >
                  {t('coverEyebrow')}
                </div>
                <h3
                  className="mt-3 font-display text-3xl leading-tight text-ink-50"
                  data-cms-key="content:pilot.coverTitle"
                >
                  {t('coverTitle')}
                </h3>
                <p
                  className="mt-3 max-w-md text-sm leading-relaxed text-ink-200"
                  data-cms-key="content:pilot.coverDesc"
                >
                  {t('coverDesc')}
                </p>
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <span className="eyebrow">{t('involvesEyebrow')}</span>
            </Reveal>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {involves.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  className="flex items-start gap-5 py-5"
                >
                  <span className="mt-1 font-mono text-xs text-signal">0{i + 1}</span>
                  <span className="text-lg leading-relaxed text-fg">{item}</span>
                </motion.li>
              ))}
            </ul>

            <div className="mt-10 rounded-2xl border border-line bg-surface/30 p-6">
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-subtle">
                {t('idealEyebrow')}
              </div>
              <p className="mt-3 text-pretty leading-relaxed text-fg/90">
                {t('idealDesc')}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-24">
          <Reveal>
            <span className="eyebrow">{t('benefitsEyebrow')}</span>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {benefits.map((b, i) => {
              const Icon = benefitIcons[i] ?? Zap;
              return (
                <motion.div
                  key={b.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7, delay: i * 0.08 }}
                  className="group relative flex h-full flex-col justify-between gap-6 rounded-2xl border border-line bg-surface/30 p-6 transition-colors hover:border-signal/60 hover:bg-surface/50"
                >
                  <Icon className="h-6 w-6 text-signal" strokeWidth={1.5} />
                  <div>
                    <h4 className="font-display text-lg text-fg">{b.title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{b.desc}</p>
                  </div>
                  <span className="font-mono text-[10px] text-subtle">0{i + 1} / 05</span>
                </motion.div>
              );
            })}
          </div>
        </div>

        <Reveal className="mt-20">
          <div className="relative overflow-hidden rounded-3xl border border-line bg-surface/40 p-10 md:p-14">
            <RadialGlow from="rgba(230,47,77,0.18)" />
            <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
              <div className="max-w-2xl">
                <div
                  className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal"
                  data-cms-key="content:pilot.ctaEyebrow"
                >
                  {t('ctaEyebrow')}
                </div>
                <h3
                  className="mt-3 font-display text-3xl text-balance text-fg md:text-4xl"
                  data-cms-key="content:pilot.ctaTitle"
                >
                  {t('ctaTitle')}
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <MagneticButton>
                  <Button href="/contact?type=pilot" size="lg" withArrow>
                    <span data-cms-key="content:pilot.cta1">{t('cta1')}</span>
                  </Button>
                </MagneticButton>
                <MagneticButton>
                  <Button href="/contact" size="lg" variant="outline">
                    <span data-cms-key="content:pilot.cta2">{t('cta2')}</span>
                  </Button>
                </MagneticButton>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
