import { useReveal } from "@/lib/useReveal";
import { useTilt } from "@/lib/useTilt";
import { RevealText } from "../ui/RevealText";
import { SectionHeading } from "../ui/SectionHeading";
import { approach } from "@/data/resume";

/** One stage of the pipeline, plus the connector leading to the next one — the numbering here is a real sequence, not decoration. */
function Stage({
  index,
  total,
  title,
  description,
}: {
  index: number;
  total: number;
  title: string;
  description: string;
}) {
  const tiltRef = useTilt<HTMLDivElement>(4);
  const isLast = index === total;

  return (
    <div className="relative flex flex-1 flex-col lg:flex-row">
      <div
        ref={tiltRef}
        className="tilt-card group relative flex-1 border border-gold-dim bg-ink-2/50 p-8"
      >
        <div className="tilt-card-glow" aria-hidden="true" />
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold/70">
          Stage {String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
        <h3 className="mt-4 font-display text-2xl text-bone">{title}</h3>
        <p className="mt-3 text-muted leading-relaxed">{description}</p>
      </div>

      {!isLast && (
        <div
          className="relative hidden shrink-0 lg:flex lg:w-14 lg:items-center lg:justify-center"
          aria-hidden="true"
        >
          <span className="h-px w-full bg-gold-dim" />
          <span
            className="signal-pulse absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-gold"
            style={{ animationDelay: `${index * 0.35}s` }}
          />
        </div>
      )}
      {!isLast && (
        <div className="my-3 flex justify-center lg:hidden" aria-hidden="true">
          <span className="h-8 w-px bg-gold-dim" />
        </div>
      )}
    </div>
  );
}

export function Approach() {
  const ref = useReveal<HTMLDivElement>({ stagger: 0.1 });

  return (
    <section id="approach" className="relative py-28 sm:py-36 bg-ink-2/40">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <SectionHeading eyebrow="Approach" title="How a project actually moves through me." />

        <div ref={ref} className="mt-16 flex flex-col lg:flex-row">
          {approach.map((p, i) => (
            <RevealText key={p.title} as="div" className="flex flex-1">
              <Stage index={i + 1} total={approach.length} title={p.title} description={p.description} />
            </RevealText>
          ))}
        </div>
      </div>
    </section>
  );
}
