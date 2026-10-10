// ─────────────────────────────────────────────────────────────────────────
// The hero map's engine: a hand-placed schematic of Bengaluru and the two
// shortest-path searches that run over it. It is a small cut of Corridor
// (github.com/H0GR1D3R-CODE/corridor-routing-atlas), which does the same
// thing over 832 junctions. Place positions are approximate and travel
// times are a model, not a traffic feed.
// ─────────────────────────────────────────────────────────────────────────

export type Place = {
  id: string;
  name: string;
  x: number;
  y: number;
  /** Label offset from the dot, in screen pixels, and which side it hangs from. */
  label: { dx: number; dy: number; anchor: "start" | "middle" | "end" };
};

export type RoadKind = "highway" | "ring" | "city";

export type Road = {
  id: string;
  a: string;
  b: string;
  kind: RoadKind;
};

/** Every trip starts at Yeshwanthpur, as it does on Corridor's own front page. */
export const ORIGIN = "yeshwanthpur";

const E = { dx: 11, dy: 4, anchor: "start" } as const;
const W = { dx: -11, dy: 4, anchor: "end" } as const;
const N = { dx: 0, dy: -12, anchor: "middle" } as const;
const S = { dx: 0, dy: 20, anchor: "middle" } as const;

export const places: Place[] = [
  { id: "yelahanka", name: "Yelahanka", x: 330, y: 40, label: E },
  { id: "hebbal", name: "Hebbal", x: 340, y: 120, label: { dx: 10, dy: -8, anchor: "start" } },
  { id: "peenya", name: "Peenya", x: 90, y: 130, label: N },
  { id: "yeshwanthpur", name: "Yeshwanthpur", x: 190, y: 165, label: { dx: 0, dy: -22, anchor: "middle" } },
  { id: "malleshwaram", name: "Malleshwaram", x: 270, y: 215, label: E },
  { id: "rajajinagar", name: "Rajajinagar", x: 175, y: 265, label: W },
  { id: "majestic", name: "Majestic", x: 285, y: 300, label: E },
  { id: "shivajinagar", name: "Shivajinagar", x: 385, y: 245, label: { dx: 10, dy: -8, anchor: "start" } },
  { id: "indiranagar", name: "Indiranagar", x: 490, y: 290, label: E },
  { id: "krpuram", name: "KR Puram", x: 600, y: 190, label: N },
  { id: "whitefield", name: "Whitefield", x: 672, y: 300, label: S },
  { id: "marathahalli", name: "Marathahalli", x: 590, y: 365, label: E },
  { id: "vijayanagar", name: "Vijayanagar", x: 130, y: 350, label: W },
  { id: "banashankari", name: "Banashankari", x: 200, y: 450, label: S },
  { id: "jayanagar", name: "Jayanagar", x: 320, y: 410, label: S },
  { id: "koramangala", name: "Koramangala", x: 440, y: 395, label: E },
  { id: "silkboard", name: "Silk Board", x: 450, y: 475, label: { dx: -8, dy: 20, anchor: "end" } },
  { id: "ecity", name: "Electronic City", x: 560, y: 510, label: E },
];

export const placeById: Record<string, Place> = Object.fromEntries(places.map((p) => [p.id, p]));

const road = (a: string, b: string, kind: RoadKind): Road => ({ id: `${a}--${b}`, a, b, kind });

export const roads: Road[] = [
  road("peenya", "yeshwanthpur", "highway"),
  road("peenya", "rajajinagar", "city"),
  road("yeshwanthpur", "hebbal", "ring"),
  road("yeshwanthpur", "malleshwaram", "city"),
  road("yeshwanthpur", "rajajinagar", "city"),
  road("hebbal", "yelahanka", "highway"),
  road("hebbal", "krpuram", "ring"),
  road("hebbal", "malleshwaram", "city"),
  road("hebbal", "shivajinagar", "city"),
  road("malleshwaram", "majestic", "city"),
  road("rajajinagar", "majestic", "city"),
  road("rajajinagar", "vijayanagar", "city"),
  road("majestic", "shivajinagar", "city"),
  road("majestic", "vijayanagar", "city"),
  road("majestic", "jayanagar", "city"),
  road("shivajinagar", "indiranagar", "city"),
  road("shivajinagar", "koramangala", "city"),
  road("indiranagar", "krpuram", "city"),
  road("indiranagar", "marathahalli", "city"),
  road("indiranagar", "koramangala", "city"),
  road("krpuram", "whitefield", "city"),
  road("krpuram", "marathahalli", "ring"),
  road("marathahalli", "whitefield", "city"),
  road("marathahalli", "silkboard", "ring"),
  road("koramangala", "silkboard", "city"),
  road("koramangala", "jayanagar", "city"),
  road("jayanagar", "banashankari", "city"),
  road("silkboard", "banashankari", "ring"),
  road("silkboard", "ecity", "highway"),
  road("banashankari", "vijayanagar", "ring"),
];

