import { useEffect, useRef, useState, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

/** Builds a gentle vertical S-wave down to `height`, oscillating around `midX`. */
function buildWavePath(height: number, midX: number, amplitude: number, wavelength: number) {
  if (height <= 0) return "";
  let d = `M${midX},0`;
  let y = 0;
  let dir = 1;
  while (y < height) {
    const nextY = Math.min(y + wavelength, height);
    const span = nextY - y;
    const x = midX + dir * amplitude;
    d += ` C${x},${y + span * 0.35} ${x},${y + span * 0.65} ${midX},${nextY}`;
    dir *= -1;
    y = nextY;
  }
  return d;
}

/**
 * The site's signature device: one continuous signal waveform running the
 * full height of the page, just inside the left edge, that draws itself in
 * as you scroll. Sensor data, network traffic, a vocal line, an encrypted
 * packet — every domain on this site is, underneath, a signal. This line
 * is that idea made literal: the one thread that ties every section
 * together instead of each one sitting in its own isolated box.
 *
 * Desktop only (xl+) — on narrower viewports there's no real gutter for it
 * to live in without colliding with section content.
 */
export function SignalSpine({ containerRef }: { containerRef: RefObject<HTMLElement | null> }) {
  const pathRef = useRef<SVGPathElement | null>(null);
  const [height, setHeight] = useState(0);
  const reducedMotion = usePrefersReducedMotion();
  const midX = 20;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Measure synchronously up front — don't wait on the observer's first
    // callback, which some environments (non-composited tabs, some test
    // harnesses) never fire. The observer below only needs to catch
    // *later* size changes from here on.
    setHeight(el.offsetHeight);

    const ro = new ResizeObserver((entries) => {
      const h = entries[0]?.contentRect.height ?? el.offsetHeight;
      setHeight(h);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [containerRef]);

  useEffect(() => {
    const path = pathRef.current;
    if (!path || height === 0) return;

    if (reducedMotion) {
      path.style.strokeDashoffset = "0";
      return;
    }

    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len}`;
    path.style.strokeDashoffset = `${len}`;

    const ctx = gsap.context(() => {
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4,
        },
      });
    });

    return () => ctx.revert();
  }, [height, reducedMotion, containerRef]);

  if (height === 0) return null;

  const d = buildWavePath(height, midX, 13, 260);

  return (
    <div
      className="pointer-events-none absolute inset-y-0 left-3 hidden w-10 xl:block"
      aria-hidden="true"
    >
      <svg width="40" height={height} className="overflow-visible">
        <path d={d} stroke="var(--color-gold-dim)" strokeWidth="1.25" fill="none" opacity="0.6" />
        <path ref={pathRef} d={d} stroke="var(--color-gold)" strokeWidth="1.25" fill="none" opacity="0.85" />
      </svg>
    </div>
  );
}
