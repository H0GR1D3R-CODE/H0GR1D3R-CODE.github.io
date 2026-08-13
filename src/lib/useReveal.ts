import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

type RevealOptions = {
  y?: number;
  duration?: number;
  stagger?: number;
  start?: string;
  delay?: number;
};

/**
 * Attach to a container ref; animates all direct [data-reveal] children
 * up-and-in as the container enters the viewport. Reduced-motion renders
 * the final state immediately with no animation.
 */
export function useReveal<T extends HTMLElement>(options: RevealOptions = {}) {
  const ref = useRef<T | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = el.querySelectorAll<HTMLElement>("[data-reveal]");
    if (targets.length === 0) return;

    if (reducedMotion) {
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(targets, { opacity: 0, y: options.y ?? 36 });
      ScrollTrigger.batch(targets, {
        start: options.start ?? "top 85%",
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: options.duration ?? 1,
            delay: options.delay ?? 0,
            stagger: options.stagger ?? 0.12,
            ease: "power3.out",
          }),
      });
    }, el);

    return () => ctx.revert();
  }, [reducedMotion, options.y, options.duration, options.stagger, options.start, options.delay]);

  return ref;
}
