import { useReveal } from "@/lib/useReveal";
import { useTilt } from "@/lib/useTilt";
import { RevealText } from "../ui/RevealText";
import { SectionHeading } from "../ui/SectionHeading";
import { approach } from "@/data/resume";

function PrincipleCard({ index, title, description }: { index: number; title: string; description: string }) {
  const tiltRef = useTilt<HTMLDivElement>(6);

  return (
    <div ref={tiltRef} className="tilt-card group relative rounded-2xl border border-gold-dim bg-ink-2/60 p-8 h-full">
      <div className="tilt-card-glow" aria-hidden="true" />
      <span className="font-mono text-xs text-gold/60">{String(index).padStart(2, "0")}</span>
      <h3 className="mt-4 font-display text-2xl text-bone">{title}</h3>
      <p className="mt-3 text-muted leading-relaxed">{description}</p>
    </div>
  );
}

export function Approach() {
  const ref = useReveal<HTMLDivElement>({ stagger: 0.1 });

  return (
    <section id="approach" className="relative py-28 sm:py-36 bg-ink-2/40">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <SectionHeading index="02" eyebrow="Approach" title="How I actually work." />

        <div ref={ref} className="mt-16 grid gap-6 sm:grid-cols-2">
          {approach.map((p, i) => (
            <RevealText key={p.title} as="div">
              <PrincipleCard index={i + 1} title={p.title} description={p.description} />
            </RevealText>
          ))}
        </div>
      </div>
    </section>
  );
}
