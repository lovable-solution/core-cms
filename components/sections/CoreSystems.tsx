'use client';

import Image from 'next/image';
import { ArrowUpRight, Cpu, Radar, Wind, type LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Reveal, RevealText } from '@/components/ui/Reveal';
import { GridLines, RadialGlow } from '@/components/ui/GridLines';
import { mediaImageStyle, type MediaSlotValue } from '@/lib/mediaTypes';

export function CoreSystems({ image }: { image: MediaSlotValue }) {
  const t = useTranslations('coreSystems');
  return (
    <section id="systems" className="relative overflow-hidden border-t border-line bg-bg py-24 md:py-32">
      <RadialGlow from="rgba(230,47,77,0.06)" className="top-0" />
      <GridLines className="opacity-30" />
      <div className="container-wide relative">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <Reveal>
              <span className="eyebrow" data-cms-key="content:coreSystems.eyebrow">
                {t('eyebrow')}
              </span>
            </Reveal>
            <h2 className="mt-6 font-display text-display-xs text-balance tracking-tighter text-fg">
              <span data-cms-key="content:coreSystems.title1">
                <RevealText text={t('title1')} />
              </span>{' '}
              <span className="text-gradient-warm" data-cms-key="content:coreSystems.title2">
                <RevealText text={t('title2')} delay={0.15} />
              </span>
            </h2>
          </div>
          <Reveal delay={0.2}>
            <p
              className="max-w-sm text-pretty leading-relaxed text-muted"
              data-cms-key="content:coreSystems.description"
            >
              {t('description')}
            </p>
          </Reveal>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
          className="mt-16 grid gap-8 overflow-hidden rounded-3xl border border-line bg-surface/40 p-6 md:p-10 lg:grid-cols-[1.1fr_1fr]"
        >
          <div className="flex flex-col justify-between gap-10">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-signal/40 bg-signal/10 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-signal">
                  <Cpu className="h-3.5 w-3.5" /> {t('flagship')}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-muted">
                  {t('pilotStatus')}
                </span>
              </div>
              <h3
                className="mt-6 font-display text-3xl leading-tight text-fg md:text-4xl"
                data-cms-key="content:coreSystems.hpeTitle"
              >
                {t('hpeTitle')}
              </h3>
              <p
                className="mt-5 max-w-lg text-pretty leading-relaxed text-muted"
                data-cms-key="content:coreSystems.hpeDesc"
              >
                {t('hpeDesc')}
              </p>
            </div>

            <div className="grid gap-6">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">
                  {t('currentPhase')}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <ModuleChip label={t('hpeTitle')} live />
                </div>
              </div>
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-subtle">
                  {t('futurePhase')}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {['Resource', 'Analytics', 'Documents', 'Assets'].map((m) => (
                    <ModuleChip key={m} label={m} />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <Link
                href="/products#hpe"
                className="group inline-flex items-center gap-2 text-sm font-medium text-fg hover:text-signal"
              >
                {t('exploreEngine')}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 flip-rtl" />
              </Link>
            </div>
          </div>

          <div className="relative aspect-square overflow-hidden rounded-2xl border border-line bg-bg">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover opacity-90"
              style={mediaImageStyle(image)}
              data-cms-key="media:coreSystems.image"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-ink-950/20 to-ink-950/80" />
            <div className="absolute inset-4 flex flex-col justify-between">
              <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-ink-100">
                <span>⟐ HPE-01</span>
                <span className="text-signal">Live</span>
              </div>
              <div className="grid grid-cols-3 gap-2 font-mono text-[10px] text-ink-100">
                <Metric label="Fatigue" val="Low" />
                <Metric label="Competency" val="92%" />
                <Metric label="Reliability" val="0.97" />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <SystemCard
            icon={Radar}
            name={t('sss.name')}
            desc={t('sss.desc')}
            img="/images/section4/2.webp"
            href="/products#sss"
            exploreLabel={t('exploreSystem')}
          />
          <SystemCard
            icon={Wind}
            name={t('sms.name')}
            desc={t('sms.desc')}
            img="/images/section4/3.webp"
            href="/products#sms"
            exploreLabel={t('exploreSystem')}
          />
        </div>
      </div>
    </section>
  );
}

function ModuleChip({ label, live = false }: { label: string; live?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs ${
        live
          ? 'border-signal/50 bg-signal/10 text-signal'
          : 'border-line bg-surface/50 text-muted'
      }`}
    >
      {live && <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse" />}
      {label}
    </span>
  );
}

function Metric({ label, val }: { label: string; val: string }) {
  return (
    <div className="rounded-lg border border-ink-700/60 bg-ink-950/60 p-3 backdrop-blur-sm">
      <div className="text-ink-300">{label}</div>
      <div className="mt-1 text-sm font-medium text-ink-50">{val}</div>
    </div>
  );
}

function SystemCard({
  icon: Icon,
  name,
  desc,
  img,
  href,
  exploreLabel,
}: {
  icon: LucideIcon;
  name: string;
  desc: string;
  img: string;
  href: string;
  exploreLabel: string;
}) {
  return (
    <Link
      href={href as never}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface/30 transition-colors hover:border-subtle"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={img}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/20 to-transparent" />
        <Icon
          className="absolute start-5 top-5 h-6 w-6 text-ink-100"
          strokeWidth={1.5}
        />
      </div>
      <div className="p-6 md:p-8">
        <h4 className="font-display text-2xl leading-tight text-fg">{name}</h4>
        <p className="mt-3 text-sm leading-relaxed text-muted">{desc}</p>
        <div className="mt-5 inline-flex items-center gap-2 text-sm text-fg/90 group-hover:text-signal">
          {exploreLabel}
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 flip-rtl" />
        </div>
      </div>
    </Link>
  );
}
