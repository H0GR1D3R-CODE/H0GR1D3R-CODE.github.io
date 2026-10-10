import { useCallback, useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { cn } from "@/lib/cn";
import { HatGradient, PandaHead } from "./Panda";
import { demos } from "./Showcase";

const FIELD = 150;
/** How fast a name drifts down, in pixels a second. Slow, like snow, so there is time to get under it. */
const FALL = 46;
/** Where the top of a falling name is when its bottom edge meets the crown of the hat. */
const HAT = FIELD - 78;
/** How long a finger can be off the screen before the game stops waiting for it. */
const TOUCH_GRACE_MS = 6000;

type HeroCatchProps = {
  /** True when the hero is pinned and scrolling also turns the deck. */
  pinned: boolean;
  onSelect: (id: string) => void;
};

type Falling = { id: string; from: number; y: number; age: number };

/**
 * The hero's mini game. The names of the live projects drift down one at a
 * time; move the panda under one and it lands on the straw hat, which
 * brings that project to the front of the deck. Catch all five to finish.
 *
 * It plays with a mouse, a finger or the arrow keys, and only runs while
 * someone is actually in it. It is an extra: the deck's own tabs do the
 * same job directly, so with reduced motion the game is simply not shown.
 */
export function HeroCatch({ pinned, onSelect }: HeroCatchProps) {
  const reduced = usePrefersReducedMotion();
  const fieldRef = useRef<HTMLDivElement>(null);
  const pandaRef = useRef<HTMLDivElement>(null);
  const tokenRef = useRef<HTMLSpanElement>(null);
  const select = useRef(onSelect);
  select.current = onSelect;

  const [caught, setCaught] = useState<string[]>([]);
  const [falling, setFalling] = useState<string | null>(null);

  /** Everything the loop touches, kept out of React state so a frame never waits on a render. */
  const game = useRef({
    x: 70,
    want: 70,
    left: false,
    right: false,
    inside: false,
    focused: false,
    touchedAt: -Infinity,
    frame: 0,
    last: 0,
    pause: 0.5,
    token: null as Falling | null,
    caught: new Set<string>(),
  });

  const draw = useCallback(() => {
    const g = game.current;
    if (pandaRef.current) pandaRef.current.style.transform = `translateX(${(g.x - 30).toFixed(1)}px)`;
    const el = tokenRef.current;
    if (!el) return;
    if (g.token) {
      const x = g.token.from + Math.sin(g.token.age * 2.1) * 14;
      el.style.transform = `translate(${x.toFixed(1)}px, ${g.token.y.toFixed(1)}px) translateX(-50%)`;
      el.style.opacity = "1";
    } else {
      el.style.opacity = "0";
    }
  }, []);

  const run = useCallback(() => {
    const g = game.current;
    if (g.frame || reduced) return;
    g.last = performance.now();

    const step = (now: number) => {
      const field = fieldRef.current;
      if (!field) return;
      const dt = Math.min((now - g.last) / 1000, 0.05);
      g.last = now;
      const width = field.clientWidth;

      if (g.left !== g.right) g.want += (g.right ? 1 : -1) * 440 * dt;
      g.want = Math.min(Math.max(g.want, 32), width - 32);
      g.x += (g.want - g.x) * Math.min(1, dt * 16);

      if (!g.token) {
        g.pause -= dt;
        const waiting = demos.filter((p) => !g.caught.has(p.id));
        if (g.pause <= 0 && waiting.length > 0) {
          const next = waiting[Math.floor(Math.random() * waiting.length)];
          // Start it somewhere the panda is not, so there is always a move to make.
          let from = 60 + Math.random() * (width - 120);
          if (Math.abs(from - g.x) < 90) from = g.x < width / 2 ? Math.min(g.x + 150, width - 60) : Math.max(g.x - 150, 60);
          g.token = { id: next.id, from, y: -30, age: 0 };
          setFalling(next.id);
        }
      } else {
        g.token.y += FALL * dt;
        g.token.age += dt;
        const x = g.token.from + Math.sin(g.token.age * 2.1) * 14;
        const onHat = g.token.y >= HAT - 12 && g.token.y <= HAT + 12 && Math.abs(x - g.x) < 40;
        if (onHat) {
          const id = g.token.id;
          g.caught.add(id);
          g.token = null;
          g.pause = 0.75;
          setCaught([...g.caught]);
          setFalling(null);
          select.current(id);
          pandaRef.current?.animate([{ translate: "0 0" }, { translate: "0 7px" }, { translate: "0 0" }], {
            duration: 320,
            easing: "cubic-bezier(.3,1.6,.5,1)",
          });
        } else if (g.token.y > FIELD - 46) {
          // Missed: it lands in the snow and comes round again later.
          g.token = null;
          g.pause = 0.45;
          setFalling(null);
        }
      }

      draw();
      const playing = g.inside || g.focused || now - g.touchedAt < TOUCH_GRACE_MS;
      if (playing) {
        g.frame = requestAnimationFrame(step);
      } else {
        // Nobody is here: clear the falling name and wait.
        g.frame = 0;
        g.token = null;
        g.left = g.right = false;
        setFalling(null);
        draw();
      }
    };
    g.frame = requestAnimationFrame(step);
  }, [draw, reduced]);

  useEffect(() => {
    draw();
    const g = game.current;
    return () => {
      cancelAnimationFrame(g.frame);
      g.frame = 0;
    };
  }, [draw]);

  if (reduced) return null;

  const steerTo = (clientX: number) => {
    const box = fieldRef.current?.getBoundingClientRect();
    if (box) game.current.want = clientX - box.left;
  };

  const reset = () => {
    const g = game.current;
    g.caught.clear();
    g.token = null;
    g.pause = 0.4;
    setCaught([]);
    setFalling(null);
    fieldRef.current?.focus();
  };

  const count = demos.length;
  const done = caught.length === count;

  return (
    <div className="catch">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-sm text-ink-2">
        <p>
          <span className="font-semibold text-ink">Catch a project.</span> Land its name on the hat to bring it
          forward.
        </p>
        <p className="flex items-center gap-2.5">
          <span className="flex gap-1" aria-hidden="true">
            {demos.map((p) => (
              <span key={p.id} className={cn("catch-pip", caught.includes(p.id) && "is-caught")} />
            ))}
          </span>
          <span className="font-mono text-xs" aria-live="polite">
            {done ? "All five caught" : `${caught.length} of ${count} caught`}
          </span>
          {done && (
            <button type="button" onClick={reset} className="link min-h-6 text-sm font-semibold text-ink">
              Play again
            </button>
          )}
        </p>
      </div>

      <div
        ref={fieldRef}
        className="catch-field"
        style={{ height: FIELD }}
        tabIndex={0}
        role="group"
        aria-label="Catch game. Use the left and right arrow keys to move the panda under a falling project name. The tabs beside the project windows do the same without the game."
        onPointerEnter={(e) => {
          if (e.pointerType === "touch") return;
          game.current.inside = true;
          steerTo(e.clientX);
          run();
        }}
        onPointerLeave={() => {
          game.current.inside = false;
        }}
        onPointerDown={(e) => {
          if (e.pointerType === "touch") game.current.touchedAt = performance.now();
          steerTo(e.clientX);
          run();
        }}
        onPointerMove={(e) => {
          if (e.pointerType === "touch") game.current.touchedAt = performance.now();
          steerTo(e.clientX);
        }}
        onFocus={() => {
          game.current.focused = true;
          run();
        }}
        onBlur={() => {
          game.current.focused = false;
        }}
        onKeyDown={(e) => {
          if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
          e.preventDefault();
          game.current[e.key === "ArrowLeft" ? "left" : "right"] = true;
          run();
        }}
        onKeyUp={(e) => {
          if (e.key === "ArrowLeft") game.current.left = false;
          if (e.key === "ArrowRight") game.current.right = false;
        }}
      >
        {!falling && caught.length === 0 && (
          <p className="catch-hint" aria-hidden="true">
            {pinned ? "Move your pointer in here to play. Scrolling turns the deck too." : "Touch or hover here to play."}
          </p>
        )}
        <span ref={tokenRef} className="catch-token" aria-hidden="true">
          {demos.find((p) => p.id === falling)?.name}
        </span>
        <div ref={pandaRef} className="catch-panda" aria-hidden="true">
          <svg viewBox="872 196 216 172" width="60" height="48" className="block overflow-visible" focusable="false">
            <defs>
              <HatGradient id="hat-catch" />
            </defs>
            <PandaHead hatId="hat-catch" />
          </svg>
        </div>
        <svg className="catch-snow" viewBox="0 0 600 34" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path d="M0 34 V14 C 70 2, 150 20, 250 10 S 420 0, 500 9 S 575 16, 600 8 V34 Z" />
        </svg>
      </div>
    </div>
  );
}
