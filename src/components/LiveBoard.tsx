import { liveProjects, statusText, type LiveStatus } from "@/lib/livePing";
import { cn } from "@/lib/cn";
import { ArrowOut } from "./icons";

type LiveBoardProps = {
  status: Record<string, LiveStatus>;
  /** The project currently in the front window of the showcase. */
  active: string;
  /** Called when a row is hovered or focused, so the showcase can bring that project forward. */
  onPreview: (id: string) => void;
};

/** The hero's proof: every live demo, with how fast it just answered. Each row opens the real thing. */
export function LiveBoard({ status, active, onPreview }: LiveBoardProps) {
  const up = Object.values(status).filter((s) => s.state === "up").length;
  const settled = Object.keys(status).length === liveProjects.length;
  const summary =
    up > 0
      ? `${up} of ${liveProjects.length} answered your browser just now`
      : settled
        ? "each one opens the real thing"
        : "checking from your browser";

  return (
    <div>
      <p className="flex flex-wrap items-baseline gap-x-3 text-sm font-semibold text-ink-2">
        <span className="text-ink">Live demos</span>
        <span className="font-normal" aria-live="polite">
          {summary}
        </span>
      </p>

      <ul className="mt-2.5 border-b border-line">
        {liveProjects.map((p) => {
          const s = status[p.id];
          return (
            <li key={p.id}>
              <a
                href={p.live}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`${p.name} live demo, ${statusText(s)}`}
                onPointerEnter={(e) => e.pointerType !== "touch" && onPreview(p.id)}
                onFocus={() => onPreview(p.id)}
                className={cn(
                  "live-row group grid min-h-10 grid-cols-[auto_auto_1fr_auto] items-center gap-x-3 border-t border-line py-2",
                  p.id === active && "is-active"
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "size-2.5 rounded-full border-[1.5px]",
                    s?.state === "up" ? "border-straw bg-straw" : "border-edge",
                    !s && "live-checking"
                  )}
                />
                <span className="font-display text-lg font-extrabold leading-none tracking-[-0.015em]">{p.name}</span>
                <span className="truncate text-sm text-ink-2 max-sm:hidden">{p.tagline}</span>
                <span className="flex items-center gap-2 justify-self-end font-mono text-xs text-ink-2 max-sm:col-start-4">
                  {statusText(s)}
                  <ArrowOut
                    width={14}
                    height={14}
                    className="text-ink transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
                  />
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
