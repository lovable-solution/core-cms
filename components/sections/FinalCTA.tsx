'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { Reveal } from '@/components/ui/Reveal';
import { GridLines, RadialGlow } from '@/components/ui/GridLines';
import { styleFromOverride, type CmsStyleMap } from '@/lib/styleOverride';

const BRAND_RED = '#E4002B';

/** Render the headline, styling the core+ wordmark with the red plus. */
function renderTitle(text: string) {
  const parts = text.split('core+');
  if (parts.length === 1) return text;
  return parts.flatMap((part, i) =>
    i === 0
      ? [part]
      : [
          <span key={i} className="whitespace-nowrap">
            core<span style={{ color: BRAND_RED }}>+</span>
          </span>,
          part,
        ],
  );
}

export function FinalCTA({ styles }: { styles: CmsStyleMap }) {
  const t = useTranslations('finalCTA');
  return (
    <section className="relative overflow-hidden border-t border-line py-28 md:py-40">
      <GridLines />
      <RadialGlow from="rgba(230,47,77,0.18)" />
      <div className="container-wide relative">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 text-center">
          <Reveal>
            <span
              className="eyebrow !mx-auto"
              data-cms-key="content:finalCTA.eyebrow"
              style={styleFromOverride(styles['content:finalCTA.eyebrow'])}
            >
              {t('eyebrow')}
            </span>
          </Reveal>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
            className="font-display text-display-sm text-balance tracking-tightest text-fg"
            data-cms-key="content:finalCTA.title"
            style={styleFromOverride(styles['content:finalCTA.title'])}
          >
            {renderTitle(t('title'))}
          </motion.h2>

          <Reveal delay={0.15}>
            <p
              className="mx-auto max-w-2xl text-pretty text-lg leading-relaxed text-muted"
              data-cms-key="content:finalCTA.subtext"
              style={styleFromOverride(styles['content:finalCTA.subtext'])}
            >
              {t('subtext')}
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <MagneticButton>
                <Button href="/contact" size="lg" withArrow cmsKey="button:finalCTA.cta" styles={styles}>
                  {t('cta')}
                </Button>
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
