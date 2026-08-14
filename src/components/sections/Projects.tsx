import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeading } from "../ui/SectionHeading";
import { Tag } from "../ui/Tag";
import { projects } from "@/data/resume";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { useTilt } from "@/lib/useTilt";
import { cn } from "@/lib/cn";

gsap.registerPlugin(ScrollTrigger);

function ProjectPanel({ project }: { project: (typeof projects)[number] }) {
  const tiltRef = useTilt<HTMLDivElement>(5);

  return (
    <article className="flex h-full w-full md:w-[70vw] lg:w-[52vw] shrink-0 flex-col justify-center md:px-4 lg:px-8">
      <div
        ref={tiltRef}
        className="tilt-card relative rounded-3xl border border-gold-dim bg-ink-2/60 backdrop-blur-sm p-8 sm:p-12 h-full flex flex-col justify-center overflow-hidden"
      >
        <div className="tilt-card-glow" aria-hidden="true" />
        <span className="font-display text-7xl sm:text-8xl text-gold/20 leading-none mb-6">
          {project.index}
        </span>

        <h3 className="font-display text-3xl sm:text-4xl text-bone leading-tight mb-4">
          {project.title}
        </h3>

        <p className="font-mono text-xs uppercase tracking-[0.15em] text-gold mb-6">
          {project.start} — {project.end}
        </p>

        <p className="text-muted leading-relaxed mb-8 max-w-xl">{project.description}</p>

        <div className="flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <Tag key={t}>{t}</Tag>
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
        <SectionHeading index="04" eyebrow="Projects" title="Things I've built and broken." />
      </div>

      <div
        ref={trackRef}
        className={cn(
          "flex flex-col gap-6 px-6 sm:px-10 md:flex-row md:gap-8 md:px-0 md:pl-10",
          "md:w-max"
        )}
      >
        {projects.map((p) => (
          <div key={p.title} className="md:h-[60vh] h-auto">
            <ProjectPanel project={p} />
          </div>
        ))}
        <div className="hidden md:block w-[4vw] shrink-0" aria-hidden="true" />
      </div>
    </section>
  );
}
