// The panda in a straw hat from the GitHub profile banner, redrawn from the
// same shapes and kept small everywhere except the About illustration:
// the header mark, a sled between sections, and a peek over the footer drift.

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

export function HatGradient({ id }: { id: string }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#C99A45" />
      <stop offset="0.5" stopColor="#ECC273" />
      <stop offset="1" stopColor="#C4933F" />
    </linearGradient>
  );
}

type HeadProps = {
  hatId: string;
  blink?: boolean;
  /** Lets the eye highlights follow the pointer (see PandaScene). */
  look?: boolean;
  snowOnHat?: boolean;
};

/** Head and hat. Coordinates match the README banner: the face is centred on (980, 304). */
export function PandaHead({ hatId, blink = false, look = false, snowOnHat = false }: HeadProps) {
  return (
    <>
      <circle cx="915" cy="293" r="18" fill="#0A1119" stroke="#6F97B4" strokeOpacity="0.45" strokeWidth="2" />
      <circle cx="1045" cy="293" r="18" fill="#0A1119" stroke="#6F97B4" strokeOpacity="0.45" strokeWidth="2" />
      <ellipse cx="980" cy="304" rx="63" ry="55" fill="#F6FAFC" stroke="#5E7C93" strokeOpacity="0.55" strokeWidth="2.5" />
      <ellipse cx="956" cy="303" rx="12.5" ry="16" fill="#131C26" transform="rotate(22 956 303)" />
      <ellipse cx="1004" cy="303" rx="12.5" ry="16" fill="#131C26" transform="rotate(-22 1004 303)" />
      <g className={look ? "panda-look" : undefined}>
        <g className={blink ? "panda-blink" : undefined}>
          <circle cx="958.5" cy="299" r="2.8" fill="#F6FAFC" />
          <circle cx="1001.5" cy="299" r="2.8" fill="#F6FAFC" />
        </g>
      </g>
      <ellipse cx="980" cy="327" rx="7" ry="4.5" fill="#131C26" />
      <path d="M880 272 Q980 292 1080 272 L980 208 Z" fill={`url(#${hatId})`} />
      <g fill="none" stroke="#9C7430" strokeWidth="1.4" opacity="0.55">
        <path d="M980 208 L912 276M980 208 L946 281M980 208 L980 282M980 208 L1014 281M980 208 L1048 276" />
        <path d="M930 240 Q980 252 1030 240" />
      </g>
      <path d="M880 272 Q980 292 1080 272" fill="none" stroke="#9C7430" strokeWidth="2.2" opacity="0.7" />
      {snowOnHat && (
        <path
          d="M980 205 C 962 215, 950 224, 944 233 C 958 229, 966 236, 980 231 C 994 236, 1002 229, 1016 233 C 1010 224, 998 215, 980 205 Z"
          fill="#EEF4F8"
        />
      )}
    </>
  );
}

/** Small mark for the header. Decorative: the name next to it carries the meaning. */
export function PandaMark({ className }: { className?: string }) {
  return (
    <svg viewBox="872 196 216 172" className={className} aria-hidden="true" focusable="false">
      <defs>
        <HatGradient id="hat-mark" />
      </defs>
      <PandaHead hatId="hat-mark" />
    </svg>
  );
}

/**
 * The panda on a sled, drawn around its own origin so the point where the
 * runner meets the snow is (0, 0). Scenery.tsx slides it along a hill.
 */
export function SledPanda({ hatId }: { hatId: string }) {
  return (
    <g>
      <path d="M-24 -3 H17 Q26 -3 26 -12" fill="none" stroke="#9C7430" strokeWidth="3" strokeLinecap="round" />
      <path d="M-17 -3 V-10 M11 -3 V-10" stroke="#9C7430" strokeWidth="2.5" />
      <path d="M-22 -10 H16" stroke="#C99A45" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="-4" cy="-21" rx="14" ry="12" fill="#131C26" stroke="#6F97B4" strokeOpacity="0.45" strokeWidth="1" />
      <ellipse cx="7" cy="-15" rx="6" ry="4.5" fill="#131C26" />
      <g transform="translate(-2 -37) scale(0.2) translate(-980 -304)">
        <PandaHead hatId={hatId} />
      </g>
    </g>
  );
}

const FLAKES = [
  [812, 2.4, 9, -1.2, 10], [846, 1.6, 13, -7.5, -14], [884, 3, 8, -4.1, 22], [921, 1.8, 12, -9.3, -8],
  [958, 2.2, 10, -2.6, 16], [996, 1.5, 14, -11.2, -20], [1031, 2.8, 8.5, -5.8, 12], [1066, 1.9, 11.5, -0.4, -10],
  [1102, 2.5, 9.5, -6.9, 18], [1139, 1.7, 13.5, -3.3, -16], [1161, 2.1, 10.5, -8.4, 8], [831, 2, 11, -5.2, 14],
  [902, 2.6, 9, -10.1, -12], [1015, 2.3, 12.5, -7.7, 20], [1087, 1.6, 10, -1.9, -18], [1124, 2.9, 8, -9.9, 6],
];

/**
 * The About illustration: the panda from the GitHub avatar, sitting in the
 * snow. Its eyes follow the pointer and it blinks now and then. It takes
 * the place a portrait photo would usually have.
 */
