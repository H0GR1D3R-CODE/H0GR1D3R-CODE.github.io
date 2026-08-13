import { useEffect, useRef } from "react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

/** Eases an element toward the cursor within `radius`px, springs back on leave. */
export function useMagnetic<T extends HTMLElement>(radius = 70, strength = 0.4) {
  const ref = useRef<T | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const quickX = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
    const quickY = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);

      if (dist < radius + rect.width / 2) {
        quickX(dx * strength);
        quickY(dy * strength);
      } else {
        quickX(0);
        quickY(0);
      }
    };

    const onLeave = () => {
      quickX(0);
      quickY(0);
    };

    window.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [radius, strength, reducedMotion]);

  return ref;
}
