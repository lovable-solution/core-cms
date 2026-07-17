import { styleFromOverride, type CmsStyleMap } from '@/lib/styleOverride';
import { Reveal, RevealText } from './Reveal';
import { GridLines, RadialGlow } from './GridLines';

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description?: string;
  index?: string;
  /** Dot-path prefix into messages/*.json, e.g. "pageHero.about" — enables click-to-edit in the CMS visual editor. */
  keyPrefix?: string;
  styles?: CmsStyleMap;
}

const BRAND_RED = '#E4002B';

/** Render copy, styling every core+ wordmark with the red plus. */
function renderBrand(text: string) {
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

export function PageHero({ eyebrow, title, description, index, keyPrefix, styles }: PageHeroProps) {
  const eyebrowKey = keyPrefix && `content:${keyPrefix}.eyebrow`;
  const titleKey = keyPrefix && `content:${keyPrefix}.title`;
  const descriptionKey = keyPrefix && `content:${keyPrefix}.description`;

  return (
    <section className="relative overflow-hidden border-b border-line pb-20 pt-36 md:pt-44">
      <GridLines className="opacity-40" />
      <RadialGlow from="rgba(230,47,77,0.08)" className="top-0 h-[520px]" />
      <div className="container-wide relative">
        <div className="flex items-end justify-between gap-8">
          <div className="max-w-4xl">
            <Reveal>
              <span
                className="eyebrow"
                data-cms-key={eyebrowKey}
                style={eyebrowKey ? styleFromOverride(styles?.[eyebrowKey]) : undefined}
              >
                {eyebrow}
              </span>
            </Reveal>
            <h1
              className="mt-6 font-display text-display-sm text-balance tracking-tighter text-fg"
              data-cms-key={titleKey}
              style={titleKey ? styleFromOverride(styles?.[titleKey]) : undefined}
            >
              <RevealText text={title} />
            </h1>
            {description && (
              <Reveal delay={0.2}>
                <p
                  className="mt-8 max-w-2xl text-lg leading-relaxed text-muted"
                  data-cms-key={descriptionKey}
                  style={descriptionKey ? styleFromOverride(styles?.[descriptionKey]) : undefined}
                >
                  {renderBrand(description)}
                </p>
              </Reveal>
            )}
          </div>
          {index && (
            <Reveal delay={0.3} className="hidden shrink-0 md:block">
              <div className="font-mono text-sm uppercase tracking-widest text-subtle">
                <span className="text-signal">⟐</span> {index}
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