export function PandaScene({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const svg = ref.current;
    if (!svg || reduced) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = svg.getBoundingClientRect();
        // The face sits about 39% of the way down the illustration.
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height * 0.39);
        const dist = Math.hypot(dx, dy) || 1;
        const reach = Math.min(dist / 240, 1);
        svg.style.setProperty("--look-x", ((dx / dist) * reach * 3.4).toFixed(2));
        svg.style.setProperty("--look-y", ((dy / dist) * reach * 2.6).toFixed(2));
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [reduced]);

  return (
    <svg
      ref={ref}
      viewBox="780 110 400 500"
      className={className}
      role="img"
      aria-label="Illustration of a panda in a straw hat sitting in falling snow, the avatar Nebin uses on GitHub."
    >
      <defs>
        <HatGradient id="hat-scene" />
        <linearGradient id="scene-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--sky-top)" />
          <stop offset="1" stopColor="var(--sky-bottom)" />
        </linearGradient>
        <linearGradient id="scene-drift" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--drift-top)" />
          <stop offset="1" stopColor="var(--drift-bottom)" />
        </linearGradient>
      </defs>

      <rect x="780" y="110" width="400" height="500" fill="url(#scene-sky)" />

      <g className="hidden night:block" fill="#EEF4F8">
        {[[820, 150, 1.4, 3.1], [905, 190, 1, 4.2], [1010, 140, 1.6, 3.6], [1090, 205, 1.1, 5], [1150, 160, 1.4, 2.8], [860, 250, 1, 4.6], [1125, 270, 1.2, 3.9]].map(
          ([x, y, r, d]) => (
            <circle key={`${x}-${y}`} className="twinkle" cx={x} cy={y} r={r} opacity="0.6" style={{ animationDuration: `${d}s` }} />
          )
        )}
      </g>

      <path d="M780 392 C 860 356, 930 404, 1010 374 S 1120 346, 1180 380 V620 H780 Z" fill="var(--ridge-far)" />
      <g fill="var(--pine)">
        <Pine x={836} y={332} scale={1.5} />
        <Pine x={1128} y={318} scale={1.25} />
        <Pine x={1086} y={338} scale={0.9} />
      </g>
      <path d="M780 436 C 880 410, 960 450, 1060 426 S 1150 416, 1180 434 V620 H780 Z" fill="var(--ridge-near)" />

      {/* body: sitting, arms resting, feet tucked into the drift */}
      <ellipse cx="980" cy="400" rx="84" ry="66" fill="#131C26" stroke="#6F97B4" strokeOpacity="0.45" strokeWidth="2" />
      <ellipse cx="980" cy="412" rx="47" ry="45" fill="#F2F0E8" />
      <ellipse cx="921" cy="420" rx="25" ry="35" fill="#131C26" stroke="#6F97B4" strokeOpacity="0.45" strokeWidth="2" transform="rotate(16 921 420)" />
      <ellipse cx="1039" cy="420" rx="25" ry="35" fill="#131C26" stroke="#6F97B4" strokeOpacity="0.45" strokeWidth="2" transform="rotate(-16 1039 420)" />
      <ellipse cx="943" cy="462" rx="27" ry="17" fill="#0A1119" stroke="#6F97B4" strokeOpacity="0.45" strokeWidth="2" />
      <ellipse cx="1017" cy="462" rx="27" ry="17" fill="#0A1119" stroke="#6F97B4" strokeOpacity="0.45" strokeWidth="2" />
      <PandaHead hatId="hat-scene" blink look snowOnHat />

      <path
        d="M780 474 C 860 446, 960 484, 1060 460 S 1150 450, 1180 468 V620 H780 Z"
        fill="url(#scene-drift)"
      />

      <g fill="var(--flake)" aria-hidden="true">
        {FLAKES.map(([x, r, duration, delay, drift]) => (
          <circle
            key={`${x}-${delay}`}
            className="snow-fall"
            cx={x}
            cy={reduced ? 140 + ((x * 7) % 420) : 96}
            r={r}
            opacity="0.85"
            style={
              {
                animationDuration: `${duration}s`,
                animationDelay: `${delay}s`,
                "--drift": `${drift}px`,
              } as React.CSSProperties
            }
          />
        ))}
      </g>
    </svg>
  );
}

/** A pine, drawn from its tip downwards. Must sit inside an element that sets `fill`. */
export function Pine({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${scale})`}
      d="M0 0 L-10 17 H-5 L-15 34 H-8 L-19 52 H-3 V60 H3 V52 H19 L8 34 H15 L5 17 H10 Z"
    />
  );
}

/** The footer scene: the panda comes up over a snow drift, as on the profile banner. */
export function PandaDrift() {
  return (
    <div className="relative h-36 overflow-y-clip sm:h-44" aria-hidden="true">
      <svg
        viewBox="872 196 216 172"
        className="peek-up absolute bottom-[38%] right-[14%] h-[62%]"
        focusable="false"
      >
        <defs>
          <HatGradient id="hat-drift" />
        </defs>
        <PandaHead hatId="hat-drift" blink snowOnHat />
      </svg>
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-[62%] w-full"
        focusable="false"
      >
        <defs>
          <linearGradient id="drift-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--drift-top)" />
            <stop offset="1" stopColor="var(--drift-bottom)" />
          </linearGradient>
        </defs>
        <path
          d="M0 46 C 190 14, 400 66, 640 42 S 900 6, 990 12 S 1130 44, 1200 20 V120 H0 Z"
          fill="url(#drift-fill)"
        />
      </svg>
    </div>
  );
}
