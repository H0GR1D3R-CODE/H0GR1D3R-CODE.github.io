import type { CSSProperties } from "react";
import { about, skills, spokenLanguages } from "@/data/resume";
import { PandaScene } from "./Panda";

/** "English and Malayalam (full professional), Hindi and Arabic (limited working), German (elementary)" */
function spokenSummary() {
  const byLevel = new Map<string, string[]>();
  for (const { name, level } of spokenLanguages) byLevel.set(level, [...(byLevel.get(level) ?? []), name]);
  return [...byLevel].map(([level, names]) => `${names.join(" and ")} (${level})`).join(", ");
}

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="bg-bg-2 py-16 sm:py-24">
      <div className="mx-auto grid max-w-[76rem] gap-x-14 gap-y-10 px-4 sm:px-8 lg:grid-cols-12">
        <div className="slide-from-left lg:col-span-4">
          <PandaScene className="aspect-[4/5] w-full max-w-[22rem] rounded-[1.75rem] border border-line" />
        </div>

        <div className="lg:col-span-8">
          <h2 id="about-title" className="rise font-display text-4xl font-extrabold tracking-[-0.02em] sm:text-5xl">
            About
          </h2>
          <div className="mt-6 flex max-w-[44rem] flex-col gap-4 text-lg">
            {about.map((paragraph, i) => (
              <p key={paragraph} className="rise" style={{ "--i": i } as CSSProperties}>
                {paragraph}
              </p>
            ))}
          </div>

          <h3 className="rise mt-12 font-display text-2xl font-extrabold tracking-[-0.015em]">Skills</h3>
          <dl className="mt-5 grid gap-x-10 gap-y-6 sm:grid-cols-2">
            {skills.map((group, i) => (
              <div key={group.label} className="rise" style={{ "--i": i % 2 } as CSSProperties}>
                <dt className="font-display font-bold">{group.label}</dt>
                <dd className="mt-1 text-ink-2">{group.items.join(", ")}</dd>
              </div>
            ))}
            <div className="rise sm:col-span-2">
              <dt className="font-display font-bold">Spoken languages</dt>
              <dd className="mt-1 text-ink-2">{spokenSummary()}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
