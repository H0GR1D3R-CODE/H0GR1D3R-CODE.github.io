import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { splitChars } from "@/lib/splitText";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { cn } from "@/lib/cn";

gsap.registerPlugin(ScrollTrigger);

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  index?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({ eyebrow, title, index, align = "left", className }: SectionHeadingProps) {
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = titleRef.current;
    if (!el || reducedMotion) return;

    const ctx = gsap.context(() => {
      const chars = splitChars(el);
      gsap.set(chars, { yPercent: 120 });
      gsap.to(chars, {
        yPercent: 0,
        duration: 1,
        stagger: 0.018,
        ease: "power4.out",
        scrollTrigger: { trigger: el, start: "top 88%" },
      });
    }, el);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div className={cn(align === "center" && "text-center", className)}>
      <div className={cn("flex items-center gap-3 mb-4", align === "center" && "justify-center")}>
        {index && <span className="text-eyebrow opacity-70">{index}</span>}
        <span className="text-eyebrow">{eyebrow}</span>
        <span className="h-px flex-1 max-w-16 bg-gold-dim" />
      </div>
      <h2
        ref={titleRef}
        className="clip-lines text-4xl sm:text-5xl md:text-6xl font-display font-medium leading-[1.05] text-bone"
      >
        {title}
      </h2>
    </div>
  );
}
