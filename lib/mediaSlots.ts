export type MediaSlotDef = {
  key: string;
  label: string;
  group: string;
  fallbackSrc: string;
  fallbackAlt: string;
};

export const MEDIA_SLOTS: MediaSlotDef[] = [
  { key: 'brand.logoDark', label: 'Logo (light mode)', group: 'Brand', fallbackSrc: '/logo-core.png', fallbackAlt: 'core+' },
  { key: 'brand.logoLight', label: 'Logo (dark mode)', group: 'Brand', fallbackSrc: '/logo-core-white.png', fallbackAlt: 'core+' },
  { key: 'brand.logoPlus', label: 'Logo — red plus mark', group: 'Brand', fallbackSrc: '/logo-plus.png', fallbackAlt: '' },
  { key: 'hero.bgImage', label: 'Homepage hero background', group: 'Home', fallbackSrc: '/hero_bg.png', fallbackAlt: '' },
  { key: 'howCoreWorks.image', label: 'How Core Works image', group: 'Home', fallbackSrc: '/images/section3/1.webp', fallbackAlt: '' },
  { key: 'coreSystems.image', label: 'Core Systems image', group: 'Home', fallbackSrc: '/images/section4/1.webp', fallbackAlt: '' },
  { key: 'pilotPartners.image', label: 'Pilot Partners image', group: 'Home', fallbackSrc: '/images/section5/1.webp', fallbackAlt: '' },
  { key: 'about.regionsPhoto', label: 'About — regions photo', group: 'About', fallbackSrc: '/regions.jpeg', fallbackAlt: 'Core regional presence' },
  { key: 'about.founders.darryl', label: 'About — Darryl photo', group: 'About', fallbackSrc: '/left.png', fallbackAlt: 'Darryl' },
  { key: 'about.founders.will', label: 'About — Will photo', group: 'About', fallbackSrc: '/right.png', fallbackAlt: 'Will' },
  { key: 'products.hpeDashboard', label: 'Products — HPE dashboard', group: 'Products', fallbackSrc: '/products/hpe-dashboard.jpeg', fallbackAlt: 'HPE dashboard' },
  { key: 'products.documentEngine', label: 'Products — Document Engine', group: 'Products', fallbackSrc: '/products/document-engine.jpeg', fallbackAlt: 'core+ Document Production Engine' },
  { key: 'products.environmental', label: 'Products — Environmental Intelligence', group: 'Products', fallbackSrc: '/products/environmental-intelligence.jpeg', fallbackAlt: '' },
  { key: 'products.station', label: 'Products — Safety & Performance Station', group: 'Products', fallbackSrc: '/products/safety-station.webp', fallbackAlt: '' },
  { key: 'products.bespoke', label: 'Products — Bespoke Systems', group: 'Products', fallbackSrc: '/products/bespoke-systems.jpeg', fallbackAlt: '' },
];

export function mediaSlotLabel(key: string): string {
  return MEDIA_SLOTS.find((s) => s.key === key)?.label ?? key;
}
