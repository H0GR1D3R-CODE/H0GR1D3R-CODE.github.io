import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

/** A full-width statement that fades word-by-word into full gold-lit focus as it scrolls through the viewport centerline — a typographic breather between dense sections. */
export function StatementBreak({ text }: { text: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLParagraphElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = textRef.current;
    if (!el || reducedMotion) return;

    const ctx = gsap.context(() => {
      const words = el.textContent?.split(" ") ?? [];
      el.innerHTML = words
        .map((w) => `<span class="statement-word">${w}</span>`)
        .join(" ");
      const spans = el.querySelectorAll(".statement-word");

      gsap.fromTo(
        spans,
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.06,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            end: "bottom 45%",
            scrub: 0.6,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div ref={containerRef} className="relative py-24 sm:py-36">
      <div className="mx-auto max-w-5xl px-6 sm:px-10">
        <p
          ref={textRef}
          className="font-display text-3xl sm:text-5xl lg:text-6xl leading-[1.15] text-bone text-balance"
        >
          {text}
        </p>
      </div>
    </div>
  );
}

