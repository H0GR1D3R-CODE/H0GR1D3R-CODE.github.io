import type { CSSProperties } from "react";
import { hero, projects } from "@/data/resume";
import { ButtonLink } from "./Button";
import { RouteMap } from "./RouteMap";
import { HeroBackdrop, HeroDrift } from "./Scenery";

const liveDemos = projects.filter((p) => p.live);
const MARKED = "actually runs.";

/** One word of the headline, wrapped so it can rise out of its own clipped box. */
function Word({ children, i }: { children: string; i: number }) {
  return (
    <span className="word" style={{ "--i": i } as CSSProperties}>
      <span>{children}</span>
    </span>
  );
}

/** "…software that actually runs." The last two words get the marker stroke. */
function Headline() {
  const hasMark = hero.headline.endsWith(MARKED);
  const lead = (hasMark ? hero.headline.slice(0, -MARKED.length) : hero.headline).trim().split(" ");
  const marked = hasMark ? MARKED.split(" ") : [];

  return (
    <h1
      aria-label={hero.headline}
      className="arrive font-display text-[clamp(2.5rem,1.4rem+3.1vw,3.75rem)] font-extrabold leading-[1.04] tracking-[-0.022em]"
    >
      <span aria-hidden="true">
        {lead.map((w, i) => (
          <span key={i}>
            <Word i={i}>{w}</Word>{" "}
          </span>
        ))}
        {marked.length > 0 && (
          <span className="marker whitespace-nowrap">
            {marked.map((w, i) => (
              <span key={i}>
                <Word i={lead.length + i}>{w}</Word>
                {i < marked.length - 1 && " "}
              </span>
            ))}
          </span>
        )}
      </span>
    </h1>
  );
}

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export function Hero() {
  return (
    <section
      id="top"
      aria-label="Introduction"
      className="sled-scene hero-scene relative -mt-16 overflow-clip bg-linear-to-b from-(--sky-top) to-(--sky-bottom) pt-16"
    >
      <HeroBackdrop />

      <div className="relative mx-auto grid max-w-[76rem] items-center gap-10 px-4 pb-32 pt-10 sm:px-8 sm:pb-36 sm:pt-12 lg:min-h-[calc(100svh-4rem)] lg:grid-cols-2 lg:gap-12 lg:pt-6">
        <div className="hero-sink">
          <Headline />
          <p className="fade-up mt-6 max-w-[34rem] text-lg text-ink-2" style={delay(650)}>
            {hero.intro}
          </p>

          <div className="fade-up mt-8" style={delay(800)}>
            <p className="font-display text-sm font-bold text-ink-2">Open a live demo</p>
            <ul className="mt-3 flex flex-wrap gap-2.5">
              {liveDemos.map((p, i) => (
                <li key={p.id}>
                  <ButtonLink href={p.live} external variant={i === 0 ? "primary" : "secondary"}>
                    {p.name}
                  </ButtonLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="fade-up" style={delay(150)}>
          <RouteMap />
        </div>
      </div>

      {/* A snow drift closes the scene; the work below sits on the snow. */}
      <HeroDrift />
    </section>
  );
}
