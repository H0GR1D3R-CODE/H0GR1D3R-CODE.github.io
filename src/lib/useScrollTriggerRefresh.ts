import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Forces a global ScrollTrigger.refresh() once the page has actually
 * settled — after web fonts finish swapping in and after the window
 * `load` event. The pinned Projects rail inserts a large pin-spacer that
 * can shift the absolute scroll position of everything below it; a
 * refresh after layout settles keeps every other trigger's cached
 * coordinates (count-up numbers, timeline draws, batched reveals) correct.
 */
export function useScrollTriggerRefresh(dep: boolean) {
  useEffect(() => {
    if (!dep) return;

    const refresh = () => ScrollTrigger.refresh();
    const raf = requestAnimationFrame(() => requestAnimationFrame(refresh));

    document.fonts?.ready?.then(refresh).catch(() => {});
    window.addEventListener("load", refresh);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", refresh);
    };
  }, [dep]);
}
