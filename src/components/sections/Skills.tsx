import { useReveal } from "@/lib/useReveal";
import { RevealText } from "../ui/RevealText";
import { SectionHeading } from "../ui/SectionHeading";
import { Marquee } from "../ui/Marquee";
import { Tag } from "../ui/Tag";
import { skills, focusAreas } from "@/data/resume";

export function Skills() {
  const ref = useReveal<HTMLDivElement>({ stagger: 0.08 });

  return (
    <section id="skills" className="relative py-28 sm:py-36 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <SectionHeading index="05" eyebrow="Skills" title="The toolkit, end to end." />
      </div>

      <div className="mt-12 border-y border-gold-dim py-5">
        <Marquee
          items={[...focusAreas]}
          itemClassName="font-mono text-sm uppercase tracking-[0.15em] text-gold/70"
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <div ref={ref} className="mt-16 grid gap-10 sm:grid-cols-2">
          {skills.map((group) => (
            <RevealText key={group.label} as="div" className="rounded-2xl border border-gold-dim p-8">
              <h3 className="font-display text-xl text-gold mb-5">{group.label}</h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <Tag key={item}>{item}</Tag>
                ))}
              </div>
            </RevealText>
          ))}
        </div>
      </div>
    </section>
  );
}
