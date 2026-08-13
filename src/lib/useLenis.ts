import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

// Module-level singleton so any component can trigger a programmatic scroll
// through Lenis. Lenis re-asserts its own scroll position every animation
// frame, so calling the browser's native `scrollIntoView`/`scrollTo` while
// Lenis is active gets silently overridden a frame later — every
// click-to-navigate control must go through `scrollToId` instead.
let activeLenis: Lenis | null = null;

/**
 * Boots a single Lenis smooth-scroll instance for the app lifetime and
 * syncs it to GSAP's ticker so ScrollTrigger stays frame-accurate. Skipped
 * entirely under reduced-motion so the browser's native (instant) scroll
 * behavior is preserved.
 */
export function useLenis() {
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    activeLenis = lenis;

    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    lenis.on("scroll", ScrollTrigger.update);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      activeLenis = null;
    };
  }, [reducedMotion]);
}

/** Scrolls to a section by id, routed through Lenis when it's active. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  if (activeLenis) {
    activeLenis.scrollTo(el, { offset: 0 });
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

