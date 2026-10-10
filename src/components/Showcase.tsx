import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { Project } from "@/data/resume";
import { liveProjects, statusText, type LiveStatus } from "@/lib/livePing";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { cn } from "@/lib/cn";
import { ArrowOut, Pause, Play } from "./icons";

/** Every live project that has a picture to show: these are the windows in the deck. */
export const demos = liveProjects.filter((p) => p.media);

/** How long each window stays in front while the deck is turning on its own. */
const TURN_MS = 5600;

const address = (url: string) => {
  const u = new URL(url);
  return (u.host + u.pathname).replace(/\/$/, "");
};

type CardProps = {
  project: Project;
  /** 0 is the front window; 1 and 2 show behind it; "hidden" waits at the back; "gone" has just left the front. */
  pos: "0" | "1" | "2" | "hidden" | "gone";
  status: LiveStatus | undefined;
  running: boolean;
  onRun: () => void;
  onStop: () => void;
};

function Card({ project, pos, status, running, onRun, onStop }: CardProps) {
  const front = pos === "0";
  const screenRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [loaded, setLoaded] = useState(false);
  const [tour, setTour] = useState(false);
  const media = project.media!;

  // The embedded site is laid out at a real screen width, then scaled to fit the window.
  useEffect(() => {
    const el = screenRef.current;
    if (!el || !running) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [running]);

  useEffect(() => {
    if (!running) setLoaded(false);
  }, [running]);
  useEffect(() => {
    if (!front) setTour(false);
  }, [front]);

  // Phone-sized windows get the site's phone layout; anything wider gets the desktop one, scaled down.
  const narrow = size.w > 0 && size.w < 420;
  const layoutWidth = narrow ? 420 : 1280;
  const scale = size.w > 0 ? size.w / layoutWidth : 1;

  return (
    <article
      id={`window-${project.id}`}
      className="deck-card flex flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-[0_30px_60px_-30px_rgb(0_0_0/0.7)]"
      data-pos={pos}
      role="tabpanel"
      aria-labelledby={`tab-${project.id}`}
      aria-hidden={!front}
      inert={!front}
    >
      <div className="flex h-11 shrink-0 items-center gap-3 border-b border-line px-3.5">
        <span className="min-w-0 flex-1 truncate rounded-md bg-bg/70 px-2.5 py-1 font-mono text-xs text-ink-2">
          {address(project.live!)}
        </span>
        {running && (
          <button
            type="button"
            onClick={onStop}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md bg-straw px-2.5 text-sm font-semibold text-on-straw hover:bg-straw-soft"
          >
            <Pause width={12} height={12} /> Stop
          </button>
        )}
        <a
          href={project.live}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={`Open ${project.name} in a new tab`}
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md px-2 text-sm font-semibold text-ink hover:bg-bg-2"
        >
          Open <ArrowOut width={14} height={14} />
        </a>
      </div>

      <div
        ref={screenRef}
        className={cn("relative overflow-hidden bg-bg", running && narrow ? "aspect-[4/5]" : "aspect-video")}
      >
        <img
          src={media.still}
          alt={media.alt}
          width={media.width}
          height={media.height}
          loading={front ? "eager" : "lazy"}
          decoding="async"
          className="size-full object-cover object-left-top"
        />
        {tour && media.recording && (
          <img src={media.recording} alt="" aria-hidden="true" className="absolute inset-0 size-full object-cover object-left-top" />
        )}

        {running && (
          <>
            {!loaded && (
              <p className="absolute inset-0 flex items-center justify-center bg-bg/85 text-sm font-semibold" role="status">
                Starting the real {project.name}…
              </p>
            )}
            {size.w > 0 && (
              <iframe
                src={project.live}
                title={`${project.name}, running live`}
                onLoad={() => setLoaded(true)}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                referrerPolicy="no-referrer"
                className={cn("absolute left-0 top-0 origin-top-left border-0 bg-white", !loaded && "opacity-0")}
                style={{ width: layoutWidth, height: size.h / scale, transform: `scale(${scale})` }}
              />
            )}
          </>
        )}

        {front && !running && (
          <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end gap-x-3 gap-y-2 bg-linear-to-t from-[#0b1622] from-25% to-transparent p-3.5 pt-14">
            {project.runsInPage ? (
              <button
                type="button"
                onClick={onRun}
                className="press inline-flex h-10 items-center gap-2 rounded-[0.6rem] bg-straw px-4 text-sm font-semibold text-on-straw hover:bg-straw-soft"
              >
                <Play width={13} height={13} /> Run it right here
              </button>
            ) : (
              <>
                {media.recording && (
                  <button
                    type="button"
                    onClick={() => setTour((v) => !v)}
                    className="press inline-flex h-10 items-center gap-2 rounded-[0.6rem] bg-straw px-4 text-sm font-semibold text-on-straw hover:bg-straw-soft"
                  >
                    {tour ? <Pause width={13} height={13} /> : <Play width={13} height={13} />}
                    {tour ? "Pause the tour" : "Play the tour"}
                  </button>
                )}
                <p className="max-w-[22rem] text-xs leading-snug text-[#eef4f8]">
                  This one refuses to be embedded in other pages, on purpose, so it opens in a new tab.
                </p>
              </>
            )}
          </div>
        )}

      </div>

      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 border-t border-line px-3.5 py-3">
        <p className="min-w-0">
          <span className="font-display text-lg font-extrabold tracking-[-0.015em]">{project.name}</span>
          <span className="ml-2.5 text-sm text-ink-2">{project.tagline}</span>
        </p>
        <p className="flex items-center gap-2 font-mono text-xs text-ink-2">
          <span
            aria-hidden="true"
            className={cn("size-2 rounded-full border-[1.5px]", status?.state === "up" ? "border-straw bg-straw" : "border-edge")}
          />
          {statusText(status)}
        </p>
      </div>
    </article>
  );
}

type ShowcaseProps = {
  /** Id of the project in the front window. */
  active: string;
  /** True while the deck is still turning on its own. */
  auto: boolean;
  /** `byVisitor` is false when the deck turns itself. */
  onSelect: (id: string, byVisitor: boolean) => void;
  status: Record<string, LiveStatus>;
};

/**
 * The hero's right-hand side: a deck of windows, one per live project. The
 * front one shows what the project looks like and how fast it just answered,
 * and for the ones that allow it, "Run it right here" loads the real site
 * inside the window. The deck tilts with the pointer and turns on its own
 * until someone takes over.
 */
export function Showcase({ active, auto, onSelect, status }: ShowcaseProps) {
  const reduced = usePrefersReducedMotion();
  const tiltRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [running, setRunning] = useState<string | null>(null);
  const previous = useRef(active);
  const [gone, setGone] = useState<string | null>(null);

  const index = Math.max(0, demos.findIndex((p) => p.id === active));
  const turning = auto && !reduced && running === null;

  // Remember which window just left the front, so it can exit towards the viewer.
  useEffect(() => {
    if (previous.current === active) return;
    setGone(previous.current);
    previous.current = active;
    setRunning(null);
    const id = window.setTimeout(() => setGone(null), 750);
    return () => window.clearTimeout(id);
  }, [active]);

  // The deck leans towards the pointer. It sits level while a site is running inside it: nobody wants to click a tilted page.
  useEffect(() => {
    const el = tiltRef.current;
    const hero = el?.closest("section");
    if (!el || !hero || reduced || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (running !== null) {
      el.style.setProperty("--tilt-x", "0");
      el.style.setProperty("--tilt-y", "0");
      return;
    }

    let frame = 0;
    const now = { x: 0, y: 0 };
    const want = { x: 0, y: 0 };
    const step = () => {
      now.x += (want.x - now.x) * 0.09;
      now.y += (want.y - now.y) * 0.09;
      el.style.setProperty("--tilt-x", now.x.toFixed(3));
      el.style.setProperty("--tilt-y", now.y.toFixed(3));
      frame = Math.abs(want.x - now.x) + Math.abs(want.y - now.y) > 0.01 ? requestAnimationFrame(step) : 0;
    };
    const aim = (x: number, y: number) => {
      want.x = x;
      want.y = y;
      if (!frame) frame = requestAnimationFrame(step);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = hero.getBoundingClientRect();
      aim(-((e.clientY - r.top) / r.height - 0.5) * 7, ((e.clientX - r.left) / r.width - 0.5) * 10);
    };
    const onLeave = () => aim(0, 0);

    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced, running]);

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = demos[(index + step + demos.length) % demos.length];
    onSelect(next.id, true);
    tabRefs.current[next.id]?.focus();
  };

  return (
    <div className="showcase">
      <div className="deck">
        <div ref={tiltRef} className="deck-tilt">
          {demos.map((p, i) => {
            const distance = (i - index + demos.length) % demos.length;
            const pos = distance === 0 ? "0" : p.id === gone ? "gone" : distance === 1 ? "1" : distance === 2 ? "2" : "hidden";
            return (
              <Card
                key={p.id}
                project={p}
                pos={pos}
                status={status[p.id]}
                running={running === p.id}
                onRun={() => {
                  onSelect(p.id, true);
                  setRunning(p.id);
                }}
                onStop={() => setRunning(null)}
              />
            );
          })}
        </div>
      </div>

      <div role="tablist" aria-label="Live projects" className="relative z-10 mt-5 flex flex-wrap gap-1.5">
        {demos.map((p) => {
          const selected = p.id === active;
          return (
            <button
              key={p.id}
              ref={(el) => {
                tabRefs.current[p.id] = el;
              }}
              type="button"
              role="tab"
              id={`tab-${p.id}`}
              aria-selected={selected}
              aria-controls={`window-${p.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => onSelect(p.id, true)}
              onKeyDown={onTabKey}
              className={cn(
                "relative inline-flex h-10 items-center overflow-hidden rounded-[0.6rem] border-[1.5px] px-3.5 text-sm font-semibold",
                selected ? "border-ink bg-ink text-bg" : "border-edge bg-bg/40 text-ink hover:border-ink hover:bg-bg-2"
              )}
            >
              {p.name}
              {selected && turning && (
                <span
                  key={p.id}
                  className="tab-progress"
                  aria-hidden="true"
                  style={{ animationDuration: `${TURN_MS}ms` }}
                  onAnimationEnd={() => onSelect(demos[(index + 1) % demos.length].id, false)}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
