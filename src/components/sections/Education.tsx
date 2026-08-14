import { useReveal } from "@/lib/useReveal";
import { useCountUp } from "@/lib/useCountUp";
import { RevealText } from "../ui/RevealText";
import { SectionHeading } from "../ui/SectionHeading";
import { TimelineSpine } from "../ui/Timeline";
import { education, type EducationItem } from "@/data/resume";

function EducationCard({ item }: { item: EducationItem }) {
  const decimals = Number.isInteger(item.metricValue) ? 0 : 2;
  const metricRef = useCountUp<HTMLSpanElement>(item.metricValue, decimals);

  return (
    <div className="relative grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-gold mb-2">
          {item.start} — {item.end}
        </p>
        <h3 className="font-display text-2xl sm:text-3xl text-bone mb-1">{item.institution}</h3>
        <p className="text-muted">{item.credential}</p>
      </div>

      <div className="text-left sm:text-right">
        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted mb-1">{item.metricLabel}</p>
        <p className="font-display text-4xl sm:text-5xl text-gold">
          <span ref={metricRef}>0</span>
          {item.metricSuffix}
        </p>
      </div>
    </div>
  );
}

export function Education() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="education" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <SectionHeading index="10" eyebrow="Education" title="The record so far." />

        <div ref={ref} className="relative mt-16 pl-8 sm:pl-12">
          <TimelineSpine className="absolute left-0 top-0 bottom-0 w-4" />

          <div className="flex flex-col gap-14">
            {education.map((item) => (
              <RevealText key={item.institution} as="div" className="relative">
                <span className="absolute -left-8 sm:-left-12 top-1.5 h-3 w-3 -translate-x-1/2 rounded-full bg-gold shadow-[0_0_0_4px_var(--color-ink)]" />
                <EducationCard item={item} />
              </RevealText>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
