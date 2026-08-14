import { useReveal } from "@/lib/useReveal";
import { RevealText } from "../ui/RevealText";
import { SectionHeading } from "../ui/SectionHeading";
import { TimelineSpine } from "../ui/Timeline";
import { leadership } from "@/data/resume";

export function Leadership() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="leadership" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <SectionHeading index="08" eyebrow="Leadership" title="Beyond the classroom and the codebase." />

        <div ref={ref} className="relative mt-16 pl-8 sm:pl-12">
          <TimelineSpine className="absolute left-0 top-0 bottom-0 w-4" />

          <div className="flex flex-col gap-16">
            {leadership.map((item) => (
              <RevealText key={item.org} as="div" className="relative">
                <span className="absolute -left-8 sm:-left-12 top-1.5 h-3 w-3 -translate-x-1/2 rounded-full bg-gold shadow-[0_0_0_4px_var(--color-ink)]" />
                <p className="font-mono text-xs uppercase tracking-[0.15em] text-gold mb-2">
                  {item.start} — {item.end}
                </p>
                <h3 className="font-display text-2xl sm:text-3xl text-bone mb-1">{item.role}</h3>
                <p className="text-muted mb-5">{item.org}</p>
                <ul className="flex flex-col gap-2">
                  {item.bullets.map((b) => (
                    <li key={b} className="flex gap-3 text-muted leading-relaxed">
                      <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
                      {b}
                    </li>
                  ))}
                </ul>
              </RevealText>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
