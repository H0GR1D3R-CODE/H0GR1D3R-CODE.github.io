import { useEffect, useRef } from "react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

/** Subtle pointer-driven 3D tilt + gloss-position tracking for cards. Desktop, fine-pointer only. */
export function useTilt<T extends HTMLElement>(max = 8) {
  const ref = useRef<T | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    el.style.transformStyle = "preserve-3d";
    el.style.setProperty("perspective", "900px");

    const quickX = gsap.quickTo(el, "rotateX", { duration: 0.5, ease: "power3.out" });
    const quickY = gsap.quickTo(el, "rotateY", { duration: 0.5, ease: "power3.out" });
    const quickScale = gsap.quickTo(el, "scale", { duration: 0.5, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      quickX((0.5 - py) * max * 2);
      quickY((px - 0.5) * max * 2);
      el.style.setProperty("--glow-x", `${px * 100}%`);
      el.style.setProperty("--glow-y", `${py * 100}%`);
    };

    const onEnter = () => quickScale(1.015);
    const onLeave = () => {
      quickX(0);
      quickY(0);
      quickScale(1);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [max, reducedMotion]);

  return ref;
}
