// Landscape between and behind sections. Each scene owns a scroll timeline
// (see `.sled-scene` in globals.css): the sled rides its hill for exactly as
// long as the scene is on screen, forwards as the page goes down and
// backwards as it comes back up. It is all decoration, hidden from
// assistive technology, and it stands still for reduced motion.

import { HatGradient, Pine, SledPanda } from "./Panda";
import { Snowfall } from "./Snowfall";

/** A hill the sled can ride: the same curve is the snow surface, the track left behind, and the sled's path. */
function Hill({ d, fill, id }: { d: string; fill: string; id: string }) {
  return (
    <>
      <path d={`${d} V400 H-200 Z`} fill={fill} />
      <path className="sled-track" d={d} pathLength={1} fill="none" stroke="var(--edge)" strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round" />
      <g className="sled" style={{ offsetPath: `path("${d}")` }}>
        <SledPanda hatId={id} />
      </g>
    </>
  );
}

const HERO_HILL = "M-80 70 C 120 30, 330 104, 600 72 S 930 22, 1060 44 S 1210 78, 1290 52";

/** Behind the hero: two ridges that sink at different speeds as the page scrolls away. */
export function HeroBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-clip" aria-hidden="true">
      <svg className="absolute inset-x-0 top-0 hidden h-80 w-full night:block" focusable="false">
        {[
          [5, 16, 1.1, 3.4], [13, 40, 0.9, 4.6], [21, 10, 1.4, 2.9], [30, 30, 0.9, 5.2], [38, 13, 1.1, 3.8],
          [47, 36, 1.4, 4.1], [56, 9, 0.9, 3.2], [64, 24, 1.1, 5.5], [72, 12, 1.4, 2.7], [80, 33, 0.9, 4.4],
          [87, 17, 1.1, 3.6], [94, 38, 0.9, 5], [98, 8, 1.4, 3],
        ].map(([x, y, r, d]) => (
          <circle
            key={`${x}-${y}`}
            className="twinkle"
            cx={`${x}%`}
            cy={`${y}%`}
            r={r}
            fill="#EEF4F8"
            opacity="0.6"
            style={{ animationDuration: `${d}s` }}
          />
        ))}
      </svg>

      <svg
        viewBox="0 0 1200 300"
        preserveAspectRatio="xMidYMax slice"
        className="parallax-far absolute inset-x-0 bottom-0 h-[26%] w-full"
        focusable="false"
      >
        <path d="M-40 190 C 150 120, 330 210, 520 150 S 840 80, 1010 140 S 1160 180, 1240 130 V300 H-40 Z" fill="var(--ridge-far)" />
        <g fill="var(--pine)">
          <Pine x={96} y={104} scale={1.1} />
          <Pine x={136} y={118} scale={0.8} />
          <Pine x={438} y={110} scale={0.9} />
          <Pine x={1088} y={96} scale={1} />
          <Pine x={1124} y={110} scale={0.7} />
        </g>
      </svg>
      <svg
        viewBox="0 0 1200 300"
        preserveAspectRatio="xMidYMax slice"
        className="parallax-near absolute inset-x-0 bottom-0 h-[17%] w-full"
        focusable="false"
      >
        <path d="M-40 200 C 190 130, 420 230, 640 180 S 900 110, 1020 150 S 1150 200, 1240 160 V300 H-40 Z" fill="var(--ridge-near)" />
      </svg>

      <Snowfall density={0.45} />
    </div>
  );
}

/** The drift that closes the hero. The sled crosses it as the hero scrolls off the top. */
export function HeroDrift() {
  return (
    <svg
      viewBox="0 0 1200 120"
      preserveAspectRatio="xMidYMax slice"
      className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[clamp(5rem,9vw,7.5rem)] w-full overflow-visible"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <HatGradient id="hat-hero-sled" />
      </defs>
      <Hill d={HERO_HILL} fill="var(--page-bg)" id="hat-hero-sled" />
    </svg>
  );
}
