import { useReveal } from "@/lib/useReveal";
import { useCountUp } from "@/lib/useCountUp";
import { RevealText } from "../ui/RevealText";
import { metrics, type Metric } from "@/data/resume";

function MetricTile({ metric }: { metric: Metric }) {
  const ref = useCountUp<HTMLSpanElement>(metric.value);

  return (
    <div className="flex h-full flex-col border-l border-gold-dim pl-5">
      <p className="font-display text-4xl text-gold sm:text-5xl">
        <span ref={ref}>0</span>
        <span>{metric.suffix}</span>
      </p>
      <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.15em] text-bone">{metric.label}</p>
      <p className="mt-1.5 text-xs leading-relaxed text-muted">{metric.context}</p>
    </div>
  );
}

/** The résumé's headline numbers, pulled out of the bullets so they register before anyone reads a paragraph. */
export function Metrics() {
  const ref = useReveal<HTMLDivElement>({ stagger: 0.08 });

  return (
    <section aria-label="Selected numbers" className="relative border-y border-gold-dim py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <div ref={ref} className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-6">
          {metrics.map((m) => (
            <RevealText key={m.label} as="div">
              <MetricTile metric={m} />
            </RevealText>
          ))}
        </div>
      </div>
    </section>
  );
}
