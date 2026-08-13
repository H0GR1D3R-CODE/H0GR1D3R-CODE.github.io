import { useReveal } from "@/lib/useReveal";
import { RevealText } from "../ui/RevealText";
import { SectionHeading } from "../ui/SectionHeading";
import { certifications } from "@/data/resume";

export function Certifications() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="certifications" className="relative py-28 sm:py-36 bg-ink-2/40">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <SectionHeading index="05" eyebrow="Certifications" title="Continuous, verified learning." />

        <div ref={ref} className="mt-16 divide-y divide-gold-dim border-t border-b border-gold-dim">
          {certifications.map((cert) => (
            <RevealText
              key={cert.name}
              as="div"
              className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-6"
            >
              <div>
                <h3 className="font-display text-xl sm:text-2xl text-bone group-hover:text-gold transition-colors">
                  {cert.name}
                </h3>
                <p className="mt-1 font-mono text-xs uppercase tracking-[0.15em] text-gold">{cert.issuer}</p>
              </div>
              <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted whitespace-nowrap">
                {cert.date}
              </p>
            </RevealText>
          ))}
        </div>
      </div>
    </section>
  );
}
