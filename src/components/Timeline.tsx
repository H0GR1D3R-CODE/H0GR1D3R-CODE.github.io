import type { CSSProperties } from "react";
import { timeline, type TimelineEntry } from "@/data/resume";
import { cn } from "@/lib/cn";

type Group = { label: string; entries: TimelineEntry[] };

/** One group per year an entry ended in; anything still running is grouped as "Now". */
function groupByYear(entries: TimelineEntry[]): Group[] {
  const groups: Group[] = [];
  for (const e of entries) {
    const label = e.ongoing ? "Now" : String(e.year);
    const last = groups[groups.length - 1];
    if (last?.label === label) last.entries.push(e);
    else groups.push({ label, entries: [e] });
  }
  return groups;
}

function Kind({ entry }: { entry: TimelineEntry }) {
  return (
    <span
      className={cn(
        "rounded-md px-2 pb-0.5 pt-1 font-display text-xs font-bold leading-none",
        entry.kind === "Work" ? "bg-straw text-on-straw" : "border border-edge text-ink-2"
      )}
    >
      {entry.kind}
    </span>
  );
}

function Entry({ entry, i }: { entry: TimelineEntry; i: number }) {
  return (
    <li className="relative">
      {/* The dot on the line. It fills in as the hat passes; work and study get the bigger one. */}
      <span
        aria-hidden="true"
        className={cn(
          "timeline-dot absolute top-[0.4rem] -translate-x-1/2 rounded-full border-2 border-edge bg-bg",
          "left-[calc(var(--track-x)_-_var(--entry-x))]",
          entry.major ? "size-3.5" : "size-2.5"
        )}
      />
      <div className="rise" style={{ "--i": i % 2 } as CSSProperties}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <Kind entry={entry} />
          <span className="font-mono text-sm text-ink-2">{entry.date}</span>
        </div>
        <h4 className={cn("mt-2 font-display font-extrabold", entry.major ? "text-xl sm:text-2xl" : "text-lg")}>
          {entry.title}
        </h4>
        <p className="text-ink-2">
          {entry.org}
          {entry.detail && (
            <>
              {" "}
              <span aria-hidden="true">·</span> <span className="font-semibold text-ink">{entry.detail}</span>
            </>
          )}
        </p>
        {entry.bullets && (
          <ul className="mt-3 flex max-w-[46rem] flex-col gap-2">
            {entry.bullets.map((b) => (
              <li key={b} className="relative pl-5">
                <span className="absolute left-0 top-[0.62em] size-1.5 rounded-full bg-ink-2" aria-hidden="true" />
                {b}
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}

/** The straw hat that rides the line. It is the same hat that marks the start of the map. */
function Rider() {
  return (
    <div className="timeline-track motion-reduce:hidden" aria-hidden="true">
      <div className="timeline-rider">
        <span className="timeline-travelled" />
        <svg viewBox="-16 -16 32 22" className="absolute left-1/2 top-0 w-9 -translate-x-1/2 -translate-y-[70%]" focusable="false">
          <path d="M-13 0 Q0 4.5 13 0 L0 -12 Z" fill="var(--straw)" stroke="var(--map-route-case)" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

export function Timeline() {
  const groups = groupByYear(timeline);

  return (
    <section id="timeline" aria-labelledby="timeline-title" className="py-16 sm:py-24">
      <div className="mx-auto max-w-[76rem] px-4 sm:px-8">
        <h2 id="timeline-title" className="rise font-display text-4xl font-extrabold tracking-[-0.02em] sm:text-5xl">
          Timeline
        </h2>
        <p className="rise mt-3 max-w-xl text-lg text-ink-2">
          Work, study, certificates, volunteering and awards on one line, newest first.
        </p>

        {/* --entry-x is where entry content starts, so each dot can find its way back to the line. */}
        <div className="timeline relative mt-12 [--entry-x:2.25rem] md:[--entry-x:12rem]">
          <div className="timeline-track hidden motion-reduce:block" aria-hidden="true" />
          <Rider />

          <ol className="flex flex-col">
            {groups.map((group) => (
              <li key={group.label} className="pb-12 md:grid md:grid-cols-[7rem_1fr] md:gap-x-20">
                <h3 className="pb-5 pl-(--entry-x) font-display text-3xl font-extrabold tracking-[-0.02em] md:sticky md:top-24 md:self-start md:pb-0 md:pl-0 md:text-right">
                  {group.label}
                </h3>
                <ul className="flex flex-col gap-8 pl-(--entry-x) md:pl-0">
                  {group.entries.map((e, i) => (
                    <Entry key={`${e.kind}-${e.title}`} entry={e} i={i} />
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
