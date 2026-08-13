import { lazy, Suspense, useEffect, useRef } from "react";
import gsap from "gsap";
import { profile } from "@/data/resume";
import { splitChars } from "@/lib/splitText";
import { usePrefersReducedMotion, useIsCoarsePointer } from "@/lib/usePrefersReducedMotion";
import { scrollToId } from "@/lib/useLenis";
import { MagneticLink } from "../ui/MagneticLink";
import { useMagnetic } from "@/lib/useMagnetic";

const ObsidianCore = lazy(() => import("./ObsidianCore"));

function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  const ref = useMagnetic<HTMLAnchorElement>(50, 0.5);
  return (
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-gold-dim text-bone transition-colors duration-300 hover:border-gold hover:text-gold"
    >
      {children}
    </a>
  );
}

export function Hero({ ready }: { ready: boolean }) {
  const nameRef = useRef<HTMLHeadingElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const coarsePointer = useIsCoarsePointer();
  const show3d = !reducedMotion && !coarsePointer;

  useEffect(() => {
    if (!ready) return;
    const el = nameRef.current;
    if (!el) return;

    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      const chars = splitChars(el);
      gsap.set(chars, { yPercent: 130 });
      gsap.to(chars, {
        yPercent: 0,
        duration: 1.1,
        stagger: 0.02,
        ease: "power4.out",
        delay: 0.1,
      });

      gsap.from("[data-hero-fade]", {
        opacity: 0,
        y: 20,
        duration: 1,
        stagger: 0.1,
        delay: 0.7,
        ease: "power3.out",
      });
    }, el);

    return () => ctx.revert();
  }, [ready, reducedMotion]);

  return (
    <section id="hero" className="relative flex min-h-[100svh] items-center overflow-hidden pt-24">
      {/* Ambient background orb — CSS fallback always renders; 3D layers on top when supported */}
      <div
        className="pointer-events-none absolute right-[-10%] top-1/2 h-[70vmin] w-[70vmin] -translate-y-1/2 rounded-full opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 40% 40%, rgba(232,208,138,0.35), rgba(200,162,76,0.12) 45%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {show3d && (
        <div className="pointer-events-none absolute right-[-8%] top-1/2 h-[85vmin] w-[85vmin] max-w-[720px] max-h-[720px] -translate-y-1/2">
          <Suspense fallback={null}>
            <ObsidianCore />
          </Suspense>
        </div>
      )}

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-10">
        <p data-hero-fade className="text-eyebrow mb-6">
          {profile.role} — {profile.location}
        </p>

        <h1
          ref={nameRef}
          className="clip-lines font-display text-[13vw] leading-[0.92] tracking-tight text-bone sm:text-[9vw] lg:text-[7.5vw]"
        >
          {profile.name}
        </h1>

        <p data-hero-fade className="mt-8 max-w-xl text-base sm:text-lg text-muted leading-relaxed">
          {profile.tagline} Currently pursuing {profile.degree} at {profile.university}.
        </p>

        <div data-hero-fade className="mt-10 flex flex-wrap items-center gap-4">
          <MagneticLink href="#projects" variant="solid" onClick={(e) => {
            e.preventDefault();
            scrollToId("projects");
          }}>
            View Projects
          </MagneticLink>
          <MagneticLink href={profile.cvPath} variant="outline" download>
            Download CV
          </MagneticLink>
        </div>

        <div data-hero-fade className="mt-12 flex items-center gap-4">
          <SocialIcon href={profile.linkedin} label="LinkedIn profile">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
            </svg>
          </SocialIcon>
          <SocialIcon href={profile.github} label="GitHub profile">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.03a9.5 9.5 0 0 1 5 0c1.91-1.3 2.75-1.03 2.75-1.03.55 1.37.2 2.39.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z" />
            </svg>
          </SocialIcon>
        </div>
      </div>

      <div
        data-hero-fade
        className="absolute bottom-10 left-6 sm:left-10 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted"
      >
        <span className="h-8 w-px bg-gold-dim" />
        Scroll
      </div>
    </section>
  );
}
