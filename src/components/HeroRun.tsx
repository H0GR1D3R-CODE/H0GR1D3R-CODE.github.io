import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { cn } from "@/lib/cn";
import { HatGradient, SledPanda } from "./Panda";
import { demos } from "./Showcase";

const HEIGHT = 128;
const PAD = 38;

/**
 * How far the page has scrolled through the pinned hero, from 0 to 1.
 * The hero is taller than the screen while pinned; this is the share of
 * that extra height already used up.
 */
export function pinProgress(section: HTMLElement): number {
  const box = section.getBoundingClientRect();
  const travel = box.height - window.innerHeight;
  return travel > 0 ? Math.min(Math.max(-box.top / travel, 0), 1) : 0;
}

type HeroRunProps = {
  /** Id of the project in the front window of the deck. */
  active: string;
  /** True when the hero is pinned and scrolling drives the deck. */
  pinned: boolean;
  onSelect: (id: string) => void;
};

/**
 * A short downhill with one flag per live project. While the hero is
 * pinned, scrolling sleds the panda down it and each flag it reaches
 * brings that project to the front of the deck. Where the hero is not
 * pinned (phones, short screens, reduced motion) the flags are simply
 * buttons, and the sled goes to whichever project is in front.
 */
export function HeroRun({ active, pinned, onSelect }: HeroRunProps) {
  const reduced = usePrefersReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const sledRef = useRef<SVGGElement>(null);
  const at = useRef(0);
  const [width, setWidth] = useState(480);

  const count = demos.length;
  const index = Math.max(0, demos.findIndex((p) => p.id === active));
  const xOf = (pos: number) => PAD + (pos * (width - 2 * PAD)) / (count - 1);
  const hill = (x: number) => 58 + 30 * (x / width) + 4 * Math.sin((x / width) * 8);
  const slope = (x: number) => (30 + 32 * Math.cos((x / width) * 8)) / width;

  /** Put the sled at a position along the run: 0 is the first flag, count - 1 the last. */
  const place = (pos: number) => {
    at.current = pos;
    const x = xOf(pos);
    const tilt = (Math.atan(slope(x)) * 180) / Math.PI;
    sledRef.current?.setAttribute("transform", `translate(${x.toFixed(1)} ${hill(x).toFixed(1)}) rotate(${tilt.toFixed(1)}) scale(0.9)`);
  };

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => setWidth(Math.max(260, el.clientWidth));
    measure();
    const watcher = new ResizeObserver(measure);
    watcher.observe(el);
    return () => watcher.disconnect();
  }, []);

  // Pinned: the sled follows the scroll exactly, between flags as well as on them.
  useEffect(() => {
    const section = wrapRef.current?.closest("section");
    if (!pinned || !section) return;
    let frame = 0;
    const follow = () => {
      frame = 0;
      place(Math.min(Math.max(pinProgress(section) * count - 0.5, 0), count - 1));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(follow);
    };
    follow();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pinned, width, count]);

  // Not pinned: the sled slides to whichever project is in front.
  useEffect(() => {
    if (pinned) return;
    if (reduced) {
      place(index);
      return;
    }
    const from = at.current;
    const started = performance.now();
    let frame = 0;
    const step = (now: number) => {
      const t = Math.min((now - started) / 550, 1);
      place(from + (index - from) * (1 - (1 - t) ** 3));
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pinned, index, reduced, width]);

  let snow = `M0 ${HEIGHT} L0 ${hill(0).toFixed(1)}`;
  for (let x = 16; x < width + 16; x += 16) snow += ` L${x} ${hill(x).toFixed(1)}`;
  snow += ` L${width + 16} ${HEIGHT} Z`;

  return (
    <div>
      <p className="flex flex-wrap items-baseline justify-between gap-x-4 text-sm text-ink-2">
        <span>
          <span className="font-semibold text-ink">{pinned ? "Keep scrolling." : "Pick a flag."}</span>{" "}
          {pinned ? "Each flag the sled reaches brings a project forward." : "Each one brings a project forward."}
        </span>
        <span className="font-mono text-xs" aria-hidden="true">
          {index + 1} / {count}
        </span>
      </p>

      <div ref={wrapRef} className="relative mt-2 overflow-hidden rounded-2xl" style={{ height: HEIGHT }}>
        <svg width={width} height={HEIGHT} className="absolute inset-0" aria-hidden="true" focusable="false">
          <path d={snow} fill="var(--ridge-near)" />
        </svg>

        {demos.map((p, i) => {
          const x = xOf(i);
          return (
            <div key={p.id}>
              <button
                type="button"
                className="run-flag"
                style={{ left: x, top: hill(x) + 2 }}
                aria-pressed={i === index}
                aria-label={`Bring ${p.name} forward`}
                data-found={i <= index || undefined}
                onClick={() => onSelect(p.id)}
              >
                <svg viewBox="0 0 30 54" width="26" height="47" aria-hidden="true" focusable="false">
                  <path d="M5 53V4" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" />
                  <path className="flag-pennant" d="M6 5 L28 13 L6 22 Z" stroke="var(--ink)" strokeWidth="1.75" strokeLinejoin="round" />
                </svg>
              </button>
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute -translate-x-1/2 whitespace-nowrap text-xs font-semibold",
                  i === index ? "text-ink" : "text-ink-2"
                )}
                style={{ left: x, top: hill(x) + 12 }}
              >
                {p.name}
              </span>
            </div>
          );
        })}

        <svg width={width} height={HEIGHT} className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden="true" focusable="false">
          <defs>
            <HatGradient id="hat-hero-run" />
          </defs>
          <g ref={sledRef}>
            <SledPanda hatId="hat-hero-run" />
          </g>
        </svg>
      </div>
    </div>
  );
}
