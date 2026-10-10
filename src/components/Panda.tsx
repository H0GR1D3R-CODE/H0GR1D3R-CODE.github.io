// The panda in a straw hat from the GitHub profile banner, redrawn from the
// same shapes. It works at a laptop in About, sleds the hills and the
// timeline, and peeks over the footer drift.

import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { cn } from "@/lib/cn";
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

const OUTLINE = { stroke: "#6F97B4", strokeOpacity: 0.45, strokeWidth: 2 };

type HeadProps = {
  hatId: string;
  blink?: boolean;
  /** Lets the eye highlights follow the pointer (see PandaAtWork). */
  look?: boolean;
  snowOnHat?: boolean;
};

/** Head and hat. Coordinates match the README banner: the face is centred on (980, 304). */
export function PandaHead({ hatId, blink = false, look = false, snowOnHat = false }: HeadProps) {
  return (
    <>
      <circle cx="915" cy="293" r="18" fill="#0A1119" {...OUTLINE} />
      <circle cx="1045" cy="293" r="18" fill="#0A1119" {...OUTLINE} />
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
      <g className="panda-hat">
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
      </g>
    </>
  );
}

/**
 * The panda on a sled, drawn around its own origin so the point where the
 * runner meets the snow is (0, 0). It faces right.
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

/** A pine, drawn from its tip downwards. Must sit inside an element that sets `fill`. */
export function Pine({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${scale})`}
      d="M0 0 L-10 17 H-5 L-15 34 H-8 L-19 52 H-3 V60 H3 V52 H19 L8 34 H15 L5 17 H10 Z"
    />
  );
}

/**
 * Makes a panda's eyes follow the pointer. `faceAt` is how far down the
 * element the face sits, from 0 (top) to 1 (bottom).
 */
function useLookAt(ref: RefObject<HTMLElement | SVGSVGElement | null>, faceAt: number, enabled: boolean) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height * faceAt);
        const dist = Math.hypot(dx, dy) || 1;
        const reach = Math.min(dist / 240, 1);
        el.style.setProperty("--look-x", ((dx / dist) * reach * 3.4).toFixed(2));
        el.style.setProperty("--look-y", ((dy / dist) * reach * 2.6).toFixed(2));
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [ref, faceAt, enabled]);
}

/** One slot in the scroll sequence: see `.act` in globals.css. */
const act = (k: number, extra?: CSSProperties) => ({ "--k": k, ...extra }) as CSSProperties;

/** A small card that lifts out of the laptop and settles beside the panda. (x, y) is where it ends up. */
function Chip({ k, x, y, label, children }: { k: number; x: number; y: number; label: string; children: React.ReactNode }) {
  return (
    <g className="act act-chip" style={act(k, { "--fx": `${980 - x}px`, "--fy": `${396 - y}px` } as CSSProperties)}>
      <g className="bob" style={{ animationDelay: `${-k * 0.9}s` }}>
        <g transform={`translate(${x} ${y})`}>
          <rect x="-34" y="-25" width="68" height="50" rx="9" fill="var(--card)" stroke="var(--edge)" strokeWidth="1.5" />
          {children}
          <text y="45" textAnchor="middle" fontSize="15" fontWeight="700" fill="var(--ink)" fontFamily="var(--font-sans)">
            {label}
          </text>
        </g>
      </g>
    </g>
  );
}

const FLAKES = [
  [812, 2.4, 9, -1.2, 10], [884, 3, 8, -4.1, 22], [958, 2.2, 10, -2.6, 16], [1031, 2.8, 8.5, -5.8, 12],
  [1102, 2.5, 9.5, -6.9, 18], [1161, 2.1, 10.5, -8.4, 8], [846, 1.6, 13, -7.5, -14], [1066, 1.9, 11.5, -0.4, -10],
];

/**
 * The About figure. It is a little performance tied to scrolling: the
 * laptop opens, its mark lights up, and the three kinds of thing built on
 * it (web, IoT, ML) lift off the screen one by one before a flag goes in
 * the snow. The eyes follow the pointer throughout. Without scroll-linked
 * animation, or with reduced motion, it is simply drawn in its final state.
 */
export function PandaAtWork({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const reduced = usePrefersReducedMotion();

  // The face sits about 43% of the way down the drawing.
  useLookAt(ref, 0.43, !reduced);

  return (
    <svg
      ref={ref}
      viewBox="770 100 420 430"
      className={className}
      role="img"
      aria-label="A panda in a straw hat working at a laptop in the snow. Around it float the three kinds of thing it builds: web, IoT and machine learning."
    >
      <defs>
        <HatGradient id="hat-work" />
        <radialGradient id="work-glow">
          <stop offset="0" stopColor="var(--straw-soft)" stopOpacity="0.75" />
          <stop offset="1" stopColor="var(--straw-soft)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* a rise of snow behind, so the figure has ground to sit on without a frame */}
      <path d="M790 478 C 850 400, 930 372, 1000 386 S 1130 410, 1170 478 Z" fill="var(--ridge-near)" />
      <g fill="var(--pine)">
        <Pine x={842} y={372} scale={1.15} />
        <Pine x={1118} y={366} scale={0.95} />
      </g>

      {/* the panda */}
      <ellipse cx="980" cy="400" rx="84" ry="66" fill="#131C26" {...OUTLINE} />
      <ellipse cx="980" cy="412" rx="47" ry="45" fill="#F2F0E8" />
      <ellipse cx="910" cy="470" rx="26" ry="15" fill="#0A1119" {...OUTLINE} />
      <ellipse cx="1050" cy="470" rx="26" ry="15" fill="#0A1119" {...OUTLINE} />
      <g className="typing">
        <ellipse cx="926" cy="424" rx="23" ry="36" fill="#131C26" {...OUTLINE} transform="rotate(24 926 424)" />
      </g>
      <g className="typing typing-late">
        <ellipse cx="1034" cy="424" rx="23" ry="36" fill="#131C26" {...OUTLINE} transform="rotate(-24 1034 424)" />
      </g>
      <g className="act act-nod" style={act(5)}>
        <PandaHead hatId="hat-work" blink look snowOnHat />
      </g>

      {/* the laptop, seen from behind: the lid opens, then its mark lights up */}
      <ellipse className="act act-glow" style={act(1)} cx="980" cy="392" rx="96" ry="40" fill="url(#work-glow)" />
      <g className="act act-lid" style={act(0)}>
        <rect x="924" y="394" width="112" height="74" rx="8" fill="#1D3349" stroke="#6F97B4" strokeWidth="1.5" />
        <g transform="translate(980 431)" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M-9 9V-9l18 18V-9" stroke="#6F97B4" strokeWidth="3.5" />
          <g className="act act-lit" style={act(1)}>
            <path d="M-9 9V-9l18 18V-9" stroke="#ECC273" strokeWidth="3.5" />
            <circle cx="9" cy="-9" r="4.2" fill="#ECC273" />
          </g>
        </g>
      </g>
      <path d="M914 466 H1046 L1054 480 Q1055 485 1050 485 H910 Q905 485 906 480 Z" fill="#24405A" stroke="#6F97B4" strokeWidth="1.5" />

      <path d="M782 496 C 850 460, 1110 460, 1178 496 C 1110 520, 850 520, 782 496 Z" fill="var(--drift-top)" />

      {/* the flag that goes in when it ships */}
      <g className="act act-flag" style={act(5)}>
        <path d="M1108 492 V420" stroke="#0B1622" strokeWidth="3" strokeLinecap="round" />
        <path d="M1109 422 L1150 435 L1109 449 Z" fill="var(--straw)" stroke="#0B1622" strokeWidth="1.75" strokeLinejoin="round" />
      </g>

      {/* what gets built */}
      <Chip k={2} x={826} y={300} label="Web">
        <path d="M-34 -11 H34" stroke="var(--edge)" strokeWidth="1.5" />
        <circle cx="-25" cy="-18" r="2" fill="var(--straw)" />
        <circle cx="-18" cy="-18" r="2" fill="var(--edge)" />
        <path d="M-24 -1 H10 M-24 8 H22 M-24 16 H0" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" />
      </Chip>
      <Chip k={3} x={1134} y={292} label="IoT">
        <rect x="-11" y="-9" width="22" height="22" rx="3.5" fill="none" stroke="var(--ink)" strokeWidth="2.5" />
        <path d="M-17 -2 H-11 M-17 6 H-11 M11 -2 H17 M11 6 H17 M-4 13 V19 M4 13 V19" stroke="var(--ink)" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="0" cy="2" r="3" fill="var(--straw)" />
        <path d="M-9 -14 Q0 -22 9 -14" fill="none" stroke="var(--straw)" strokeWidth="2.2" strokeLinecap="round" />
      </Chip>
      <Chip k={4} x={980} y={146} label="ML">
        <path d="M-22 14 L-10 2 L0 8 L22 -14" fill="none" stroke="var(--straw)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <g fill="var(--ink)">
          <circle cx="-20" cy="5" r="2.4" />
          <circle cx="-8" cy="-8" r="2.4" />
          <circle cx="3" cy="-2" r="2.4" />
          <circle cx="10" cy="12" r="2.4" />
          <circle cx="20" cy="-4" r="2.4" />
        </g>
      </Chip>

      <g fill="var(--flake)" aria-hidden="true">
        {FLAKES.map(([x, r, duration, delay, drift]) => (
          <circle
            key={`${x}-${delay}`}
            className="snow-fall"
            cx={x}
            cy={reduced ? 130 + ((x * 7) % 330) : 86}
            r={r}
            opacity="0.8"
            style={{ animationDuration: `${duration}s`, animationDelay: `${delay}s`, "--drift": `${drift}px` } as CSSProperties}
          />
        ))}
      </g>
    </svg>
  );
}

/** Where along the drift the panda can come up, as a percentage from the left. */
const SPOTS = [84, 60, 38, 17];

/**
 * The footer scene: the panda behind a snow drift, as on the profile banner.
 * It is not just scenery. Its eyes follow the pointer, it comes up and tips
 * its hat when the pointer (or keyboard focus) reaches it, and pressing it
 * sends it under the snow to come up somewhere else along the drift.
 */
export function PandaDrift() {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);
  const [spot, setSpot] = useState(0);
  const [ducked, setDucked] = useState(false);
  // The face sits about 63% of the way down the button.
  useLookAt(ref, 0.63, !reduced);

  const hop = () => {
    if (ducked) return;
    setDucked(true);
    window.setTimeout(
      () => {
        setSpot((s) => (s + 1) % SPOTS.length);
        window.setTimeout(() => setDucked(false), 140);
      },
      reduced ? 0 : 360
    );
  };

  return (
    <div className="relative h-36 [clip-path:inset(-4rem_0_0_0)] sm:h-44">
      <button
        ref={ref}
        type="button"
        onClick={hop}
        aria-label="The panda. Press to send it somewhere else along the drift."
        className={cn("panda-peek absolute bottom-[34%] h-[62%] -translate-x-1/2 rounded-xl", ducked && "is-ducked")}
        style={{ left: `${SPOTS[spot]}%` }}
      >
        <span className="peek-up block h-full">
          <svg viewBox="872 196 216 172" className="panda-rise block h-full w-auto overflow-visible" aria-hidden="true" focusable="false">
            <defs>
              <HatGradient id="hat-drift" />
            </defs>
            <PandaHead hatId="hat-drift" blink look snowOnHat />
          </svg>
        </span>
      </button>
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] w-full"
        aria-hidden="true"
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
