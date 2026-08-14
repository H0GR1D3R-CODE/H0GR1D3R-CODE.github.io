import { useReveal } from "@/lib/useReveal";
import { useTilt } from "@/lib/useTilt";
import { RevealText } from "../ui/RevealText";
import { SectionHeading } from "../ui/SectionHeading";
import { GlassCard } from "../ui/GlassCard";
import { experience, type Experience as ExperienceItem } from "@/data/resume";

function ExperienceCard({ job }: { job: ExperienceItem }) {
  const tiltRef = useTilt<HTMLDivElement>(4);

  return (
    <GlassCard ref={tiltRef} className="tilt-card p-8 sm:p-10">
      <div className="tilt-card-glow" aria-hidden="true" />
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-6">
        <div>
          <h3 className="font-display text-2xl sm:text-3xl text-bone">{job.role}</h3>
          <p className="mt-1 text-gold font-mono text-sm">{job.org}</p>
        </div>
        <div className="text-right font-mono text-xs uppercase tracking-[0.15em] text-muted whitespace-nowrap">
          <p>{job.start} — {job.end}</p>
          <p className="mt-1">{job.location}</p>
        </div>
      </div>
      <ul className="flex flex-col gap-3">
        {job.bullets.map((b) => (
          <li key={b} className="flex gap-3 text-muted leading-relaxed">
            <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
            {b}
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}

export function Experience() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="experience" className="relative py-28 sm:py-36 bg-ink-2/40">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <SectionHeading index="03" eyebrow="Experience" title="Where I've put the skills to work." />

        <div ref={ref} className="mt-16 flex flex-col gap-8">
          {experience.map((job) => (
            <RevealText key={job.org} as="div">
              <ExperienceCard job={job} />
            </RevealText>
          ))}
        </div>
      </div>
    </section>
  );
}
