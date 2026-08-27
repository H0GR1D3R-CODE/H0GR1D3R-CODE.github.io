import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "@/data/resume";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

function useISTClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(new Date());

    setTime(format());
    const id = setInterval(() => setTime(format()), 1000);
    return () => clearInterval(id);
  }, []);

  return time;
}

export function Footer() {
  const nameRef = useRef<HTMLDivElement | null>(null);
  const time = useISTClock();
  const reducedMotion = usePrefersReducedMotion();
  const year = new Date().getFullYear();

  useEffect(() => {
    if (reducedMotion) return;
    const el = nameRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        xPercent: -8,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom bottom", scrub: 0.5 },
      });
    }, el);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <footer className="relative overflow-hidden border-t border-gold-dim pt-20 pb-10">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-14">
          <p className="text-eyebrow">Bengaluru, India — {time || "--:--:--"} IST</p>
          <div className="flex gap-6 font-mono text-xs uppercase tracking-[0.15em] text-muted">
            <a href={profile.linkedin} target="_blank" rel="noreferrer noopener" className="hover:text-gold transition-colors">
              LinkedIn
            </a>
            <a href={profile.github} target="_blank" rel="noreferrer noopener" className="hover:text-gold transition-colors">
              GitHub
            </a>
            <a href={`mailto:${profile.email}`} className="hover:text-gold transition-colors">
              Email
            </a>
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="mx-auto max-w-7xl px-6 sm:px-10">
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold" style={{ animation: "signal-eq 3.6s ease-in-out infinite" }} />
          <span>build {__BUILD_COMMIT__}</span>
          <span className="text-gold-dim">·</span>
          <span>deployed {new Date(__BUILD_DATE__).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
        </div>
      </div>

      <div className="overflow-hidden">
        <div
          ref={nameRef}
          className="whitespace-nowrap font-display text-[16vw] leading-none text-transparent px-6"
          style={{ WebkitTextStroke: "1px var(--color-gold-dim)" }}
        >
          NEBIN STANLY
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 sm:px-10 mt-10 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
          © {year} {profile.name}. Designed &amp; built from scratch.
        </p>
        <a
          href={profile.repoUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted hover:text-gold transition-colors"
        >
          This site is open source →
        </a>
      </div>
    </footer>
  );
}
