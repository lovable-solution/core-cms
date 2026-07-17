import type { CSSProperties } from 'react';

// Client-safe: no server-only imports here (next/headers, prisma). Button.tsx,
// CmsIcon.tsx, and other client components depend on this file directly —
// keep getElementStyles() (which needs draftMode()/Prisma) in lib/styles.ts.

export type ElementStyleOverride = {
  fontSize?: number; // px
  fontWeight?: number;
  color?: string; // hex
  textAlign?: 'left' | 'center' | 'right';
  offsetX?: number; // px nudge
  offsetY?: number; // px nudge
  radius?: number; // px, buttons
  buttonVariant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  buttonSize?: 'sm' | 'md' | 'lg';
  iconName?: string;
  iconColor?: string;
  iconSize?: number; // px
};

export type CmsStyleMap = Record<string, ElementStyleOverride>;

export function styleFromOverride(o?: ElementStyleOverride): CSSProperties {
  if (!o) return {};
  const style: CSSProperties = {};
  if (o.fontSize != null) style.fontSize = `${o.fontSize}px`;
  if (o.fontWeight != null) style.fontWeight = o.fontWeight;
  if (o.color) style.color = o.color;
  if (o.textAlign) style.textAlign = o.textAlign;
  if (o.radius != null) style.borderRadius = `${o.radius}px`;
  if (o.offsetX || o.offsetY) style.transform = `translate(${o.offsetX ?? 0}px, ${o.offsetY ?? 0}px)`;
  return style;
}

export function iconStyleFromOverride(o?: ElementStyleOverride): CSSProperties {
  if (!o) return {};
  const style: CSSProperties = {};
  if (o.iconColor) style.color = o.iconColor;
  if (o.offsetX || o.offsetY) style.transform = `translate(${o.offsetX ?? 0}px, ${o.offsetY ?? 0}px)`;
  return style;
}
