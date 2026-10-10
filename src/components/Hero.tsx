import { useEffect, useRef, useState, type CSSProperties } from "react";
import { education, hero, projects } from "@/data/resume";
import { liveProjects, useLiveStatus } from "@/lib/livePing";
import { cn } from "@/lib/cn";
import { HeroCatch } from "./HeroCatch";
import { HeroBackdrop, HeroDrift } from "./Scenery";
import { Showcase, demos } from "./Showcase";

/** One word of the headline, wrapped so it can rise out of its own clipped box. */
function Words({ text, from }: { text: string; from: number }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <span key={i}>
          <span className="word" style={{ "--i": from + i } as CSSProperties}>
            <span>{word}</span>
          </span>{" "}
        </span>
      ))}
    </>
  );
}

const count = (text: string) => text.split(" ").length;

/**
 * A quiet lead-in, then the claim at full size with the part that matters
 * in straw. Screen readers get it as the single sentence it is.
 */
function Headline() {
  const { lead, statement, emphasis } = hero;
  return (
    <h1 aria-label={`${lead} ${statement} ${emphasis}`} className="font-display">
      <span aria-hidden="true">
        <span className="block text-[clamp(1.25rem,1rem+0.9vw,1.75rem)] font-medium leading-tight tracking-[-0.015em] text-ink-2">
          <Words text={lead} from={0} />
        </span>
        <span className="hero-claim mt-2 block font-extrabold leading-[0.96] tracking-[-0.024em]">
          <Words text={statement} from={count(lead)} />
          <span className="whitespace-nowrap text-straw-soft">
            <Words text={emphasis} from={count(lead) + count(statement)} />
          </span>
        </span>
      </span>
    </h1>
  );
}

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

const facts = [
  education[0].result,
  `${projects.length} projects`,
  `${liveProjects.length} live demos`,
  `graduating ${education[0].end.replace(" (expected)", "")}`,
];

/**
 * How far the page has scrolled through the pinned hero, from 0 to 1. The
 * hero is taller than the screen while pinned; this is the share of that
 * extra height already used up.
 */
function pinProgress(section: HTMLElement): number {
  const box = section.getBoundingClientRect();
  const travel = box.height - window.innerHeight;
  return travel > 0 ? Math.min(Math.max(-box.top / travel, 0), 1) : 0;
}

/** Must match the media query on `.hero-pin` in globals.css. */
const PIN_QUERY = "(min-width: 64rem) and (min-height: 680px) and (prefers-reduced-motion: no-preference)";

/** True where the hero is pinned: a wide, tall-enough screen with motion allowed. */
function usePinned() {
  const [pinned, setPinned] = useState(() => window.matchMedia(PIN_QUERY).matches);
  useEffect(() => {
    const mq = window.matchMedia(PIN_QUERY);
    const onChange = () => setPinned(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return pinned;
}

/**
 * The hero is always the night scene, whichever theme the page is in. The
 * left side makes the claim; the right side is the evidence: the live
 * projects themselves, in a deck you can run from.
 *
 * On a wide screen the hero is pinned: it stays put while the page scrolls
 * through one step per project, and each step brings the next project to
 * the front of the deck. Elsewhere the deck turns on its own until someone
 * picks a project. `arrived` flips once the loading screen lifts, which
 * starts the headline and deals the deck.
 */
export function Hero({ arrived }: { arrived: boolean }) {
  const status = useLiveStatus(arrived);
  const pinned = usePinned();
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(demos[0].id);
  /** Where the hero is not pinned, the deck turns on its own until the visitor picks something. */
  const [auto, setAuto] = useState(true);

  // Pinned: the scroll position decides which project is in front.
  useEffect(() => {
    const section = sectionRef.current;
    if (!pinned || !section) return;
    let frame = 0;
    const read = () => {
      frame = 0;
      const step = Math.min(demos.length - 1, Math.floor(pinProgress(section) * demos.length));
      setActive(demos[step].id);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pinned]);

  const select = (id: string, byVisitor: boolean) => {
    const section = sectionRef.current;
    if (pinned && section) {
      // Picking a project while pinned scrolls to that project's step, so the page and the deck stay in agreement.
      const step = demos.findIndex((p) => p.id === id);
      const travel = section.offsetHeight - window.innerHeight;
      const top = section.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top + ((step + 0.5) / demos.length) * travel });
      return;
    }
    if (byVisitor) setAuto(false);
    setActive(id);
  };

  return (
    <section
      ref={sectionRef}
      id="top"
      data-theme="night"
      aria-label="Introduction"
      className={cn("hero-scene hero-pin relative isolate -mt-[4.5rem] text-ink", arrived && "arrived")}
      style={{ "--steps": demos.length } as CSSProperties}
    >
      <div className="hero-stage relative overflow-clip bg-linear-to-b from-(--sky-top) to-(--sky-bottom) pb-[clamp(5rem,9vw,7.5rem)]">
        <HeroBackdrop />

        <div className="hero-grid relative mx-auto grid max-w-[76rem] gap-x-14 gap-y-9 px-4 pb-10 pt-24 sm:px-8 lg:grid-cols-[minmax(0,33rem)_minmax(0,1fr)] lg:grid-rows-[1fr_auto_auto_1fr] lg:gap-y-5 lg:pb-5 lg:pt-[5.5rem]">
          <div className="hero-sink lg:col-start-1 lg:row-start-2">
            <p className="fade-up mb-4 inline-flex flex-wrap items-center gap-x-2.5 gap-y-1 rounded-lg border border-line bg-bg/50 px-3 py-1.5 text-sm text-ink-2" style={delay(0)}>
              <span className="size-2 rounded-full bg-straw" aria-hidden="true" />
              <span className="font-semibold text-ink">{hero.status}</span>
              <span aria-hidden="true" className="text-edge">/</span>
              <span>{hero.where}</span>
            </p>

            <Headline />

            <p className="hero-intro fade-up mt-4 max-w-[33rem] text-lg text-ink-2" style={delay(520)}>
              {hero.intro}
            </p>

            <ul className="hero-facts fade-up mt-4 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[0.8125rem] text-ink-2" style={delay(620)}>
              {facts.map((fact) => (
                <li key={fact} className="flex items-center gap-2">
                  <span className="size-1 rounded-full bg-straw" aria-hidden="true" />
                  {fact}
                </li>
              ))}
            </ul>
          </div>

          <div className="hero-sink lg:col-start-2 lg:row-span-2 lg:row-start-2 lg:self-center">
            <Showcase active={active} auto={auto && arrived && !pinned} onSelect={select} status={status} />
          </div>

          <div className="hero-sink lg:col-start-1 lg:row-start-3">
            <div className="fade-up" style={delay(760)}>
              <HeroCatch pinned={pinned} onSelect={(id) => select(id, true)} />
            </div>
          </div>
        </div>

        {/* The night scene ends in a snow drift, and the page below sits on the snow. */}
        <HeroDrift />
      </div>
    </section>
  );
}
