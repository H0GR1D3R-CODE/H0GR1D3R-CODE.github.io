import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

/** Animates a number from 0 to `target` when the element scrolls into view. */
export function useCountUp<T extends HTMLElement>(target: number, decimals = 0) {
  const ref = useRef<T | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reducedMotion) {
      el.textContent = target.toFixed(decimals);
      return;
    }

    const counter = { value: 0 };
    const ctx = gsap.context(() => {
      gsap.to(counter, {
        value: target,
        duration: 1.6,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
        onUpdate: () => {
          el.textContent = counter.value.toFixed(decimals);
        },
      });
    }, el);

    return () => ctx.revert();
  }, [target, decimals, reducedMotion]);

  return ref;
}
