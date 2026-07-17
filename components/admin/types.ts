export type CmsSelection = {
  key: string;
  kind: 'content' | 'media' | 'icon' | 'button';
  value: string;
  tagName: string;
  rect: { top: number; left: number; width: number; height: number };
  computedStyle: {
    fontSize?: number;
    fontWeight?: number;
    color?: string;
    textAlign?: string;
    borderRadius?: number;
  };
};

export type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export const ADMIN_PAGES: { label: string; path: string }[] = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Products', path: '/products' },
  { label: 'Contact', path: '/contact' },
];
