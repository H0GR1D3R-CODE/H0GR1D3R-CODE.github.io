import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/** Tracks the visitor's `prefers-reduced-motion` setting live. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => window.matchMedia(QUERY).matches);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
