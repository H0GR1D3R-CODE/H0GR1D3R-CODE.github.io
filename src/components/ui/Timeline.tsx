import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

/**
 * A vertical SVG line whose stroke draws in as the container scrolls
 * through view. Renders behind timeline nodes supplied by the caller.
 */
export function TimelineSpine({ className }: { className?: string }) {
  const pathRef = useRef<SVGPathElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const path = pathRef.current;
    const wrap = wrapRef.current;
    if (!path || !wrap) return;

    const setHeight = () => {
      const h = wrap.offsetHeight;
      path.setAttribute("d", `M1,0 L1,${h}`);
      return h;
    };

    if (reducedMotion) {
      setHeight();
      path.style.strokeDashoffset = "0";
      return;
    }

    let ctx: gsap.Context | undefined;

    const build = () => {
      const h = setHeight();
      path.style.strokeDasharray = `${h}`;
      path.style.strokeDashoffset = `${h}`;

      ctx?.revert();
      ctx = gsap.context(() => {
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            start: "top 75%",
            end: "bottom 60%",
            scrub: 0.6,
          },
        });
      }, wrap);
    };

    build();
    const ro = new ResizeObserver(() => build());
    ro.observe(wrap);

    return () => {
      ro.disconnect();
      ctx?.revert();
    };
  }, [reducedMotion]);

  return (
    <div ref={wrapRef} className={className}>
      <svg width="2" height="100%" className="h-full overflow-visible" preserveAspectRatio="none">
        <line x1="1" y1="0" x2="1" y2="100%" stroke="rgba(200,162,76,0.15)" strokeWidth="2" />
        <path ref={pathRef} stroke="var(--color-gold)" strokeWidth="2" fill="none" />
      </svg>
    </div>
  );
}
