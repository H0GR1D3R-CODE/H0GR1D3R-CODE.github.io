import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { cn } from "@/lib/cn";

type Flake = { x: number; y: number; r: number; fall: number; sway: number; depth: number };

function makeFlake(w: number, h: number, anywhere: boolean): Flake {
  const depth = Math.random();
  return {
    x: Math.random() * w,
    y: anywhere ? Math.random() * h : -8,
    r: 0.9 + depth * 2.1,
    fall: 14 + depth * 34,
    sway: Math.random() * Math.PI * 2,
    depth,
  };
}

/**
 * Light snowfall behind a scene. Near flakes are bigger and faster than far
 * ones, and far ones lag behind when the page scrolls, which is what gives
 * the scene its depth. The canvas only animates while it is on screen and
 * the tab is visible, and it is never drawn at all for reduced motion.
 */
export function Snowfall({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || reduced) return;

    let w = 0;
    let h = 0;
    let flakes: Flake[] = [];
    let colour = "#fff";
    let frame = 0;
    let onScreen = false;
    let last = performance.now();
    let lastScroll = window.scrollY;

    const readColour = () => {
      colour = getComputedStyle(canvas).getPropertyValue("--flake").trim() || "#fff";
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const wanted = Math.round(Math.min(Math.max((w * h) / 13000, 26), 110));
      flakes = Array.from({ length: wanted }, () => makeFlake(w, h, true));
    };

    const draw = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const scrolled = window.scrollY - lastScroll;
      lastScroll = window.scrollY;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = colour;
      for (const f of flakes) {
        f.sway += dt * (0.6 + f.depth);
        f.y += f.fall * dt + scrolled * 0.45 * (1 - f.depth);
        f.x += Math.sin(f.sway) * 12 * f.depth * dt;
        if (f.y > h + 8) Object.assign(f, makeFlake(w, h, false));
        else if (f.y < -12) f.y = h + 4;
        ctx.globalAlpha = 0.35 + f.depth * 0.5;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }
      frame = requestAnimationFrame(draw);
    };

    const start = () => {
      cancelAnimationFrame(frame);
      if (!onScreen || document.hidden) return;
      last = performance.now();
      lastScroll = window.scrollY;
      frame = requestAnimationFrame(draw);
    };

    readColour();
    resize();

    const sizeWatcher = new ResizeObserver(resize);
    sizeWatcher.observe(canvas);
    const viewWatcher = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      start();
    });
    viewWatcher.observe(canvas);
    // The flake colour is a theme token, so re-read it when the theme flips.
    const themeWatcher = new MutationObserver(readColour);
    themeWatcher.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    document.addEventListener("visibilitychange", start);

    return () => {
      cancelAnimationFrame(frame);
      sizeWatcher.disconnect();
      viewWatcher.disconnect();
      themeWatcher.disconnect();
      document.removeEventListener("visibilitychange", start);
    };
  }, [reduced]);

  if (reduced) return null;

  return <canvas ref={ref} aria-hidden="true" className={cn("pointer-events-none absolute inset-0 size-full", className)} />;
}
