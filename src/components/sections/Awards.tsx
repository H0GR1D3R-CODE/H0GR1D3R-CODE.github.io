import { useReveal } from "@/lib/useReveal";
import { useTilt } from "@/lib/useTilt";
import { RevealText } from "../ui/RevealText";
import { SectionHeading } from "../ui/SectionHeading";
import { GlassCard } from "../ui/GlassCard";
import { awards, type Award } from "@/data/resume";

function AwardCard({ award }: { award: Award }) {
  const tiltRef = useTilt<HTMLDivElement>(7);

  return (
    <GlassCard ref={tiltRef} className="tilt-card h-full p-8 flex flex-col">
      <div className="tilt-card-glow" aria-hidden="true" />
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="mb-6 text-gold" aria-hidden="true">
        <path
          d="M12 2l2.6 5.27 5.82.85-4.21 4.1 1 5.8L12 15.27 6.79 18.02l1-5.8-4.21-4.1 5.82-.85L12 2z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
      <h3 className="font-display text-xl text-bone mb-1">{award.title}</h3>
      <p className="font-mono text-xs uppercase tracking-[0.15em] text-gold mb-4">{award.issuer}</p>
      <p className="text-muted leading-relaxed flex-1">{award.description}</p>
      <p className="mt-6 font-mono text-xs uppercase tracking-[0.15em] text-muted">{award.date}</p>
    </GlassCard>
  );
}

export function Awards() {
  const ref = useReveal<HTMLDivElement>({ stagger: 0.1 });

  return (
    <section id="awards" className="relative py-28 sm:py-36 bg-ink-2/40">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <SectionHeading index="09" eyebrow="Awards" title="Recognized along the way." />

        <div ref={ref} className="mt-16 grid gap-6 md:grid-cols-3">
          {awards.map((award) => (
            <RevealText key={award.title} as="div">
              <AwardCard award={award} />
            </RevealText>
          ))}
        </div>
      </div>
    </section>
  );
}
