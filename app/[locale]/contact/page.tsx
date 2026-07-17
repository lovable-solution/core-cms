import type { Metadata } from 'next';
import { Suspense } from 'react';
import type { ElementType } from 'react';
import { Mail, MapPin } from 'lucide-react';
import { LinkedinIcon } from '@/components/ui/LinkedinIcon';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { PageHero } from '@/components/ui/PageHero';
import { Reveal } from '@/components/ui/Reveal';
import { ContactForm } from '@/components/ui/ContactForm';
import { DualClock } from '@/components/ui/DualClock';
import { siteConfig } from '@/lib/utils';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.contact' });
  return { title: t('title'), description: t('description') };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ContactPageInner />;
}

function ContactPageInner() {
  const hero = useTranslations('pageHero.contact');
  const t = useTranslations('contact');

  return (
    <>
      <PageHero
        eyebrow={hero('eyebrow')}
        index={hero('index')}
        title={hero('title')}
        keyPrefix="pageHero.contact"
      />

      <section className="py-20">
        <div className="container-wide grid gap-16 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <div className="flex flex-col gap-8">
              <div className="rounded-3xl border border-line bg-surface/30 p-8">
                <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-signal">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
                  </span>
                  {t('statusBadge')}
                </div>
                <div className="mt-6">
                  <DualClock />
                </div>
                <p className="mt-6 text-sm leading-relaxed text-muted">
                  {t('statusBody')}
                </p>
              </div>

              <Info
                icon={Mail}
                label={t('info.email.label')}
                value={siteConfig.email}
                href={`mailto:${siteConfig.email}`}
              />
              <Info
                icon={LinkedinIcon}
                label={t('info.linkedin.label')}
                value={t('info.linkedin.value')}
                href={siteConfig.linkedin}
                external
              />
              <Info
                icon={MapPin}
                label={t('info.regions.label')}
                value={t('info.regions.value')}
              />
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="rounded-3xl border border-line bg-surface/30 p-8 md:p-12">
              <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-surface/50" />}>
                <ContactForm />
              </Suspense>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function Info({
  icon: Icon,
  label,
  value,
  href,
  external,
}: {
  icon: ElementType;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  const inner = (
    <div className="flex items-start gap-4">
      <div className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line bg-surface/60">
        <Icon className="h-4 w-4 text-signal" strokeWidth={1.5} />
      </div>
      <div>
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-subtle">
          {label}
        </div>
        <div className="mt-1 text-fg">{value}</div>
      </div>
    </div>
  );
  if (href) {
    return (
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className="block rounded-2xl border border-line bg-bg/30 p-6 transition-colors hover:border-subtle"
      >
        {inner}
      </a>
    );
  }
  return <div className="rounded-2xl border border-line bg-bg/30 p-6">{inner}</div>;
}
