import { cn } from '@/lib/utils';

export function GridLines({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-0 bg-grid-dark bg-[size:72px_72px] mask-fade-b opacity-60',
        className,
      )}
    />
  );
}

export function NoiseOverlay({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-overlay bg-noise',
        className,
      )}
    />
  );
}

export function RadialGlow({
  className,
  from = 'rgba(230,47,77,0.18)',
  to = 'transparent',
}: {
  className?: string;
  from?: string;
  to?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0', className)}
      style={{
        background: `radial-gradient(ellipse at center, ${from} 0%, ${to} 60%)`,
      }}
    />
  );
}
