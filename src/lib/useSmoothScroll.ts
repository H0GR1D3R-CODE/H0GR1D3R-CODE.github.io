import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

/**
 * Eases wheel scrolling so the scroll-linked animations glide instead of
 * stepping. Scrolling stays native underneath: keyboard, scrollbar, find-in-
 * page and anchor links all behave as usual. It is left off for touch
 * devices, which already scroll with momentum, and for reduced motion.
 */
export function useSmoothScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (calm || !mouse) return;

    const lenis = new Lenis({ lerp: 0.115, anchors: true, autoRaf: true });
    return () => lenis.destroy();
  }, [enabled]);
}
