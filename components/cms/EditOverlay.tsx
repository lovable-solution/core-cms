'use client';

import { useEffect, useRef, useState } from 'react';

const CMS_ORIGIN = process.env.NEXT_PUBLIC_CMS_URL ?? 'http://localhost:3001';

type HoverRect = { top: number; left: number; width: number; height: number; label: string } | null;

export function EditOverlay({ enabled }: { enabled: boolean }) {
  const [rect, setRect] = useState<HoverRect>(null);
  const targetRef = useRef<HTMLElement | null>(null);
  const inIframeRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    inIframeRef.current = window.parent !== window;
    if (!inIframeRef.current) return;

    // Decorative overlays (gradients/scrims) frequently sit visually on top of the
    // real editable element (an image, a text block). event.target only gives the
    // topmost hit, so walk the full stack at this point instead of trusting it.
    function findEditableAtPoint(x: number, y: number): HTMLElement | null {
      const stack = document.elementsFromPoint(x, y);
      for (const el of stack) {
        const match = el.closest?.('[data-cms-key]');
        if (match instanceof HTMLElement) return match;
      }
      return null;
    }

    function updateRectFor(target: HTMLElement) {
      const r = target.getBoundingClientRect();
      const key = target.getAttribute('data-cms-key') ?? '';
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height, label: labelFor(key) });
    }

    function onMouseMove(e: MouseEvent) {
      const target = findEditableAtPoint(e.clientX, e.clientY);
      if (target === targetRef.current) return;
      targetRef.current = target;
      if (target) updateRectFor(target);
      else setRect(null);
    }

    function onScrollOrResize() {
      if (targetRef.current) updateRectFor(targetRef.current);
    }

    function onClick(e: MouseEvent) {
      const target = findEditableAtPoint(e.clientX, e.clientY);
      if (!target) return;
      e.preventDefault();
      e.stopPropagation();

      const key = target.getAttribute('data-cms-key') ?? '';
      const r = target.getBoundingClientRect();
      const value = target.getAttribute('data-cms-value') ?? target.textContent ?? '';

      window.parent.postMessage(
        {
          type: 'cms:edit',
          key,
          value,
          rect: { top: r.top, left: r.left, width: r.width, height: r.height },
        },
        CMS_ORIGIN,
      );
    }

    document.addEventListener('mousemove', onMouseMove, true);
    document.addEventListener('click', onClick, true);
    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);

    return () => {
      document.removeEventListener('mousemove', onMouseMove, true);
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [enabled]);

  if (!enabled || !rect) return null;

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        outline: '2px solid #e4002b',
        outlineOffset: '2px',
        borderRadius: 4,
        background: 'rgba(228, 0, 43, 0.06)',
        pointerEvents: 'none',
        zIndex: 2147483000,
        transition: 'top 0.05s linear, left 0.05s linear, width 0.05s linear, height 0.05s linear',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: -22,
          left: 0,
          background: '#e4002b',
          color: 'white',
          font: '600 10px/1.6 monospace',
          padding: '1px 6px',
          borderRadius: 3,
          whiteSpace: 'nowrap',
        }}
      >
        {rect.label}
      </span>
    </div>
  );
}

function labelFor(key: string): string {
  const [kind, path] = key.split(':');
  if (kind === 'media') return `Image · click to replace`;
  return path ?? key;
}
