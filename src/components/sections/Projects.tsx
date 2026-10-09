import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeading } from "../ui/SectionHeading";
import { Tag } from "../ui/Tag";
import { projects, type Project, type ProjectLink } from "@/data/resume";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { useTilt } from "@/lib/useTilt";
import { cn } from "@/lib/cn";

gsap.registerPlugin(ScrollTrigger);

/** Deterministic pseudo-random bar heights from a string seed — every project gets its own fingerprint, not a shared placeholder graphic. */
function seededWave(seed: string, bars: number) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const values: number[] = [];
  for (let i = 0; i < bars; i++) {
    h = (h * 1103515245 + 12345) >>> 0;
    values.push(18 + (h % 82));
  }
  return values;
}

function WaveformSignature({ seed }: { seed: string }) {
  const bars = seededWave(seed, 26);
  return (
    <div className="flex h-9 items-end gap-[3px] opacity-60" aria-hidden="true">
      {bars.map((h, i) => (
        <span key={i} className="w-[3px] rounded-full bg-gold" style={{ height: `${h}%` }} />
      ))}
    </div>
  );
}

function CornerBrackets() {
  const shared = "pointer-events-none absolute h-4 w-4 border-gold/50";
  return (
    <>
      <span className={`${shared} left-4 top-4 border-l border-t`} aria-hidden="true" />
      <span className={`${shared} right-4 top-4 border-r border-t`} aria-hidden="true" />
      <span className={`${shared} bottom-4 left-4 border-b border-l`} aria-hidden="true" />
      <span className={`${shared} bottom-4 right-4 border-b border-r`} aria-hidden="true" />
    </>
  );
}

function dateRange(p: Project) {
  return p.start === p.end ? p.start : `${p.start} — ${p.end}`;
}

function ProjectLinkButton({ link }: { link: ProjectLink }) {
  const live = link.kind === "live";
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noreferrer noopener"
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-300",
        live
          ? "bg-gold text-ink hover:bg-gold-lite"
          : "border border-gold-dim text-bone hover:border-gold hover:text-gold"
      )}
    >
      {link.label}
      <span aria-hidden="true">↗</span>
    </a>
  );
}

function ProjectPanel({ project }: { project: Project }) {
  const tiltRef = useTilt<HTMLDivElement>(5);

  return (
    <article className="flex w-full flex-1">
      <div
        ref={tiltRef}
        className="tilt-card scanlines relative flex w-full flex-col justify-center overflow-hidden border border-gold-dim bg-ink-2/60 p-7 backdrop-blur-sm sm:p-9 lg:p-8 [@media(max-height:820px)]:lg:p-7"
      >
        <div className="tilt-card-glow" aria-hidden="true" />
        <CornerBrackets />

        <div className="mb-4 flex items-center justify-between gap-4">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-gold/70">
            Track {project.index}
            {!project.onResume && <span className="ml-3 text-gold">· New on GitHub</span>}
          </span>
          <WaveformSignature seed={project.title} />
        </div>

        <h3 className="font-display text-2xl sm:text-3xl [@media(max-height:820px)]:lg:text-2xl text-bone leading-tight mb-2">{project.title}</h3>

        <p className="font-mono text-xs uppercase tracking-[0.15em] text-gold mb-3">{dateRange(project)}</p>

        <p className="text-muted leading-relaxed mb-3 max-w-2xl">{project.summary}</p>

        <ul className="mb-4 flex max-w-2xl flex-col gap-2">
          {project.highlights.map((h) => (
            <li key={h} className="flex gap-3 text-sm leading-relaxed text-bone/80">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />
              {h}
            </li>
          ))}
        </ul>

        <div className="mb-5 flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          {project.links.map((l) => (
            <ProjectLinkButton key={l.href} link={l} />
          ))}
        </div>
      </div>
    </article>
  );
}

export function Projects() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const ctx = gsap.context(() => {
        const scrollDistance = () => track.scrollWidth - window.innerWidth;

        const tween = gsap.to(track, {
          x: () => -scrollDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${scrollDistance()}`,
            scrub: 0.8,
            pin: true,
            invalidateOnRefresh: true,
          },
        });

        return () => tween.scrollTrigger?.kill();
      }, section);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, [reducedMotion]);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative w-full overflow-hidden py-28 sm:py-0 md:h-screen md:flex md:flex-col md:justify-center"
    >
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 md:mb-10">
        <SectionHeading eyebrow="Projects" title="Things I've built and broken." />
      </div>

      <div
        ref={trackRef}
        className={cn(
          "flex flex-col gap-6 px-6 sm:px-10 md:flex-row md:gap-8 md:px-0 md:pl-10",
          "md:w-max"
        )}
      >
        {projects.map((p) => (
          <div key={p.title} className="flex md:w-[82vw] lg:w-[56vw] md:shrink-0">
            <ProjectPanel project={p} />
          </div>
        ))}
        <div className="hidden md:block w-[4vw] shrink-0" aria-hidden="true" />
      </div>
    </section>
  );
}
