import { useEffect, useState } from "react";
import { projects, type Project } from "@/data/resume";

export type LiveStatus = { state: "up"; ms: number } | { state: "unknown" };

/** The projects that are deployed somewhere a visitor can open right now. */
export const liveProjects = projects.filter((p) => p.live);

const TIMEOUT_MS = 8000;

/** One ping per demo per page load, however many components ask. */
const pings = new Map<string, Promise<LiveStatus>>();

/**
 * Checks a live demo from the visitor's own browser and times the reply. It
 * fetches the project's small static `ping` file rather than the page itself,
 * and the request is opaque (no-cors), so nothing is read from the response:
 * it either arrives or it doesn't. A demo that can't be reached is never
 * called "up"; it just stays a plain link.
 */
export function ping(project: Project): Promise<LiveStatus> {
  const url = project.ping ?? project.live!;
  const known = pings.get(url);
  if (known) return known;

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
  const t0 = performance.now();
  const result = fetch(url, { mode: "no-cors", cache: "no-store", signal: controller.signal })
    .then((): LiveStatus => ({ state: "up", ms: Math.round(performance.now() - t0) }))
    .catch((): LiveStatus => ({ state: "unknown" }))
    .finally(() => window.clearTimeout(timer));
  pings.set(url, result);
  return result;
}

/** Status of every live demo, keyed by project id. Empty until `enabled`, then fills in as replies arrive. */
export function useLiveStatus(enabled: boolean) {
  const [status, setStatus] = useState<Record<string, LiveStatus>>({});

  useEffect(() => {
    if (!enabled) return;
    let current = true;
    for (const p of liveProjects) {
      ping(p).then((s) => current && setStatus((all) => ({ ...all, [p.id]: s })));
    }
    return () => {
      current = false;
    };
  }, [enabled]);

  return status;
}

export function statusText(status: LiveStatus | undefined) {
  if (!status) return "checking";
  if (status.state === "up") return `replied in ${status.ms} ms`;
  // Unreachable from here, or the browser would not allow the check. Either way, make no claim.
  return "open demo";
}
