'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Award, Calendar, FileText, Package, LineChart, Check, Circle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Reveal, RevealText } from '@/components/ui/Reveal';

type ModuleKey = 'fatigue' | 'competency' | 'resource' | 'analytics' | 'document' | 'asset';

interface ModuleDef {
  key: ModuleKey;
  icon: typeof Activity;
  available: boolean;
  /** Base contribution to operational readiness score (0–100). */
  weight: number;
  /** Visualization renderer for the mini card. */
  metricVisual: (active: boolean) => React.ReactNode;
}

const modulesDef: ModuleDef[] = [
  {
    key: 'fatigue',
    icon: Activity,
    available: true,
    weight: 26,
    metricVisual: (active) => <Waveform active={active} />,
  },
  {
    key: 'competency',
    icon: Award,
    available: true,
    weight: 24,
    metricVisual: (active) => <ProgressRing value={active ? 92 : 0} />,
  },
  {
    key: 'resource',
    icon: Calendar,
    available: false,
    weight: 18,
    metricVisual: (active) => <Bars active={active} count={6} />,
  },
  {
    key: 'analytics',
    icon: LineChart,
    available: false,
    weight: 14,
    metricVisual: (active) => <TrendLine active={active} />,
  },
  {
    key: 'document',
    icon: FileText,
    available: false,
    weight: 10,
    metricVisual: (active) => <Bars active={active} count={4} />,
  },
  {
    key: 'asset',
    icon: Package,
    available: false,
    weight: 8,
    metricVisual: (active) => <ProgressRing value={active ? 76 : 0} />,
  },
];

