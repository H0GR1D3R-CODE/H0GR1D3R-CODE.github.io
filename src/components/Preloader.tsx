import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

export function Preloader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const monogramRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      onDone();
      return;
    }

    const counter = { value: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(rootRef.current, {
          yPercent: -100,
          duration: 0.9,
          ease: "power4.inOut",
          onComplete: onDone,
        });
      },
    });

    tl.fromTo(
      monogramRef.current,
      { opacity: 0, scale: 0.85 },
      { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" }
    ).to(
      counter,
      {
        value: 100,
        duration: 1.3,
        ease: "power1.inOut",
        onUpdate: () => setCount(Math.round(counter.value)),
      },
      "-=0.2"
    );

    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-ink"
      role="status"
      aria-label="Loading"
    >
      <div ref={monogramRef} className="font-display text-6xl text-gold">
        NS
      </div>
      <div className="font-mono text-xs tracking-[0.3em] text-muted">
        {String(count).padStart(3, "0")}
      </div>
    </div>
  );
}
