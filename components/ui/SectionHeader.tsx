import { cn } from '@/lib/utils';
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
}: SectionHeaderProps) {
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
          <span className="eyebrow" data-cms-key={eyebrowKey && `content:${eyebrowKey}`}>
            {eyebrow}
          </span>
        </Reveal>
      )}
      <h2
        className="font-display text-display-xs text-balance text-fg"
        data-cms-key={titleKey && `content:${titleKey}`}
      >
        <RevealText text={title} />
      </h2>
      {description && (
        <Reveal delay={0.15}>
          <p
            className="text-pretty max-w-2xl text-lg leading-relaxed text-muted"
            data-cms-key={descriptionKey && `content:${descriptionKey}`}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
