'use client';

import { forwardRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface BaseProps {
  variant?: Variant;
  size?: Size;
  withArrow?: boolean;
  className?: string;
  children: React.ReactNode;
}

const baseStyles =
  'group relative inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium tracking-tight transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50';

const variants: Record<Variant, string> = {
  primary:
    'bg-signal text-ink-950 hover:bg-signal-soft hover:shadow-[0_10px_40px_-10px_rgb(var(--signal)/0.6)]',
  secondary:
    'bg-fg text-bg hover:opacity-90',
  ghost:
    'text-fg hover:text-signal',
  outline:
    'border border-line text-fg hover:border-signal hover:text-signal',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm rounded-full',
  md: 'h-11 px-6 text-sm rounded-full',
  lg: 'h-14 px-8 text-base rounded-full',
};

type ButtonProps = BaseProps &
  (
    | ({ href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children' | 'href'>)
    | ({ href?: undefined } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>)
  );

export const Button = forwardRef<HTMLElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', withArrow = false, className, children, ...props },
  ref,
) {
  const classes = cn(baseStyles, variants[variant], sizes[size], className);

  const content = (
    <>
      <span className="relative z-10">{children}</span>
      {withArrow && (
        <ArrowUpRight
          className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          strokeWidth={2}
        />
      )}
    </>
  );

  if ('href' in props && props.href) {
    const { href, ...rest } = props as { href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={classes}
        {...rest}
      >
        {content}
      </Link>
    );
  }
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={classes}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
});
