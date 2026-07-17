'use client';

import { MousePointerClick } from 'lucide-react';
import type { CmsSelection } from './types';
import { TextPanel } from './panels/TextPanel';
import { ButtonPanel } from './panels/ButtonPanel';
import { ImagePanel } from './panels/ImagePanel';
import { IconPanel } from './panels/IconPanel';
import { ThemePanel } from './panels/ThemePanel';
import { TypographyPanel } from './panels/TypographyPanel';
import { MediaLibraryPanel } from './panels/MediaLibraryPanel';

export type InspectorMode = 'edit' | 'theme' | 'typography' | 'media';

export function Inspector({
  mode,
  selection,
  locale,
  onSaved,
  onSelectMediaSlot,
}: {
  mode: InspectorMode;
  selection: CmsSelection | null;
  locale: string;
  onSaved: () => void;
  onSelectMediaSlot: (cmsKey: string) => void;
}) {
  if (selection) {
    switch (selection.kind) {
      case 'content':
        return <TextPanel selection={selection} locale={locale} onSaved={onSaved} />;
      case 'button':
        return <ButtonPanel selection={selection} locale={locale} onSaved={onSaved} />;
      case 'media':
        return <ImagePanel selection={selection} onSaved={onSaved} />;
      case 'icon':
        return <IconPanel selection={selection} onSaved={onSaved} />;
    }
  }

  if (mode === 'theme') return <ThemePanel onSaved={onSaved} />;
  if (mode === 'typography') return <TypographyPanel onSaved={onSaved} />;
  if (mode === 'media') return <MediaLibraryPanel onSelect={onSelectMediaSlot} />;

  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center text-subtle">
      <MousePointerClick className="h-6 w-6" />
      <p className="text-sm">Click any text, button, image, or icon in the preview to edit it.</p>
    </div>
  );
}
