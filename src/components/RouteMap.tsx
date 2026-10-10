import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { ORIGIN, findRoute, placeById, places, roads, type Place } from "@/lib/route";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { projects } from "@/data/resume";
import { cn } from "@/lib/cn";
import { ArrowOut } from "./icons";

const VIEW_W = 720;
const VIEW_H = 548;
const TOP = 40;

/** The first thing a visitor sees is already a detour, so the mechanic explains itself. */
const START_DESTINATION = "koramangala";
const START_BLOCKED = ["hebbal--shivajinagar"];
/** On arrival the map spreads out from the start before the first route is searched. */
const ARRIVAL_MS = 1150;

const destinations = places.filter((p) => p.id !== ORIGIN);
const origin = placeById[ORIGIN];

const midX = (id: string) => {
  const [a, b] = id.split("--");
  return placeById[a].x + placeById[b].x;
};
/** Roads in left-to-right order, so arrow keys walk across the map rather than through the source file. */
const roadOrder = [...roads].sort((p, q) => midX(p.id) - midX(q.id));

const ARROWS: Record<string, { x: number; y: number }> = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};

/** The nearest place in the direction of an arrow key, favouring ones that lie close to that line. */
function neighbourInDirection(from: Place, dir: { x: number; y: number }): Place | null {
  let best: Place | null = null;
  let bestScore = Infinity;
  for (const p of destinations) {
    if (p.id === from.id) continue;
    const dx = p.x - from.x;
    const dy = p.y - from.y;
    const dist = Math.hypot(dx, dy);
    const along = (dx * dir.x + dy * dir.y) / dist;
    if (along < 0.35) continue;
    const score = dist * (1 + 2 * (1 - along));
    if (score < bestScore) {
      bestScore = score;
      best = p;
    }
  }
  return best;
}

const corridorLive = projects.find((p) => p.id === "corridor")?.live;

