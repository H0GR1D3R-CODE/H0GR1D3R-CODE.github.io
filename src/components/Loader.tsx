import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { profile } from "@/data/resume";
import { cn } from "@/lib/cn";

/** Long enough for the mark to finish drawing and the name to settle. */
const SHOW_MS = 1750;
/** A slow font never holds the page for longer than this. */
const FONT_PATIENCE_MS = 1800;
const OPEN_MS = 800;

const shouldSkip = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

/**
 * The opening screen. The mark draws itself as a route, from its start to
 * its straw destination, and the name rises in under it. Then the screen
 * opens outwards from that destination dot, so the page is revealed from
 * the point the route arrived at. It plays on every load, refreshes
 * included, and is skipped for reduced motion. index.html carries a plain
 * navy panel so there is no flash of the page before this mounts.
 */
export function Loader({ onLift }: { onLift: () => void }) {
  const skip = useMemo(shouldSkip, []);
  const rootRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<SVGCircleElement>(null);
  const [opening, setOpening] = useState(false);
  const [gone, setGone] = useState(skip);

  useEffect(() => {
    // The static panel from index.html has done its job once React is drawing.
    document.getElementById("boot")?.remove();
    if (skip) {
      onLift();
      return;
    }
    document.documentElement.classList.add("booting");
    let current = true;
    const fonts = Promise.race([document.fonts?.ready ?? Promise.resolve(), wait(FONT_PATIENCE_MS)]);
    Promise.all([fonts, wait(SHOW_MS)]).then(() => {
      if (!current) return;
      // Open from wherever the destination dot ended up on this screen.
      const dot = endRef.current?.getBoundingClientRect();
      if (dot && rootRef.current) {
        rootRef.current.style.setProperty("--iris-x", `${dot.left + dot.width / 2}px`);
        rootRef.current.style.setProperty("--iris-y", `${dot.top + dot.height / 2}px`);
      }
      setOpening(true);
      onLift();
      document.documentElement.classList.remove("booting");
    });
    return () => {
      current = false;
      document.documentElement.classList.remove("booting");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!opening) return;
    const id = window.setTimeout(() => setGone(true), OPEN_MS);
    return () => window.clearTimeout(id);
  }, [opening]);

  if (gone) return null;

  return (
    <div
      ref={rootRef}
      className={cn("loader", opening && "loader-open")}
      role="status"
      aria-label={`Loading ${profile.name}'s portfolio`}
      data-theme="night"
    >
      <div className="loader-field" aria-hidden="true" />

      <div className="loader-core" aria-hidden="true">
        <svg viewBox="0 0 32 32" className="loader-mark" focusable="false">
          <path className="loader-route" d="M8 24V8l16 16V8" pathLength={1} />
          <circle className="loader-node" cx="8" cy="24" r="3.6" style={{ "--at": "0.05s" } as CSSProperties} />
          <circle className="loader-ring" cx="24" cy="8" r="4.4" />
          <circle ref={endRef} className="loader-node loader-end" cx="24" cy="8" r="4.4" style={{ "--at": "1s" } as CSSProperties} />
        </svg>

        <p className="loader-name font-display">
          {[...profile.name].map((letter, i) => (
            <span key={i} className="loader-letter" style={{ "--i": i } as CSSProperties}>
              <span>{letter === " " ? " " : letter}</span>
            </span>
          ))}
        </p>
        <p className="loader-sub">Portfolio</p>
      </div>
    </div>
  );
}