export function HPEInteractive() {
  const t = useTranslations('hpeDemo');
  const [active, setActive] = useState<Set<ModuleKey>>(
    new Set(['fatigue', 'competency']),
  );

  const readiness = useMemo(() => {
    let sum = 0;
    for (const m of modulesDef) if (active.has(m.key)) sum += m.weight;
    return Math.min(100, sum);
  }, [active]);

  const toggle = (k: ModuleKey) => {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  };

  return (
    <section className="relative overflow-hidden border-t border-line bg-bg py-24 md:py-32">
      <div className="container-wide">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <Reveal>
              <span className="eyebrow">{t('eyebrow')}</span>
            </Reveal>
            <h2 className="mt-6 font-display text-display-xs text-balance tracking-tighter text-fg">
              <RevealText text={t('title')} />
            </h2>
          </div>
          <Reveal delay={0.2}>
            <p className="max-w-sm text-pretty leading-relaxed text-muted">
              {t('description')}
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          {/* Module grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modulesDef.map((m, i) => {
              const isActive = active.has(m.key);
              const Icon = m.icon;
              return (
                <motion.button
                  key={m.key}
                  type="button"
                  onClick={() => toggle(m.key)}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.04 }}
                  whileHover={{ y: -2 }}
                  className={`group relative overflow-hidden rounded-2xl border p-5 text-start transition-all ${
                    isActive
                      ? 'border-signal/60 bg-surface'
                      : 'border-line bg-surface/40 hover:border-subtle'
                  }`}
                  aria-pressed={isActive}
                >
                  <div className="flex items-center justify-between">
                    <Icon
                      className={`h-5 w-5 transition-colors ${isActive ? 'text-signal' : 'text-subtle'}`}
                      strokeWidth={1.6}
                    />
                    <span
                      className={`font-mono text-[10px] uppercase tracking-[0.2em] ${
                        m.available ? 'text-signal' : 'text-subtle'
                      }`}
                    >
                      {t(`modules.${m.key}.status`)}
                    </span>
                  </div>
                  <div className="mt-5 font-display text-lg leading-tight text-fg">
                    {t(`modules.${m.key}.name`)}
                  </div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">
                    {t(`modules.${m.key}.metric`)}
                  </div>
                  <div className="mt-5 h-14">{m.metricVisual(isActive)}</div>
                  <div className="mt-4 flex items-center gap-2 text-xs text-muted">
                    {isActive ? (
                      <>
                        <span className="grid h-4 w-4 place-items-center rounded-full bg-signal text-ink-950">
                          <Check className="h-2.5 w-2.5" strokeWidth={3} />
                        </span>
                        <span>{t('summary')}</span>
                      </>
                    ) : (
                      <>
                        <Circle className="h-4 w-4 text-subtle" strokeWidth={1.5} />
                        <span className="text-subtle">·</span>
                      </>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Summary panel */}
          <div className="relative rounded-2xl border border-line bg-surface/40 p-6 lg:sticky lg:top-28 lg:self-start">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">
              {t('readiness')}
            </div>
            <div className="mt-3 flex items-end gap-2">
              <motion.div
                key={readiness}
                initial={{ scale: 0.95, opacity: 0.6 }}
                animate={{ scale: 1, opacity: 1 }}
                className="font-display text-6xl tracking-tighter text-fg"
              >
                {readiness}
              </motion.div>
              <span className="mb-2 font-display text-2xl text-subtle">%</span>
            </div>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-surface-alt">
              <motion.div
                initial={false}
                animate={{ width: `${readiness}%` }}
                transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
                className="h-full bg-gradient-to-r from-signal-muted via-signal to-signal-soft"
              />
            </div>

            <div className="mt-8 space-y-2">
              <AnimatePresence initial={false}>
                {modulesDef
                  .filter((m) => active.has(m.key))
                  .map((m) => (
                    <motion.div
                      key={m.key}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      className="flex items-center justify-between rounded-lg border border-line bg-bg/40 px-3 py-2 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            m.available ? 'bg-signal' : 'bg-subtle'
                          }`}
                        />
                        <span className="text-fg/90">{t(`modules.${m.key}.name`)}</span>
                      </div>
                      <span
                        className={`font-mono text-[9px] uppercase tracking-widest ${
                          m.available ? 'text-signal' : 'text-subtle'
                        }`}
                      >
                        {m.available ? t('available') : t('roadmap')}
                      </span>
                    </motion.div>
                  ))}
              </AnimatePresence>
              {active.size === 0 && (
                <div className="rounded-lg border border-dashed border-line px-3 py-4 text-center text-xs text-subtle">
                  ·
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============= Micro visualizations ============= */

function Waveform({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 100 40" className="h-full w-full" preserveAspectRatio="none">
      <motion.path
        d="M0 20 Q 10 5, 20 20 T 40 20 T 60 20 T 80 20 T 100 20"
        fill="none"
        stroke={active ? 'rgb(var(--signal))' : 'rgb(var(--faint))'}
        strokeWidth={1.5}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8 }}
      />
      {active && (
        <motion.circle
          r={2.5}
          fill="rgb(var(--signal))"
          initial={{ cx: 0, cy: 20 }}
          animate={{
            cx: [0, 25, 50, 75, 100],
            cy: [20, 10, 20, 30, 20],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </svg>
  );
}

function ProgressRing({ value }: { value: number }) {
  const r = 14;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <svg viewBox="0 0 40 40" className="h-full">
      <circle cx="20" cy="20" r={r} stroke="rgb(var(--line))" strokeWidth={3} fill="none" />
      <motion.circle
        cx="20"
        cy="20"
        r={r}
        stroke={value > 0 ? 'rgb(var(--signal))' : 'rgb(var(--faint))'}
        strokeWidth={3}
        strokeLinecap="round"
        fill="none"
        transform="rotate(-90 20 20)"
        style={{ strokeDasharray: c, strokeDashoffset: offset }}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
      />
      <text
        x="20"
        y="23"
        textAnchor="middle"
        fontSize="9"
        fill="rgb(var(--fg))"
        fontFamily="ui-monospace, monospace"
      >
        {value}
      </text>
    </svg>
  );
}

function Bars({ active, count = 6 }: { active: boolean; count?: number }) {
  return (
    <div className="flex h-full items-end gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-sm"
          style={{ background: active ? 'rgb(var(--signal))' : 'rgb(var(--faint))' }}
          initial={{ height: '20%' }}
          animate={{ height: `${20 + ((i * 97 + 31) % 70)}%` }}
          transition={{ duration: 0.8, delay: i * 0.05 }}
        />
      ))}
    </div>
  );
}

function TrendLine({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 100 40" className="h-full w-full" preserveAspectRatio="none">
      <motion.polyline
        points="0,30 15,25 30,28 45,18 60,20 75,12 90,14 100,8"
        fill="none"
        stroke={active ? 'rgb(var(--signal))' : 'rgb(var(--faint))'}
        strokeWidth={1.5}
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.9 }}
      />
      {active && (
        <motion.circle
          cx={100}
          cy={8}
          r={2.5}
          fill="rgb(var(--signal))"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 0.6, delay: 0.9 }}
        />
      )}
    </svg>
  );
}
