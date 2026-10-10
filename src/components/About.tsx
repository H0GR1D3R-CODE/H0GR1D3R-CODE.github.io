import type { CSSProperties } from "react";
import { about, skills, spokenLanguages } from "@/data/resume";
import { PandaAtWork } from "./Panda";

/** "English and Malayalam (full professional), Hindi and Arabic (limited working), German (elementary)" */
function spokenSummary() {
  const byLevel = new Map<string, string[]>();
  for (const { name, level } of spokenLanguages) byLevel.set(level, [...(byLevel.get(level) ?? []), name]);
  return [...byLevel].map(([level, names]) => `${names.join(" and ")} (${level})`).join(", ");
}

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="about-scene bg-bg-2 py-16 sm:py-24">
      <div className="mx-auto grid max-w-[76rem] gap-x-14 gap-y-10 px-4 sm:px-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          {/* Sticky on wide screens, so the figure keeps performing beside the text as it scrolls. */}
          <div className="at-work mx-auto max-w-[27rem] lg:sticky lg:top-28">
            <PandaAtWork className="w-full overflow-visible" />
          </div>
        </div>

        <div className="lg:col-span-7">
          <h2 id="about-title" className="rise title">
            About
          </h2>
          {/* The first paragraph is the statement: large, and it inks in a word at a time as it is scrolled past. */}
          <p className="statement mt-7 max-w-[46rem] font-display text-[clamp(1.5rem,1.1rem+1.5vw,2.25rem)] font-semibold leading-[1.18] tracking-[-0.025em]">
            {about[0].split(" ").map((word, i) => (
              <span key={i} className="ink-in" style={{ "--w": i } as CSSProperties}>
                {word}{" "}
              </span>
            ))}
          </p>
          <div className="mt-7 flex max-w-[44rem] flex-col gap-4 text-lg">
            {about.slice(1).map((paragraph, i) => (
              <p key={paragraph} className="rise" style={{ "--i": i } as CSSProperties}>
                {paragraph}
              </p>
            ))}
          </div>

          <h3 className="rise mt-12 font-display text-2xl font-extrabold tracking-[-0.015em]">Skills</h3>
          <dl className="mt-5 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {skills.map((group, i) => (
              <div key={group.label} className="rise" style={{ "--i": i % 2 } as CSSProperties}>
                <dt className="font-semibold">{group.label}</dt>
                <dd className="mt-1 text-ink-2">{group.items.join(", ")}</dd>
              </div>
            ))}
            <div className="rise sm:col-span-2">
              <dt className="font-semibold">Spoken languages</dt>
              <dd className="mt-1 text-ink-2">{spokenSummary()}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
