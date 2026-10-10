import { useEffect, useRef, useState } from "react";
import { timeline, type TimelineEntry } from "@/data/resume";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { cn } from "@/lib/cn";
import { HatGradient, SledPanda } from "./Panda";

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

const groups = groupByYear(timeline);

function Kind({ entry }: { entry: TimelineEntry }) {
  return (
    <span
      className={cn(
        "rounded-md px-2 py-1 text-xs font-semibold leading-none",
        entry.kind === "Work" ? "bg-straw text-on-straw" : "border border-edge text-ink-2"
      )}
    >
      {entry.kind}
    </span>
  );
}

/** One slalom gate: the flag the trail bends round, and the entry it stands for. */
function Gate({ entry, side }: { entry: TimelineEntry; side: "left" | "right" }) {
  return (
    <li className="gate-row" data-side={side}>
      {/* The point the trail passes through. Its flag goes up as the sled reaches it. */}
      <span className="gate" data-anchor aria-hidden="true">
        <svg className="gate-flag" viewBox="0 0 24 36" width="24" height="36" focusable="false">
          <path d="M3 35V3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path
            className="gate-pennant"
            d="M4 4 L22 10 L4 17 Z"
            fill={entry.major ? "var(--straw)" : "var(--card)"}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      <div className={cn("gate-card", side === "left" ? "slide-from-left" : "slide-from-right")}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <Kind entry={entry} />
          <span className="font-mono text-sm text-ink-2">{entry.date}</span>
        </div>
        <h4 className={cn("mt-2.5 font-display font-extrabold tracking-[-0.015em]", entry.major ? "text-xl sm:text-2xl" : "text-lg")}>
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
          <ul className="mt-3 flex flex-col gap-2 text-[0.9375rem]">
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

type Point = { x: number; y: number };

/** A smooth trail through the points, leaving and arriving at each one heading straight down. */
function trail(points: Point[]): string {
  let d = `M${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const k = (b.y - a.y) / 2;
    d += ` C${a.x.toFixed(1)} ${(a.y + k).toFixed(1)} ${b.x.toFixed(1)} ${(b.y - k).toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
  }
  return d;
}

/**
 * The timeline as a slalom run. The trail winds down the page through one
 * gate per entry, newest at the top. As the page scrolls, the panda sleds
 * the trail so that it is always level with the middle of the screen, the
 * part behind it turns to straw, and each gate's flag goes up as it passes.
 * With reduced motion the trail and flags are simply drawn, with no sled.
 */
export function Timeline() {
  const reduced = usePrefersReducedMotion();
  const courseRef = useRef<HTMLDivElement>(null);
  const baseRef = useRef<SVGPathElement>(null);
  const doneRef = useRef<SVGPathElement>(null);
  const sledRef = useRef<SVGGElement>(null);
  const [d, setD] = useState("");

  // Lay the trail through the gates, and again whenever the layout moves them.
  useEffect(() => {
    const course = courseRef.current;
    if (!course) return;
    const lay = () => {
      const box = course.getBoundingClientRect();
      const anchors = [...course.querySelectorAll<HTMLElement>("[data-anchor]")].map((el) => {
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top };
      });
      if (anchors.length === 0) return;
      const centre = anchors[0].x;
      setD(trail([{ x: centre, y: 0 }, ...anchors, { x: centre, y: box.height }]));
    };
    lay();
    const watcher = new ResizeObserver(lay);
    watcher.observe(course);
    return () => watcher.disconnect();
  }, []);

  // Keep the sled level with the middle of the screen.
  useEffect(() => {
    const course = courseRef.current;
    const base = baseRef.current;
    const done = doneRef.current;
    const sled = sledRef.current;
    if (!course || !base || !done || !sled || !d) return;

    const anchors = [...course.querySelectorAll<HTMLElement>("[data-anchor]")];
    const rows = anchors.map((el) => el.closest<HTMLElement>(".gate-row, .course-year"));
    const mark = (count: number) => rows.forEach((row, i) => row?.toggleAttribute("data-reached", i < count));

    if (reduced) {
      done.style.strokeDasharray = "none";
      mark(rows.length);
      return;
    }

    // The trail is not straight, so distance along it is looked up from height.
    const total = base.getTotalLength();
    const steps = Math.max(2, Math.ceil(total / 6));
    const heights = new Float32Array(steps + 1);
    let left = Infinity;
    let right = -Infinity;
    for (let i = 0; i <= steps; i++) {
      const p = base.getPointAtLength((total * i) / steps);
      heights[i] = p.y;
      left = Math.min(left, p.x);
      right = Math.max(right, p.x);
    }
    const lengthAt = (y: number) => {
      let lo = 0;
      let hi = steps;
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (heights[mid] <= y) lo = mid;
        else hi = mid;
      }
      const span = heights[hi] - heights[lo] || 1;
      return ((lo + (y - heights[lo]) / span) * total) / steps;
    };
    const size = right - left > 80 ? 1.2 : 0.74;

    let frame = 0;
    let facing = 1;
    const update = () => {
      frame = 0;
      const box = course.getBoundingClientRect();
      const y = Math.min(Math.max(window.innerHeight * 0.5 - box.top, 0), box.height);
      const length = lengthAt(y);
      done.style.strokeDasharray = `${length.toFixed(1)} ${total.toFixed(1)}`;

      const here = base.getPointAtLength(length);
      const ahead = base.getPointAtLength(Math.min(length + 10, total));
      const drift = ahead.x - here.x;
      if (Math.abs(drift) > 0.5) facing = Math.sign(drift);
      // Nose down on the straights, flatter while traversing.
      const tilt = 28 - Math.min(Math.abs(drift) / 8, 1) * 16;
      sled.setAttribute(
        "transform",
        `translate(${here.x.toFixed(1)} ${here.y.toFixed(1)}) scale(${facing * size} ${size}) rotate(${tilt.toFixed(1)})`
      );

      let passed = 0;
      for (const el of anchors) {
        const r = el.getBoundingClientRect();
        if (r.top + r.height / 2 - box.top <= y + 2) passed += 1;
        else break;
      }
      mark(passed);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [d, reduced]);

  let count = 0;

  return (
    <section id="timeline" aria-labelledby="timeline-title" className="overflow-x-clip py-16 sm:py-24">
      <div className="mx-auto max-w-[76rem] px-4 sm:px-8">
        <h2 id="timeline-title" className="rise title">
          Timeline
        </h2>
        <p className="rise mt-3 max-w-xl text-lg text-ink-2">
          Work, study, certificates, volunteering and awards as one downhill run, newest at the top. Each flag is a
          milestone.
        </p>

        <div ref={courseRef} className="course relative mt-14">
          <svg className="course-trail" aria-hidden="true" focusable="false">
            <path ref={baseRef} className="course-base" d={d} />
            <path ref={doneRef} className="course-done" d={d} />
          </svg>

          <ol className="relative flex flex-col gap-10">
            {groups.map((group) => (
              <li key={group.label}>
                <div className="course-year">
                  <span className="year-anchor" data-anchor aria-hidden="true" />
                  <h3 className="year-sign">{group.label}</h3>
                </div>
                <ul className="mt-10 flex flex-col gap-10">
                  {group.entries.map((entry) => (
                    <Gate key={`${entry.kind}-${entry.title}`} entry={entry} side={count++ % 2 === 0 ? "left" : "right"} />
                  ))}
                </ul>
              </li>
            ))}
          </ol>

          <svg className="course-sled motion-reduce:hidden" aria-hidden="true" focusable="false">
            <defs>
              <HatGradient id="hat-course" />
            </defs>
            <g ref={sledRef} className={d ? undefined : "hidden"}>
              <SledPanda hatId="hat-course" />
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
