import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { projects, type Project } from "@/data/resume";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { cn } from "@/lib/cn";
import { ButtonLink } from "./Button";
import { HatGradient, Pine, SledPanda } from "./Panda";
import { ProjectPicture } from "./ProjectPicture";

const HEIGHT = 250;
const MIN_WIDTH = 1680;
const MARGIN = 130;
/** How close the sled has to be to a flag to count as being there. */
const REACH = 36;

/** The snow surface, in pixels from the top of the scene. */
const hill = (x: number) => 172 + 22 * Math.sin(x / 190 + 0.6) + 8 * Math.sin(x / 71 + 2);
const slope = (x: number) => (22 / 190) * Math.cos(x / 190 + 0.6) + (8 / 71) * Math.cos(x / 71 + 2);
const ridge = (x: number) => 96 + 30 * Math.sin(x / 260 + 1.4) + 12 * Math.sin(x / 97);

function outline(fn: (x: number) => number, width: number, from = 0) {
  let d = `M${from} ${HEIGHT} L${from} ${fn(from).toFixed(1)}`;
  for (let x = from + 24; x < width + 24; x += 24) d += ` L${x} ${fn(x).toFixed(1)}`;
  return `${d} L${width + 24} ${HEIGHT} Z`;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

/** The project the sled is standing at: name, picture and the way in. */
function Found({ project }: { project: Project }) {
  return (
    <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-start gap-x-4 gap-y-3 sm:grid-cols-[15rem_minmax(0,1fr)] sm:gap-x-6">
      <ProjectPicture project={project} compact />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-ink-2">
          {project.areas.join(" + ")}
          <span aria-hidden="true" className="mx-2">
            ·
          </span>
          <span className="font-mono font-medium">{project.period}</span>
        </p>
        <h3 className="mt-1 font-display text-2xl font-extrabold tracking-[-0.02em] sm:text-3xl">{project.name}</h3>
        <p className="mt-1 text-ink-2">{project.tagline}</p>
        <div className="mt-3.5 flex flex-wrap gap-2.5 max-sm:col-span-2">
          {project.live && (
            <ButtonLink href={project.live} external variant="primary" size="sm" aria-label={`${project.name} live demo`}>
              Live demo
            </ButtonLink>
          )}
          <ButtonLink href={project.code} external size="sm" aria-label={`${project.name} code on GitHub`}>
            Code
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

/**
 * A small game between Work and About. Every flag on the hill marks a
 * project; steer the sled to one and it shows what is planted there. It can
 * be played with the arrow keys, the two steering buttons, or by picking a
 * flag directly, which is also how it works with a keyboard or a screen
 * reader: each flag is an ordinary button.
 */
export function SledGame() {
  const reduced = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const ridgeRef = useRef<SVGGElement>(null);
  const sledRef = useRef<SVGGElement>(null);

  const [width, setWidth] = useState(MIN_WIDTH);
  const [active, setActive] = useState<string | null>(null);
  const [shown, setShown] = useState<string | null>(null);
  const [found, setFound] = useState<string[]>([]);

  const flags = useMemo(
    () => projects.map((p, i) => ({ project: p, x: MARGIN + (i * (width - 2 * MARGIN)) / (projects.length - 1) })),
    [width]
  );

  /** Everything the game loop touches lives here, outside React state, so a frame never waits on a render. */
  const game = useRef({ x: MARGIN - 70, v: 0, target: null as number | null, left: false, right: false, cam: 0, facing: 1, frame: 0, last: 0, armed: false });

  const draw = useCallback(
    (dt: number) => {
      const g = game.current;
      const view = viewRef.current;
      if (!view || !worldRef.current || !sledRef.current) return false;

      const wanted = clamp(g.x - view.clientWidth / 2, 0, Math.max(0, width - view.clientWidth));
      g.cam = dt === 0 ? wanted : g.cam + (wanted - g.cam) * Math.min(1, dt * 7);
      worldRef.current.style.transform = `translate3d(${(-g.cam).toFixed(1)}px, 0, 0)`;
      // The far ridge moves at half speed, which is what makes the hill feel long.
      ridgeRef.current?.setAttribute("transform", `translate(${(g.cam * 0.5).toFixed(1)} 0)`);

      const tilt = (Math.atan(slope(g.x)) * 180) / Math.PI;
      sledRef.current.setAttribute(
        "transform",
        `translate(${g.x.toFixed(1)} ${hill(g.x).toFixed(1)}) rotate(${tilt.toFixed(1)}) scale(${1.3 * g.facing} 1.3)`
      );

      const near = flags.find((f) => Math.abs(f.x - g.x) < REACH)?.project.id ?? null;
      setActive(near);
      if (near) {
        setShown(near);
        setFound((list) => (list.includes(near) ? list : [...list, near]));
      }
      return Math.abs(wanted - g.cam) > 0.5;
    },
    [flags, width]
  );

  const run = useCallback(() => {
    const g = game.current;
    if (g.frame) return;
    g.last = performance.now();
    const step = (now: number) => {
      const dt = Math.min((now - g.last) / 1000, 0.04);
      g.last = now;

      let pull: number;
      if (g.left !== g.right) {
        pull = (g.right ? 1 : -1) * 1500;
        g.target = null;
      } else if (g.target !== null) {
        pull = 46 * (g.target - g.x) - 13.5 * g.v;
      } else {
        pull = -5 * g.v;
      }
      g.v = clamp(g.v + pull * dt, -560, 560);
      g.x += g.v * dt;
      if (g.x < 50 || g.x > width - 50) {
        g.x = clamp(g.x, 50, width - 50);
        g.v = 0;
      }
      if (g.target !== null && Math.abs(g.target - g.x) < 0.6 && Math.abs(g.v) < 6) {
        g.x = g.target;
        g.v = 0;
        g.target = null;
      }
      if (Math.abs(g.v) > 12) g.facing = Math.sign(g.v);

      const cameraMoving = draw(dt);
      const busy = g.left || g.right || g.target !== null || Math.abs(g.v) > 4 || cameraMoving;
      g.frame = busy ? requestAnimationFrame(step) : 0;
    };
    g.frame = requestAnimationFrame(step);
  }, [draw, width]);

  /** Send the sled to a point on the hill. With reduced motion it is simply placed there. */
  const goTo = useCallback(
    (x: number) => {
      const g = game.current;
      const to = clamp(x, 50, width - 50);
      if (reduced) {
        if (to !== g.x) g.facing = Math.sign(to - g.x);
        g.x = to;
        g.v = 0;
        draw(0);
      } else {
        g.target = to;
        run();
      }
    },
    [draw, reduced, run, width]
  );

  const toNeighbour = (direction: 1 | -1) => {
    const g = game.current;
    const from = g.target ?? g.x;
    const next = direction === 1 ? flags.find((f) => f.x > from + 2) : [...flags].reverse().find((f) => f.x < from - 2);
    if (next) goTo(next.x);
  };

  /** A quick tap on a steering button goes to the next flag; holding it steers. */
  const pressed = useRef(0);
  const press = (side: "left" | "right") => {
    pressed.current = performance.now();
    if (reduced) return;
    game.current[side] = true;
    run();
  };
  const release = (side: "left" | "right", tapped: boolean) => {
    game.current[side] = false;
    if (tapped && (reduced || performance.now() - pressed.current < 240)) toNeighbour(side === "left" ? -1 : 1);
  };

  // The world is at least as wide as the screen, and never so short that the flags crowd.
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const measure = () => setWidth(Math.max(MIN_WIDTH, Math.round(view.clientWidth)));
    measure();
    const watcher = new ResizeObserver(measure);
    watcher.observe(view);
    return () => watcher.disconnect();
  }, []);

  useEffect(() => {
    game.current.x = clamp(game.current.x, 50, width - 50);
    draw(0);
  }, [draw, width]);

  // Arrow keys steer while the pointer or the focus is in the game.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const g = game.current;
    const side = (e: KeyboardEvent) =>
      e.key === "ArrowLeft" || e.key === "a" || e.key === "A" ? "left" : e.key === "ArrowRight" || e.key === "d" || e.key === "D" ? "right" : null;
    const typing = (e: KeyboardEvent) => e.target instanceof HTMLElement && e.target.matches("input, textarea, select");

    const onDown = (e: KeyboardEvent) => {
      const which = side(e);
      if (!which || !g.armed || typing(e) || e.metaKey || e.ctrlKey || e.altKey) return;
      e.preventDefault();
      if (reduced) {
        if (!e.repeat) toNeighbour(which === "right" ? 1 : -1);
        return;
      }
      g[which] = true;
      run();
    };
    const onUp = (e: KeyboardEvent) => {
      const which = side(e);
      if (which) g[which] = false;
    };
    const arm = () => (g.armed = true);
    const disarm = () => {
      g.armed = section.contains(document.activeElement);
      if (!g.armed) g.left = g.right = false;
    };
    const onFocusOut = () => requestAnimationFrame(() => (g.armed = section.contains(document.activeElement) || section.matches(":hover")));

    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    section.addEventListener("pointerenter", arm);
    section.addEventListener("pointerleave", disarm);
    section.addEventListener("focusin", arm);
    section.addEventListener("focusout", onFocusOut);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
      section.removeEventListener("pointerenter", arm);
      section.removeEventListener("pointerleave", disarm);
      section.removeEventListener("focusin", arm);
      section.removeEventListener("focusout", onFocusOut);
      cancelAnimationFrame(g.frame);
      g.frame = 0;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, run, flags]);

  const project = projects.find((p) => p.id === shown);
  const all = found.length === projects.length;
  const steerButton =
    "press pointer-events-auto flex size-12 items-center justify-center rounded-[0.7rem] border-[1.5px] border-edge bg-bg/85 text-ink backdrop-blur-sm hover:border-ink";

  return (
    <section ref={sectionRef} id="sled" aria-labelledby="sled-title" className="relative overflow-clip bg-linear-to-b from-(--bg) to-(--sky-top) pt-16 sm:pt-24">
      <div className="mx-auto max-w-[76rem] px-4 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
          <div>
            <h2 id="sled-title" className="rise title">
              Take the sled
            </h2>
            <p className="rise mt-3 max-w-xl text-lg text-ink-2">
              Every flag on this hill marks something I built. Steer with the arrow keys or the buttons, or pick a flag,
              and see what is planted there.
            </p>
          </div>
          <p className="font-mono text-sm text-ink-2" aria-live="polite">
            <span className="text-lg font-bold text-ink">{found.length}</span> of {projects.length} flags found
            {all && <span className="ml-2 font-sans font-semibold text-ink">That is everything on this page.</span>}
          </p>
        </div>

        <div className="mt-8 min-h-[11.5rem] rounded-2xl border border-line bg-card/70 p-4 sm:min-h-[10.5rem] sm:p-5" aria-live="polite">
          {project ? (
            <Found project={project} />
          ) : (
            <div className="flex min-h-[8rem] items-center">
              <p className="text-lg text-ink-2">
                Nothing found yet.{" "}
                <span className="hidden [@media(pointer:fine)]:inline">
                  Press{" "}
                  <kbd className="rounded-md border-[1.5px] border-edge px-2 py-0.5 font-mono text-sm font-bold text-ink">→</kbd>{" "}
                  or pick the first flag to set off.
                </span>
                <span className="[@media(pointer:fine)]:hidden">Tap the first flag to set off.</span>
              </p>
            </div>
          )}
        </div>
      </div>

      <div
        ref={viewRef}
        className="game-view relative mt-6 overflow-hidden"
        style={{ height: HEIGHT }}
        onPointerDown={(e) => {
          if (e.target instanceof Element && e.target.closest("button")) return;
          const box = e.currentTarget.getBoundingClientRect();
          goTo(e.clientX - box.left + game.current.cam);
        }}
      >
        <div ref={worldRef} className="absolute left-0 top-0 h-full will-change-transform" style={{ width }}>
          <svg width={width} height={HEIGHT} className="absolute inset-0" aria-hidden="true" focusable="false">
            <g ref={ridgeRef}>
              <path d={outline(ridge, width, -24)} fill="var(--ridge-far)" />
              <g fill="var(--pine)">
                {flags.filter((_, i) => i % 2 === 1).map((f, i) => (
                  <Pine key={f.x} x={f.x * 0.82 + 60} y={ridge(f.x * 0.82 + 60) - 44} scale={0.75 + (i % 3) * 0.2} />
                ))}
              </g>
            </g>
            <path d={outline(hill, width)} fill="var(--bg-2)" />
          </svg>

          {flags.map(({ project: p, x }) => (
            <button
              key={p.id}
              type="button"
              className="flag"
              style={{ left: x, top: hill(x) + 3 }}
              aria-pressed={active === p.id}
              aria-label={`${p.name}: ${p.tagline}`}
              data-found={found.includes(p.id) || undefined}
              onClick={() => goTo(x)}
              onFocus={(e) => e.currentTarget.matches(":focus-visible") && goTo(x)}
            >
              <svg viewBox="0 0 30 54" width="38" height="68" aria-hidden="true" focusable="false">
                <path d="M5 53V4" stroke="var(--ink)" strokeWidth="2.25" strokeLinecap="round" />
                <path className="flag-pennant" d="M6 5 L28 13 L6 22 Z" stroke="var(--ink)" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            </button>
          ))}

          <svg width={width} height={HEIGHT} className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden="true" focusable="false">
            <defs>
              <HatGradient id="hat-game" />
            </defs>
            <g ref={sledRef}>
              <SledPanda hatId="hat-game" />
            </g>
          </svg>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-3 mx-auto flex max-w-[76rem] justify-between px-4 sm:px-8">
          {(["left", "right"] as const).map((side) => (
            <button
              key={side}
              type="button"
              className={steerButton}
              aria-label={side === "left" ? "Sled to the flag on the left" : "Sled to the flag on the right"}
              onClick={(e) => e.detail === 0 && toNeighbour(side === "left" ? -1 : 1)}
              onPointerDown={() => press(side)}
              onPointerUp={() => release(side, true)}
              onPointerLeave={() => release(side, false)}
              onPointerCancel={() => release(side, false)}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={cn(side === "right" && "rotate-180")}>
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
