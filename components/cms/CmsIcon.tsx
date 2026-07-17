import type { LucideIcon } from 'lucide-react';
import { resolveIcon } from '@/lib/iconRegistry';
import { iconStyleFromOverride, type CmsStyleMap } from '@/lib/styleOverride';

export function CmsIcon({
  cmsKey,
  icon: Icon,
  styles,
  className,
  strokeWidth,
}: {
  cmsKey: string;
  icon: LucideIcon;
  styles?: CmsStyleMap;
  className?: string;
  strokeWidth?: number;
}) {
  const override = styles?.[cmsKey];
  const Resolved = resolveIcon(override?.iconName) ?? Icon;
  const style: React.CSSProperties = { ...iconStyleFromOverride(override) };
  if (override?.iconSize) {
    style.width = override.iconSize;
    style.height = override.iconSize;
  }

  return (
    <Resolved
      className={className}
      strokeWidth={strokeWidth}
      style={style}
      data-cms-key={cmsKey}
    />
  );
}
