import { cn } from '@/lib/utils';

interface MarqueeProps {
  items: string[];
  className?: string;
  reverse?: boolean;
  separator?: React.ReactNode;
}

export function Marquee({ items, className, reverse, separator }: MarqueeProps) {
  const defaultSep = (
    <span aria-hidden className="mx-8 inline-block h-1.5 w-1.5 rounded-full bg-signal/70" />
  );
  const sep = separator ?? defaultSep;
  const doubled = [...items, ...items];
  return (
    <div className={cn('mask-edges-x overflow-hidden', className)}>
      <div
        className={cn(
          'flex w-max whitespace-nowrap',
          reverse ? 'animate-marquee-reverse' : 'animate-marquee',
        )}
      >
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="font-display text-4xl font-medium uppercase tracking-tight text-fg/80 md:text-6xl">
              {item}
            </span>
            {sep}
          </span>
        ))}
      </div>
    </div>
  );
}
