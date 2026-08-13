import { useReveal } from "@/lib/useReveal";
import { RevealText } from "../ui/RevealText";
import { SectionHeading } from "../ui/SectionHeading";
import { languages, summary } from "@/data/resume";

function LanguageMeter({ name, level, weight }: { name: string; level: string; weight: number }) {
  return (
    <div data-reveal>
      <div className="flex items-baseline justify-between mb-2">
        <span className="font-display text-lg text-bone">{name}</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">{level}</span>
      </div>
      <div className="h-px w-full bg-gold-dim overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-gold to-gold-lite origin-left"
          style={{ width: `${weight * 100}%` }}
        />
      </div>
    </div>
  );
}

export function About() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="about" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <SectionHeading index="01" eyebrow="About" title="A little about the person behind the code." />

        <div ref={ref} className="mt-16 grid gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Portrait placeholder — drop an image at src/assets/portrait.jpg to replace */}
          <div data-reveal className="order-2 lg:order-1">
            <div className="relative mx-auto max-w-sm">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-gold-dim bg-gradient-to-br from-ink-2 via-ink-3 to-ink-2 flex items-center justify-center">
                <span className="font-display text-8xl text-gold/40 select-none">NS</span>
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(232,208,138,0.18),transparent_60%)]" />
              </div>
              <div className="pointer-events-none absolute -inset-3 -z-10 rounded-[2rem] border border-gold-dim/50" />
            </div>
          </div>

          <div className="order-1 lg:order-2 flex flex-col gap-12">
            <RevealText as="p" className="text-lg sm:text-xl leading-relaxed text-muted">
              {summary}
            </RevealText>

            <div className="flex flex-col gap-6">
              <RevealText as="p" className="text-eyebrow">
                Languages
              </RevealText>
              <div className="grid gap-6 sm:grid-cols-2">
                {languages.map((lang) => (
                  <LanguageMeter key={lang.name} {...lang} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