export function RouteMap() {
  const reduced = usePrefersReducedMotion();
  const helpId = useId();
  const clipId = useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const placeRefs = useRef<Record<string, SVGGElement | null>>({});
  const roadRefs = useRef<Record<string, SVGGElement | null>>({});
  /** False until the visitor changes something, so only the very first route waits for the arrival animation. */
  const touched = useRef(false);

  const [box, setBox] = useState({ w: 560, h: 426 });
  const [destination, setDestination] = useState(START_DESTINATION);
  const [blocked, setBlocked] = useState<ReadonlySet<string>>(() => new Set(START_BLOCKED));
  const [rush, setRush] = useState(false);
  const [peek, setPeek] = useState<string | null>(null);
  const [placeTab, setPlaceTab] = useState(START_DESTINATION);
  const [roadTab, setRoadTab] = useState(roadOrder[0].id);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      if (r.width > 0) setBox({ w: r.width, h: r.height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // On a phone the map is stretched taller so places stay far enough apart
  // to tap, and only the labels that matter are shown.
  const compact = box.w < 480;
  const stretch = compact ? 1.42 : 1;
  const viewH = Math.round(TOP + (VIEW_H - TOP) * stretch);
  /**
   * Map units per screen pixel: sizes below are written in pixels and
   * multiplied by this. On short screens the map is capped in height and
   * letterboxed, so the scale is whichever dimension is tighter.
   */
  const u = Math.max(VIEW_W / Math.max(box.w, 260), viewH / Math.max(box.h, 200));
  const labelPx = compact ? 13 : Math.max(10.5, Math.min(12.5, VIEW_W / u / 50));
  const at = (p: Place) => ({ x: p.x, y: TOP + (p.y - TOP) * stretch });

  const astar = useMemo(() => findRoute(destination, blocked, rush, "astar"), [destination, blocked, rush]);
  const dijkstra = useMemo(() => findRoute(destination, blocked, rush, "dijkstra"), [destination, blocked, rush]);

  const routePlaces = new Set(astar.path ?? []);
  const runKey = `${destination}|${[...blocked].sort().join()}|${rush}`;

  const toName = placeById[destination].name;
  const minutes = Math.round(astar.minutes);
  const via = astar.path ? astar.path.slice(1, -1).map((id) => placeById[id].name) : [];
  const viaText = via.length > 0 ? `via ${via.join(", ")}` : "direct";
  const comparison =
    astar.examined.length < dijkstra.examined.length
      ? `A* checked ${astar.examined.length} of ${places.length} places to find it; Dijkstra needed ${dijkstra.examined.length}.`
      : `A* and Dijkstra both checked ${astar.examined.length} of ${places.length} places to find it.`;
  const snowed = blocked.size === 1 ? "1 road is snowed in" : `${blocked.size} roads are snowed in`;
  const announcement = astar.path
    ? `Fastest route to ${toName}: ${minutes} minutes, ${viaText}. ${snowed}.`
    : `No open road to ${toName}. ${snowed}.`;

  const goTo = (id: string) => {
    touched.current = true;
    setDestination(id);
    setPlaceTab(id);
  };

  const toggleRoad = (id: string) => {
    touched.current = true;
    setBlocked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const onPlaceKey = (e: KeyboardEvent<SVGGElement>, id: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      goTo(id);
      return;
    }
    const dir = ARROWS[e.key];
    if (!dir) return;
    e.preventDefault();
    const next = neighbourInDirection(placeById[id], dir);
    if (!next) return;
    setPlaceTab(next.id);
    placeRefs.current[next.id]?.focus();
  };

  const onRoadKey = (e: KeyboardEvent<SVGGElement>, id: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleRoad(id);
      return;
    }
    if (!(e.key in ARROWS)) return;
    e.preventDefault();
    const step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1;
    const i = roadOrder.findIndex((r) => r.id === id);
    const next = roadOrder[(i + step + roadOrder.length) % roadOrder.length];
    setRoadTab(next.id);
    roadRefs.current[next.id]?.focus();
  };

  const routePoints = (astar.path ?? []).map((id) => at(placeById[id]));
  const routeD = routePoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`).join(" ");
  const arrival = touched.current || reduced ? 0 : ARRIVAL_MS;
  const drawDelay = reduced ? 0 : arrival + astar.examined.length * 40;

  /** Where a place's name goes. On a phone, names sit above the dot and are kept inside the frame. */
  const labelFor = (p: Place) => {
    const { x, y } = at(p);
    const size = labelPx * u;
    if (!compact) return { x: x + p.label.dx * u, y: y + p.label.dy * u, anchor: p.label.anchor, size };
    // The full name would run into Hebbal at this size; the readout below the map names the start.
    if (p.id === ORIGIN) return { x, y: y - 22 * u, anchor: "middle" as const, size };
    const half = p.name.length * size * 0.3 + 6 * u;
    const lift = 15;
    return {
      x: Math.min(Math.max(x, half), VIEW_W - half),
      y: y < 70 ? y + 26 * u : y - lift * u,
      anchor: "middle" as const,
      size,
    };
  };

  const o = at(origin);
  const originLabel = labelFor(origin);

  return (
    <div className="route-panel">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="font-display text-base font-extrabold">Corridor, in miniature</h2>
        {corridorLive && (
          <a
            href={corridorLive}
            target="_blank"
            rel="noreferrer noopener"
            className="link inline-flex min-h-9 items-center gap-1 font-display text-sm font-bold"
          >
            Open the full atlas, 832 junctions <ArrowOut width={14} height={14} />
          </a>
        )}
      </div>
      <p id={helpId} className="pb-3 pt-1 text-[0.9375rem] text-ink-2">
        Pick a place to route there, or a road to snow it in.
        <span className="keyboard-hint"> Arrow keys move, Enter picks.</span>
      </p>

      <div className="overflow-hidden rounded-[1.75rem] bg-(--map-ground) shadow-[0_24px_48px_-36px_rgb(11_22_34/0.6)]">
        <svg
          ref={svgRef}
          className="route-map"
          viewBox={`0 0 ${VIEW_W} ${viewH}`}
          style={{
            aspectRatio: `${VIEW_W} / ${viewH}`,
            maxHeight: compact ? undefined : "clamp(22rem, 100svh - 26rem, 34rem)",
          }}
          role="group"
          aria-label="Schematic road map of Bengaluru. The route starts at Yeshwanthpur."
          aria-describedby={helpId}
        >
          <defs>
            {/* The whole map is revealed through a circle that grows from the starting point. */}
            <clipPath id={clipId}>
              <circle className="map-reveal" cx={o.x} cy={o.y} r={1200} />
            </clipPath>
          </defs>

          <g clipPath={`url(#${clipId})`}>
            <g aria-hidden="true">
              {[
                { x: 284, y: 84, rx: 22, ry: 11 },
                { x: 446, y: 228, rx: 15, ry: 9 },
                { x: 548, y: 452, rx: 30, ry: 12 },
              ].map((lake) => (
                <ellipse
                  key={lake.x}
                  cx={lake.x}
                  cy={TOP + (lake.y - TOP) * stretch}
                  rx={lake.rx}
                  ry={lake.ry}
                  fill="var(--map-water)"
                />
              ))}
              <g transform={`translate(${VIEW_W - 26 * u} ${24 * u}) scale(${u})`} fill="var(--ink-2)">
                <path d="M0 -12 L5 4 L0 1 L-5 4 Z" />
                <text y="16" textAnchor="middle" fontSize="10" fontWeight="700" fontFamily="var(--font-display)">
                  N
                </text>
              </g>
            </g>

            <g role="group" aria-label="Roads">
              {roadOrder.map((r) => {
                const a = at(placeById[r.a]);
                const b = at(placeById[r.b]);
                const isBlocked = blocked.has(r.id);
                const mx = (a.x + b.x) / 2;
                const my = (a.y + b.y) / 2;
                const line = { x1: a.x, y1: a.y, x2: b.x, y2: b.y, strokeLinecap: "round" as const };
                return (
                  <g
                    key={r.id}
                    ref={(el) => {
                      roadRefs.current[r.id] = el;
                    }}
                    className="road"
                    role="button"
                    tabIndex={roadTab === r.id ? 0 : -1}
                    aria-pressed={isBlocked}
                    aria-label={`Snow in the road between ${placeById[r.a].name} and ${placeById[r.b].name}`}
                    onClick={() => toggleRoad(r.id)}
                    onFocus={() => setRoadTab(r.id)}
                    onKeyDown={(e) => onRoadKey(e, r.id)}
                  >
                    <line className="focus-ring" {...line} stroke="var(--focus)" strokeWidth={13 * u} />
                    <line
                      className="road-line"
                      {...line}
                      strokeWidth={(r.kind === "city" ? 2.75 : 4.5) * u}
                      strokeDasharray={isBlocked ? `${0.5 * u} ${7 * u}` : undefined}
                      opacity={isBlocked ? 0.75 : 1}
                    />
                    <line {...line} stroke="transparent" strokeWidth={Math.min(20 * u, 30)} />
                    {isBlocked && (
                      <g transform={`translate(${mx} ${my}) scale(${u})`}>
                        <circle r="10" fill="var(--ink)" />
                        <path
                          d="M0 -5.5V5.5M-4.8 -2.75 4.8 2.75M-4.8 2.75 4.8 -2.75"
                          stroke="var(--bg)"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                      </g>
                    )}
                  </g>
                );
              })}
            </g>

            {astar.path && (
              <g key={runKey} pointerEvents="none" aria-hidden="true">
                {!reduced &&
                  astar.examined.map((id, i) => {
                    const p = at(placeById[id]);
                    return (
                      <circle
                        key={id}
                        className="ripple"
                        cx={p.x}
                        cy={p.y}
                        r={20 * u}
                        fill="var(--map-route)"
                        style={{ animationDelay: `${arrival + i * 40}ms` }}
                      />
                    );
                  })}
                {[
                  { stroke: "var(--map-route-case)", w: 9.5 },
                  { stroke: "var(--map-route)", w: 5.5 },
                ].map((layer) => (
                  <path
                    key={layer.stroke}
                    className="route-draw"
                    d={routeD}
                    pathLength={1}
                    fill="none"
                    stroke={layer.stroke}
                    strokeWidth={layer.w * u}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ animationDelay: `${drawDelay}ms` }}
                  />
                ))}
              </g>
            )}

            <g aria-hidden="true">
              <circle cx={o.x} cy={o.y} r={6 * u} fill="var(--ink)" />
              <path
                transform={`translate(${o.x} ${o.y - 4 * u}) scale(${u})`}
                d="M-12 0 Q0 4 12 0 L0 -11 Z"
                fill="var(--map-route)"
                stroke="var(--map-route-case)"
                strokeWidth="1.25"
                strokeLinejoin="round"
              />
              <text
                className="map-label"
                x={originLabel.x}
                y={originLabel.y}
                textAnchor={originLabel.anchor}
                fontSize={originLabel.size}
                fontWeight={800}
                strokeWidth={4 * u}
              >
                {compact ? "Start" : origin.name}
              </text>
            </g>

            <g role="group" aria-label="Places">
              {destinations.map((p) => {
                const { x, y } = at(p);
                const isDestination = p.id === destination;
                const onRoute = routePlaces.has(p.id);
                const label = labelFor(p);
                const showLabel = !compact || isDestination || peek === p.id;
                return (
                  <g
                    key={p.id}
                    ref={(el) => {
                      placeRefs.current[p.id] = el;
                    }}
                    className="place"
                    role="button"
                    tabIndex={placeTab === p.id ? 0 : -1}
                    aria-pressed={isDestination}
                    aria-label={`Route to ${p.name}`}
                    onClick={() => goTo(p.id)}
                    onFocus={() => {
                      setPlaceTab(p.id);
                      setPeek(p.id);
                    }}
                    onBlur={() => setPeek(null)}
                    onPointerEnter={() => setPeek(p.id)}
                    onPointerLeave={() => setPeek(null)}
                    onKeyDown={(e) => onPlaceKey(e, p.id)}
                  >
                    <circle className="focus-ring" cx={x} cy={y} r={14 * u} fill="none" stroke="var(--focus)" strokeWidth={3 * u} />
                    <circle cx={x} cy={y} r={Math.min(22 * u, 40)} fill="transparent" />
                    {isDestination ? (
                      <>
                        <circle cx={x} cy={y} r={8.5 * u} fill="var(--map-route)" stroke="var(--map-route-case)" strokeWidth={2.5 * u} />
                        <circle cx={x} cy={y} r={2.75 * u} fill="var(--map-route-case)" />
                      </>
                    ) : (
                      <circle
                        className="place-dot"
                        cx={x}
                        cy={y}
                        r={(onRoute ? 5 : 4.5) * u}
                        fill={onRoute ? "var(--map-route)" : "var(--card)"}
                        stroke={onRoute ? "var(--map-route-case)" : "var(--ink)"}
                        strokeWidth={1.75 * u}
                      />
                    )}
                    {showLabel && (
                      <text
                        className="map-label"
                        x={label.x}
                        y={label.y}
                        textAnchor={label.anchor}
                        fontSize={label.size}
                        fontWeight={isDestination ? 800 : 600}
                        strokeWidth={4 * u}
                      >
                        {p.name}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          </g>
        </svg>
      </div>

      <div className="pt-4">
        <p className="sr-only" aria-live="polite">
          {announcement}
        </p>

        {astar.path ? (
          <>
            <p className="font-display text-lg font-extrabold leading-tight sm:text-xl">
              {origin.name} <span aria-hidden="true">→</span>
              <span className="sr-only">to</span> {toName}
            </p>
            <p className="mt-1.5 font-mono text-sm text-ink-2">
              <strong className="font-bold text-ink">{minutes} min</strong> · {viaText}
            </p>
            <p className="mt-1.5 text-[0.9375rem] text-ink-2">{comparison} Travel times are modelled.</p>
          </>
        ) : (
          <>
            <p className="font-display text-lg font-extrabold leading-tight sm:text-xl">No open road to {toName}</p>
            <p className="mt-1.5 text-[0.9375rem] text-ink-2">
              Every way in is snowed in. Pick a snowed-in road to reopen it, or clear all the snow.
            </p>
          </>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3">
          <label className="flex items-center gap-2 font-display text-sm font-bold">
            Go to
            <select
              value={destination}
              onChange={(e) => goTo(e.target.value)}
              className="h-10 rounded-lg border-[1.5px] border-edge bg-card px-2.5 font-display text-sm font-semibold text-ink hover:border-ink"
            >
              {[...destinations]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
            </select>
          </label>

          <button
            type="button"
            role="switch"
            aria-checked={rush}
            onClick={() => {
              touched.current = true;
              setRush((v) => !v);
            }}
            className="group flex h-10 items-center gap-2.5 font-display text-sm font-bold"
          >
            <span
              className={cn(
                "relative h-6 w-10 rounded-full border-[1.5px] transition-colors",
                rush ? "border-ink bg-ink" : "border-edge bg-card group-hover:border-ink"
              )}
            >
              <span
                className={cn(
                  "absolute top-1/2 size-4 -translate-y-1/2 rounded-full transition-[left,background-color] motion-reduce:transition-none",
                  rush ? "left-[1.125rem] bg-bg" : "left-0.5 bg-edge"
                )}
              />
            </span>
            Rush hour, 6:30 pm
          </button>

          <button
            type="button"
            onClick={() => {
              touched.current = true;
              setBlocked(new Set());
            }}
            disabled={blocked.size === 0}
            className="press inline-flex h-10 items-center rounded-full border-[1.5px] border-edge px-4 font-display text-sm font-bold hover:border-ink hover:bg-bg-2 disabled:pointer-events-none disabled:opacity-45"
          >
            <span className="pt-[0.14em]">Clear snow</span>
          </button>
        </div>
      </div>
    </div>
  );
}
