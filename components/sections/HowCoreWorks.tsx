'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Reveal, RevealText } from '@/components/ui/Reveal';
import { mediaImageStyle, type MediaSlotValue } from '@/lib/mediaTypes';
import { styleFromOverride, type CmsStyleMap } from '@/lib/styleOverride';

const imgs = ['/images/section3/1.webp', '/images/section3/2.webp', '/images/section3/3.webp'];

export function HowCoreWorks({ image, styles }: { image: MediaSlotValue; styles: CmsStyleMap }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['10%', '-10%']);
  const t = useTranslations('howCoreWorks');
  const steps = t.raw('steps') as { title: string; desc: string }[];

  return (
    <section
      ref={ref}
      id="how-core-works"
      className="relative overflow-hidden py-24 md:py-32"
    >
      <div className="container-wide">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <span
              className="eyebrow"
              data-cms-key="content:howCoreWorks.eyebrow"
              style={styleFromOverride(styles['content:howCoreWorks.eyebrow'])}
            >
              {t('eyebrow')}
            </span>
            <h2 className="mt-6 font-display text-display-xs text-balance tracking-tighter text-fg">
              <span
                data-cms-key="content:howCoreWorks.title1"
                style={styleFromOverride(styles['content:howCoreWorks.title1'])}
              >
                <RevealText text={t('title1')} />
              </span>{' '}
              <span
                className="text-muted"
                data-cms-key="content:howCoreWorks.title2"
                style={styleFromOverride(styles['content:howCoreWorks.title2'])}
              >
                <RevealText text={t('title2')} delay={0.15} />
              </span>
            </h2>
            <p
              className="mt-8 max-w-lg text-pretty text-lg leading-relaxed text-muted"
              data-cms-key="content:howCoreWorks.description"
              style={styleFromOverride(styles['content:howCoreWorks.description'])}
            >
              {t('description')}
            </p>
            <motion.div
              style={{ y }}
              className="relative mt-12 hidden aspect-[4/5] overflow-hidden rounded-2xl border border-line lg:block"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
                style={mediaImageStyle(image)}
                data-cms-key="media:howCoreWorks.image"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent" />
              <div className="absolute bottom-6 start-6 end-6">
                <div
                  className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal"
                  data-cms-key="content:howCoreWorks.overlayEyebrow"
                  style={styleFromOverride(styles['content:howCoreWorks.overlayEyebrow'])}
                >
                  {t('overlayEyebrow')}
                </div>
                <div
                  className="mt-2 font-display text-xl text-ink-50"
                  data-cms-key="content:howCoreWorks.overlayTitle"
                  style={styleFromOverride(styles['content:howCoreWorks.overlayTitle'])}
                >
                  {t('overlayTitle')}
                </div>
              </div>
            </motion.div>
          </Reveal>

          <div className="flex flex-col gap-24">
            {steps.map((step, i) => {
              const titleKey = `content:howCoreWorks.steps.${i}.title`;
              const descKey = `content:howCoreWorks.steps.${i}.desc`;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: [0.2, 0.7, 0.2, 1] }}
                  className="group relative"
                >
                  <div className="flex items-start gap-6">
                    <div className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-signal">
                      0{i + 1}
                    </div>
                    <div className="flex-1">
                      <h3
                        className="font-display text-3xl font-medium text-fg md:text-4xl"
                        data-cms-key={titleKey}
                        style={styleFromOverride(styles[titleKey])}
                      >
                        {step.title}
                      </h3>
                      <p
                        className="mt-4 max-w-xl text-pretty leading-relaxed text-muted"
                        data-cms-key={descKey}
                        style={styleFromOverride(styles[descKey])}
                      >
                        {step.desc}
                      </p>
                    </div>
                  </div>
                  <div className="relative mt-8 aspect-[16/10] overflow-hidden rounded-2xl border border-line">
                    <Image
                      src={imgs[i]}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

    </section>
  );
}
