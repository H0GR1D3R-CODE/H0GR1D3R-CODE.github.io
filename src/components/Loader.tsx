import { useEffect, useMemo, useState } from "react";
import { liveProjects, ping, statusText, type LiveStatus } from "@/lib/livePing";
import { profile } from "@/data/resume";
import { cn } from "@/lib/cn";
import { Mark } from "./Logo";

const SESSION_KEY = "booted";
/** The screen stays at least this long, so it can be read rather than flashed. */
const MIN_MS = 1300;
/** Demos that haven't answered by now are left to finish in the hero. */
const PATIENCE_MS = 1700;
const HOLD_MS = 380;
const LIFT_MS = 850;

function shouldSkip() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * The loading screen. It does the page's first real job in public: it pings
 * every live demo from the visitor's browser and lists each one as it
 * answers, so the headline's claim is already half-proved by the time it
 * lifts. It shows once per visit and is skipped for reduced motion.
 * index.html carries a static copy of the same panel so it is on screen
 * before any script has run.
 */
export function Loader({ onLift }: { onLift: () => void }) {
  const skip = useMemo(shouldSkip, []);
  const [fontsReady, setFontsReady] = useState(false);
  const [replies, setReplies] = useState<Record<string, LiveStatus>>({});
  const [waitedEnough, setWaitedEnough] = useState(false);
  const [outOfPatience, setOutOfPatience] = useState(false);
  const [lifting, setLifting] = useState(false);
  const [gone, setGone] = useState(skip);

  const answered = Object.keys(replies).length;
  const total = liveProjects.length + 1;
  const done = (fontsReady ? 1 : 0) + answered;
  const ready = fontsReady && waitedEnough && (answered === liveProjects.length || outOfPatience);

  useEffect(() => {
    // The static panel from index.html has done its job once React is drawing.
    document.getElementById("boot")?.remove();
    if (skip) {
      onLift();
      return;
    }
    document.documentElement.classList.add("booting");
    let current = true;

    const fonts = () => current && setFontsReady(true);
    // Never let a slow font hold the page hostage.
    const fontTimer = window.setTimeout(fonts, 1800);
    (document.fonts?.ready ?? Promise.resolve()).then(fonts);

    for (const p of liveProjects) {
      ping(p).then((s) => current && setReplies((all) => ({ ...all, [p.id]: s })));
    }
    const minTimer = window.setTimeout(() => current && setWaitedEnough(true), MIN_MS);
    const patienceTimer = window.setTimeout(() => current && setOutOfPatience(true), PATIENCE_MS);

    return () => {
      current = false;
      window.clearTimeout(fontTimer);
      window.clearTimeout(minTimer);
      window.clearTimeout(patienceTimer);
      document.documentElement.classList.remove("booting");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (skip || !ready || lifting) return;
    const id = window.setTimeout(() => {
      setLifting(true);
      onLift();
      document.documentElement.classList.remove("booting");
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        // No storage: the screen will simply show again next time.
      }
    }, HOLD_MS);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip, ready, lifting]);

  useEffect(() => {
    if (!lifting) return;
    const id = window.setTimeout(() => setGone(true), LIFT_MS);
    return () => window.clearTimeout(id);
  }, [lifting]);

  if (gone) return null;

  const lines = [
    { key: "fonts", label: "Typefaces", detail: fontsReady ? "loaded" : "loading", done: fontsReady },
    ...liveProjects.map((p) => ({
      key: p.id,
      label: p.name,
      detail: statusText(replies[p.id]),
      done: replies[p.id]?.state === "up",
    })),
  ];

  return (
    <div className={cn("loader", lifting && "loader-lift")} role="status" aria-live="polite" data-theme="night">
      <div className="loader-inner">
        <p className="flex items-center gap-3 font-display text-2xl font-extrabold tracking-[-0.02em] sm:text-3xl">
          <Mark className="size-8" />
          {profile.name}
        </p>
        <p className="mt-2 text-ink-2">Checking each live project from your browser.</p>

        <ol className="mt-6 flex flex-col gap-2 font-mono text-[0.8125rem] sm:text-sm">
          {lines.map((line) => (
            <li key={line.key} className={cn("loader-step flex items-center gap-3", line.done && "is-done")}>
              <svg viewBox="0 0 16 16" width="16" height="16" className="shrink-0" aria-hidden="true">
                <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" />
                {line.done && (
                  <path d="M4.6 8.3 7 10.6 11.4 5.8" fill="none" stroke="var(--straw)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                )}
              </svg>
              <span className="w-28 font-bold text-ink sm:w-32">{line.label}</span>
              <span className="text-ink-2">{line.detail}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="loader-bar" style={{ transform: `scaleX(${done / total})` }} aria-hidden="true" />
    </div>
  );
}
