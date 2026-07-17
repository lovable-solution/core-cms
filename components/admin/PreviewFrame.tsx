'use client';

import { Monitor, Tablet, Smartphone } from 'lucide-react';

export type DeviceWidth = 'full' | 'tablet' | 'mobile';

const WIDTHS: Record<DeviceWidth, string> = {
  full: '100%',
  tablet: '834px',
  mobile: '390px',
};

export function PreviewFrame({
  src,
  device,
  onDeviceChange,
  iframeRef,
  onLoad,
}: {
  src: string;
  device: DeviceWidth;
  onDeviceChange: (d: DeviceWidth) => void;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  onLoad?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-center gap-1 border-b border-white/10 bg-black/20 py-2">
        {(
          [
            ['full', Monitor],
            ['tablet', Tablet],
            ['mobile', Smartphone],
          ] as [DeviceWidth, typeof Monitor][]
        ).map(([d, Icon]) => (
          <button
            key={d}
            type="button"
            onClick={() => onDeviceChange(d)}
            className={`grid h-7 w-7 place-items-center rounded-md transition-colors ${
              device === d ? 'bg-white/10 text-fg' : 'text-subtle hover:text-fg'
            }`}
            aria-label={d}
          >
            <Icon className="h-3.5 w-3.5" />
          </button>
        ))}
      </div>
      <div className="flex flex-1 justify-center overflow-auto bg-black/40 p-4">
        <iframe
          ref={iframeRef}
          src={src}
          onLoad={onLoad}
          style={{ width: WIDTHS[device], maxWidth: '100%' }}
          className="h-full min-h-[600px] rounded-lg border border-white/10 bg-white"
          title="Site preview"
        />
      </div>
    </div>
  );
}
