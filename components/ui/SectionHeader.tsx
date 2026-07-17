import { cn } from '@/lib/utils';
import { styleFromOverride, type CmsStyleMap } from '@/lib/styleOverride';
import { Reveal, RevealText } from './Reveal';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
  /** Dot-path into messages/*.json, e.g. "whatYouCanGet.eyebrow" — enables click-to-edit in the CMS visual editor. */
  eyebrowKey?: string;
  titleKey?: string;
  descriptionKey?: string;
  styles?: CmsStyleMap;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
  eyebrowKey,
  titleKey,
  descriptionKey,
  styles,
}: SectionHeaderProps) {
  const eyebrowFullKey = eyebrowKey && `content:${eyebrowKey}`;
  const titleFullKey = titleKey && `content:${titleKey}`;
  const descriptionFullKey = descriptionKey && `content:${descriptionKey}`;

  return (
    <div
      className={cn(
        'flex max-w-3xl flex-col gap-5',
        align === 'center' && 'mx-auto items-center text-center',
        className,
      )}
    >
      {eyebrow && (
        <Reveal>
          <span
            className="eyebrow"
            data-cms-key={eyebrowFullKey}
            style={eyebrowFullKey ? styleFromOverride(styles?.[eyebrowFullKey]) : undefined}
          >
            {eyebrow}
          </span>
        </Reveal>
      )}
      <h2
        className="font-display text-display-xs text-balance text-fg"
        data-cms-key={titleFullKey}
        style={titleFullKey ? styleFromOverride(styles?.[titleFullKey]) : undefined}
      >
        <RevealText text={title} />
      </h2>
      {description && (
        <Reveal delay={0.15}>
          <p
            className="text-pretty max-w-2xl text-lg leading-relaxed text-muted"
            data-cms-key={descriptionFullKey}
            style={descriptionFullKey ? styleFromOverride(styles?.[descriptionFullKey]) : undefined}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
