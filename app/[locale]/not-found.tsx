import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/Button';
import { GridLines, RadialGlow } from '@/components/ui/GridLines';

export default function NotFound() {
  const t = useTranslations('notFound');
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      <GridLines />
      <RadialGlow from="rgba(230,47,77,0.12)" />
      <div className="container-wide relative">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <span className="eyebrow !mx-auto">{t('eyebrow')}</span>
          <h1 className="mt-6 font-display text-display-sm tracking-tightest text-fg">
            {t('title')}
          </h1>
          <p className="mt-4 max-w-lg text-pretty text-lg leading-relaxed text-muted">
            {t('desc')}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button href="/" size="lg" withArrow>
              {t('cta')}
            </Button>
            <Link
              href="/contact"
              className="text-sm text-muted underline-offset-4 hover:text-signal hover:underline"
            >
              {t('alt')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
