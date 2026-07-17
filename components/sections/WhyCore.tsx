'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Reveal, RevealText } from '@/components/ui/Reveal';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { styleFromOverride, type CmsStyleMap } from '@/lib/styleOverride';

const rawStats = [
  { value: 7, suffix: '+' },
  { value: 2, suffix: '' },
  { value: 100, suffix: '%' },
];

export function WhyCore({ styles }: { styles: CmsStyleMap }) {
  const t = useTranslations('whyCore');
  const stats = t.raw('stats') as { label: string }[];
  const points = t.raw('points') as { label: string; title: string; desc: string }[];

  return (
    <section id="why-core" className="relative border-t border-line py-24 md:py-32">
      <div className="container-wide">
        <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <span
              className="eyebrow"
              data-cms-key="content:whyCore.eyebrow"
              style={styleFromOverride(styles['content:whyCore.eyebrow'])}
            >
              {t('eyebrow')}
            </span>
            <h2 className="mt-6 font-display text-display-xs text-balance tracking-tighter text-fg">
              <span data-cms-key="content:whyCore.title1" style={styleFromOverride(styles['content:whyCore.title1'])}>
                <RevealText text={t('title1')} />
              </span>
              <br />
              <span
                className="text-muted"
                data-cms-key="content:whyCore.title2"
                style={styleFromOverride(styles['content:whyCore.title2'])}
              >
                <RevealText text={t('title2')} delay={0.15} />
              </span>
            </h2>

            <div className="mt-12 grid grid-cols-3 gap-4 border-t border-line pt-8">
              {rawStats.map((s, i) => {
                const key = `content:whyCore.stats.${i}.label`;
                return (
                  <motion.div
                    key={stats[i]?.label ?? i}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.7, delay: i * 0.1 }}
                  >
                    <div className="font-display text-4xl text-fg md:text-5xl">
                      <AnimatedNumber value={s.value} suffix={s.suffix} />
                    </div>
                    <div
                      className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-subtle"
                      data-cms-key={key}
                      style={styleFromOverride(styles[key])}
                    >
                      {stats[i]?.label}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Reveal>

          <div>
            <ul className="divide-y divide-line border-y border-line">
              {points.map((p, i) => {
                const labelKey = `content:whyCore.points.${i}.label`;
                const titleKey = `content:whyCore.points.${i}.title`;
                const descKey = `content:whyCore.points.${i}.desc`;
                return (
                  <motion.li
                    key={p.label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7, delay: i * 0.08 }}
                    className="group grid grid-cols-[auto_1fr] gap-6 py-8"
                  >
                    <div className="w-32 shrink-0">
                      <span
                        className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal"
                        data-cms-key={labelKey}
                        style={styleFromOverride(styles[labelKey])}
                      >
                        {p.label}
                      </span>
                    </div>
                    <div>
                      <h3
                        className="font-display text-xl text-fg md:text-2xl"
                        data-cms-key={titleKey}
                        style={styleFromOverride(styles[titleKey])}
                      >
                        {p.title}
                      </h3>
                      <p
                        className="mt-2 max-w-xl text-pretty leading-relaxed text-muted"
                        data-cms-key={descKey}
                        style={styleFromOverride(styles[descKey])}
                      >
                        {p.desc}
                      </p>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