const MINUTES_PER_UNIT = 0.085;
/** Minutes per map unit, by road type. Highways are the fastest any road gets, which keeps the A* estimate honest. */
const PACE: Record<RoadKind, number> = { highway: 0.8, ring: 1, city: 1.3 };
/** Extra delay at rush hour. City streets clog hardest, which is what pushes long trips out onto the ring road. */
const RUSH: Record<RoadKind, number> = { highway: 0.1, ring: 0.25, city: 1.1 };

function distance(a: Place, b: Place) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** The same shape as Corridor's traffic model: time = base × (1 + delay). */
export function roadMinutes(r: Road, rush: boolean): number {
  const base = distance(placeById[r.a], placeById[r.b]) * MINUTES_PER_UNIT * PACE[r.kind];
  return base * (1 + (rush ? RUSH[r.kind] : 0));
}

const adjacency: Record<string, { road: Road; to: string }[]> = Object.fromEntries(places.map((p) => [p.id, []]));
for (const r of roads) {
  adjacency[r.a].push({ road: r, to: r.b });
  adjacency[r.b].push({ road: r, to: r.a });
}

export type Algorithm = "astar" | "dijkstra";

export type RouteResult = {
  /** Place ids from origin to destination, or null when every way in is blocked. */
  path: string[] | null;
  roadIds: string[];
  minutes: number;
  /** Places the search settled, in order. Fewer is better. */
  examined: string[];
};

/**
 * One loop serves both searches. Dijkstra expands whatever is closest to the
 * start; A* adds a straight-line estimate of what is left, so it spends less
 * time looking the wrong way. The estimate never overshoots (it assumes a
 * highway all the way), so both always agree on the fastest route.
 */
export function findRoute(
  to: string,
  blocked: ReadonlySet<string>,
  rush: boolean,
  algorithm: Algorithm
): RouteResult {
  const target = placeById[to];
  const estimate = (id: string) =>
    algorithm === "astar" ? distance(placeById[id], target) * MINUTES_PER_UNIT * PACE.highway : 0;

  const cost = new Map<string, number>([[ORIGIN, 0]]);
  const cameFrom = new Map<string, { place: string; road: string }>();
  const open = new Set<string>([ORIGIN]);
  const settled = new Set<string>();
  const examined: string[] = [];

  while (open.size > 0) {
    let current = "";
    let best = Infinity;
    for (const id of open) {
      const score = cost.get(id)! + estimate(id);
      if (score < best) {
        best = score;
        current = id;
      }
    }

    open.delete(current);
    settled.add(current);
    examined.push(current);
    if (current === to) break;

    for (const { road: r, to: next } of adjacency[current]) {
      if (blocked.has(r.id) || settled.has(next)) continue;
      const candidate = cost.get(current)! + roadMinutes(r, rush);
      if (candidate < (cost.get(next) ?? Infinity)) {
        cost.set(next, candidate);
        cameFrom.set(next, { place: current, road: r.id });
        open.add(next);
      }
    }
  }

  if (!settled.has(to)) return { path: null, roadIds: [], minutes: 0, examined };

  const path = [to];
  const roadIds: string[] = [];
  for (let at = to; at !== ORIGIN; ) {
    const step = cameFrom.get(at)!;
    roadIds.unshift(step.road);
    path.unshift(step.place);
    at = step.place;
  }

  return { path, roadIds, minutes: cost.get(to)!, examined };
}
