import { useReveal } from "@/lib/useReveal";
import { RevealText } from "../ui/RevealText";
import { SectionHeading } from "../ui/SectionHeading";
import { languages, summary, type Language } from "@/data/resume";

/** A thin vertical bar reading like a mixer channel — proficiency as signal strength, not a generic progress bar. */
function EqBar({ name, level, weight, delay }: Language & { delay: number }) {
  return (
    <div data-reveal className="flex min-w-0 flex-col items-center gap-3">
      <div className="relative flex h-24 w-2.5 items-end overflow-hidden rounded-full bg-ink-3">
        <div
          className="signal-eq w-full rounded-full bg-gradient-to-t from-gold to-gold-lite"
          style={{ height: `${weight * 100}%`, "--eq-delay": `${delay}s` } as React.CSSProperties}
        />
      </div>
      <div className="text-center">
        <p className="font-display text-sm text-bone">{name}</p>
        <p className="mt-0.5 font-mono text-[9px] uppercase leading-tight tracking-[0.1em] text-muted">
          {level}
        </p>
      </div>
    </div>
  );
}

export function About() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="about" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <SectionHeading eyebrow="About" title="A little about the person behind the code." />

        <div ref={ref} className="mt-16 grid grid-cols-1 gap-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <RevealText
            as="p"
            className="dropcap max-w-2xl text-xl leading-relaxed text-muted sm:text-2xl"
          >
            {summary}
          </RevealText>

          <div data-reveal className="flex flex-col gap-14">
            {/* Portrait placeholder — drop an image at src/assets/portrait.jpg to replace */}
            <div className="relative ml-auto max-w-[260px]">
              <div className="pointer-events-none absolute -left-3 -top-3 h-full w-full border border-gold/40" />
              <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden bg-gradient-to-br from-ink-2 via-ink-3 to-ink-2">
                <span className="select-none font-display text-8xl text-gold/40">NS</span>
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(232,208,138,0.18),transparent_60%)]" />
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <p className="text-eyebrow text-right lg:text-left">Signal strength, by language</p>
              <div className="grid grid-cols-5 gap-2 sm:gap-4">
                {languages.map((lang, i) => (
                  <EqBar key={lang.name} {...lang} delay={i * 0.4} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
