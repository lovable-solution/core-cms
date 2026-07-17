'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

/**
 * Interactive canvas: grid of dots that react to mouse.
 * Dots closer to cursor brighten and drift slightly toward it.
 * Subtle, industrial — no three.js, lightweight.
 */
export function HeroCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;
    const mouse = { x: -9999, y: -9999, active: false };

    const isDark = resolvedTheme !== 'light';
    const baseAlpha = isDark ? 0.18 : 0.22;
    const hotAlpha = isDark ? 0.95 : 0.85;
    const dotBase = isDark ? '255, 255, 255' : '20, 20, 22';
    const signalRGB = '230, 47, 77';
    const gap = 36;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const dots: { x: number; y: number; ox: number; oy: number; v: number }[] = [];
    const build = () => {
      dots.length = 0;
      for (let y = gap; y < h; y += gap) {
        for (let x = gap; x < w; x += gap) {
          dots.push({ x, y, ox: x, oy: y, v: Math.random() * 0.5 });
        }
      }
    };

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      const R = 140; // influence radius
      for (const d of dots) {
        const dx = d.x - mouse.x;
        const dy = d.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        const t = Math.max(0, 1 - dist / R);
        // Ease toward mouse
        const targetX = d.ox - (dx / (dist || 1)) * t * 6;
        const targetY = d.oy - (dy / (dist || 1)) * t * 6;
        d.x += (targetX - d.x) * 0.08;
        d.y += (targetY - d.y) * 0.08;

        const alpha = baseAlpha + (hotAlpha - baseAlpha) * t;
        const radius = 0.9 + t * 2.2;
        if (t > 0.55) {
          ctx.fillStyle = `rgba(${signalRGB}, ${alpha})`;
        } else {
          ctx.fillStyle = `rgba(${dotBase}, ${alpha})`;
        }
        ctx.beginPath();
        ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(render);
    };

    resize();
    build();
    render();

    const ro = new ResizeObserver(() => {
      resize();
      build();
    });
    ro.observe(canvas);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, [resolvedTheme]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden
    />
  );
}
