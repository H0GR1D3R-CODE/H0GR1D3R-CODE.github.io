import { useEffect, useRef, useState, type CSSProperties } from "react";
import { flushSync } from "react-dom";
import { areas, projects, type Area, type Project, type ProjectMedia } from "@/data/resume";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { cn } from "@/lib/cn";
import { ButtonLink } from "./Button";
import { Pause, Play } from "./icons";
import { ProjectPicture } from "./ProjectPicture";

type Filter = Area | "All";

/** Each project keeps a stable name so it can glide to its new position when the filter changes. */
const named = (project: Project, i = 0) => ({ "--vt": `project-${project.id}`, "--i": i }) as CSSProperties;

/**
 * A screenshot, or a recording of the real site. Recordings are about 1 MB
 * each, so only the first frame loads with the page; the recording itself is
 * fetched when it scrolls into view, and never autoplays for visitors who
 * ask for reduced motion. Anything that moves can be paused.
 */
function Media({ media, name, priority = false }: { media: ProjectMedia; name: string; priority?: boolean }) {
  const reduced = usePrefersReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  /** null until the visitor presses the button; after that their choice wins. */
  const [choice, setChoice] = useState<boolean | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = frameRef.current;
    if (!el || !media.recording) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, [media.recording]);

  const playing = Boolean(media.recording) && (choice ?? (inView && !reduced));

  useEffect(() => {
    if (!playing) setLoaded(false);
  }, [playing]);

  return (
    <div
      ref={frameRef}
      className="relative overflow-hidden rounded-2xl border border-line bg-bg-2"
      style={{ aspectRatio: `${media.width} / ${media.height}` }}
    >
      <img
        src={media.still}
        alt={media.alt}
        width={media.width}
        height={media.height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className="size-full object-cover"
      />
      {playing && (
        <img
          src={media.recording}
          alt=""
          aria-hidden="true"
          width={media.width}
          height={media.height}
          onLoad={() => setLoaded(true)}
          className={cn("absolute inset-0 size-full object-cover", loaded ? "opacity-100" : "opacity-0")}
        />
      )}
      {media.recording && (
        <button
          type="button"
          onClick={() => setChoice(!playing)}
          aria-label={playing ? `Pause the ${name} recording` : `Play the ${name} recording`}
          className="absolute bottom-3 right-3 inline-flex h-9 items-center gap-2 rounded-[0.6rem] bg-[#0b1622]/85 pl-3 pr-3.5 text-sm font-semibold text-[#eef4f8] backdrop-blur-sm hover:bg-[#0b1622]"
        >
          {playing ? <Pause width={14} height={14} /> : <Play width={14} height={14} />}
          <span>{playing ? "Pause" : "Play recording"}</span>
        </button>
      )}
    </div>
  );
}

function Meta({ project, tag }: { project: Project; tag?: string }) {
  return (
    <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm font-semibold text-ink-2">
      {tag && <span className="rounded-md bg-straw px-2 py-1 leading-none text-on-straw">{tag}</span>}
      <span>{project.areas.join(" + ")}</span>
      <span aria-hidden="true">·</span>
      <span className="font-mono font-medium">{project.period}</span>
    </p>
  );
}

function Stack({ items }: { items: string[] }) {
  return (
    <p className="flex flex-wrap gap-x-2 text-sm font-medium text-ink-2">
      <span className="sr-only">Built with </span>
      {items.map((item, i) => (
        <span key={item}>
          {item}
          {i < items.length - 1 && (
            <>
              <span className="sr-only">,</span>
              <span aria-hidden="true" className="ml-2">
                ·
              </span>
            </>
          )}
        </span>
      ))}
    </p>
  );
}

function Links({ project, size = "md" }: { project: Project; size?: "md" | "sm" }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {project.live && (
        <ButtonLink href={project.live} external variant="primary" size={size} aria-label={`${project.name} live demo`}>
          Live demo
        </ButtonLink>
      )}
      <ButtonLink href={project.code} external size={size} aria-label={`${project.name} code on GitHub`}>
        Code
      </ButtonLink>
      {project.extra && (
        <ButtonLink href={project.extra.href} external size={size}>
          {project.extra.label}
        </ButtonLink>
      )}
    </div>
  );
}

function Points({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((point) => (
        <li key={point} className="relative pl-5">
          <span className="absolute left-0 top-[0.62em] size-2 rounded-full bg-straw" aria-hidden="true" />
          {point}
        </li>
      ))}
    </ul>
  );
}

/** EcoTrack: the capstone gets the full width. Name and links first, then the recording, then the detail. */
function Capstone({ project }: { project: Project }) {
  return (
    <article className="project" style={named(project)}>
      <div className="rise">
        <Meta project={project} tag="Capstone" />
      </div>
      <div className="rise mt-3 flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
        <div>
          <h3 className="font-display text-4xl font-extrabold tracking-[-0.025em] sm:text-5xl">{project.name}</h3>
          <p className="mt-2 text-xl text-ink-2">{project.tagline}</p>
        </div>
        <Links project={project} />
      </div>
      <div className="lift mt-7">{project.media && <Media media={project.media} name={project.name} priority />}</div>
      <div className="rise mt-7 grid gap-x-12 gap-y-5 lg:grid-cols-12">
        <p className="text-lg lg:col-span-5">{project.description}</p>
        <div className="flex flex-col gap-5 lg:col-span-7">
          {project.points && <Points items={project.points} />}
          <Stack items={project.stack} />
        </div>
      </div>
    </article>
  );
}

/** Corridor: recording beside the write-up. */
function Latest({ project }: { project: Project }) {
  return (
    <article className="project grid items-center gap-x-10 gap-y-6 lg:grid-cols-12" style={named(project)}>
      <div className="slide-from-left lg:col-span-7">
        {project.media && <Media media={project.media} name={project.name} />}
      </div>
      <div className="slide-from-right flex flex-col gap-4 lg:col-span-5">
        <Meta project={project} tag="Latest" />
        <div>
          <h3 className="font-display text-3xl font-extrabold tracking-[-0.025em] sm:text-4xl">{project.name}</h3>
          <p className="mt-1.5 text-lg text-ink-2">{project.tagline}</p>
        </div>
        <p>{project.description}</p>
        {project.points && <Points items={project.points} />}
        <Stack items={project.stack} />
        <Links project={project} />
      </div>
    </article>
  );
}

function Card({ project, column }: { project: Project; column: number }) {
  return (
    <article className="project rise flex h-full flex-col gap-4" style={named(project, column)}>
      {project.media && <Media media={project.media} name={project.name} />}
      <Meta project={project} />
      <div>
        <h3 className="font-display text-2xl font-extrabold tracking-[-0.015em]">{project.name}</h3>
        <p className="mt-1 text-ink-2">{project.tagline}</p>
      </div>
      <p className="flex-1">{project.description}</p>
      <Stack items={project.stack} />
      <Links project={project} size="sm" />
    </article>
  );
}

/** The smaller projects: a window onto the real code, then what it is. */
function MiniCard({ project, i }: { project: Project; i: number }) {
  return (
    <li className="project rise flex flex-col gap-3.5" style={named(project, i % 3)}>
      <ProjectPicture project={project} />
      <Meta project={project} />
      <div>
        <h4 className="font-display text-xl font-extrabold tracking-[-0.015em]">{project.name}</h4>
        <p className="mt-0.5 text-ink-2">{project.tagline}</p>
      </div>
      <p className="flex-1 text-[0.9375rem]">{project.description}</p>
      <Stack items={project.stack} />
      <Links project={project} size="sm" />
    </li>
  );
}

export function Work() {
  const [filter, setFilter] = useState<Filter>("All");

  /** Where the browser supports it, projects glide to their new places instead of jumping. */
  const applyFilter = (next: Filter) => {
    const root = document.documentElement;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!("startViewTransition" in document) || calm) {
      setFilter(next);
      return;
    }
    root.classList.add("filtering");
    const transition = document.startViewTransition(() => flushSync(() => setFilter(next)));
    transition.finished.finally(() => root.classList.remove("filtering"));
  };

  const matches = (p: Project) => filter === "All" || p.areas.includes(filter);
  const visible = projects.filter(matches);
  const tier = (t: Project["tier"]) => visible.filter((p) => p.tier === t);

  const capstone = tier("capstone");
  const latest = tier("latest");
  const featured = tier("featured");
  const more = tier("more");
  const liveCount = projects.filter((p) => p.live).length;
  const options: Filter[] = ["All", ...areas];

  return (
    <section id="work" aria-labelledby="work-title" className="py-16 sm:py-24">
      <div className="mx-auto max-w-[76rem] px-4 sm:px-8">
        <div className="rise flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <div>
            <h2 id="work-title" className="title">
              Work
            </h2>
            <p className="mt-3 max-w-xl text-lg text-ink-2">
              {projects.length} projects. {liveCount} have a live demo you can open right now; the rest show their
              code and link to a README that says how to run them.
            </p>
          </div>

          <div role="group" aria-label="Filter projects by area" className="flex flex-wrap gap-2">
            {options.map((option) => {
              const count = option === "All" ? projects.length : projects.filter((p) => p.areas.includes(option)).length;
              const active = filter === option;
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={active}
                  onClick={() => applyFilter(option)}
                  className={cn(
                    "press inline-flex h-10 items-center gap-2 rounded-[0.6rem] border-[1.5px] px-3.5 text-sm font-semibold",
                    active ? "border-ink bg-ink text-bg" : "border-edge text-ink hover:border-ink hover:bg-bg-2"
                  )}
                >
                  <span>{option}</span>
                  <span className={cn("font-mono text-xs font-medium", active ? "text-bg" : "text-ink-2")}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <p className="sr-only" aria-live="polite">
          Showing {visible.length} of {projects.length} projects.
        </p>

        <div className="mt-12 flex flex-col gap-16 sm:gap-20">
          {capstone.map((p) => (
            <Capstone key={p.id} project={p} />
          ))}

          {latest.map((p) => (
            <Latest key={p.id} project={p} />
          ))}

          {featured.length > 0 && (
            <div className="grid gap-x-10 gap-y-14 sm:grid-cols-2">
              {featured.map((p, i) => (
                <div key={p.id} className={i % 2 === 0 ? "drift-slow" : "drift-fast"}>
                  <Card project={p} column={i % 2} />
                </div>
              ))}
            </div>
          )}

          {more.length > 0 && (
            <div>
              <h3 className="rise font-display text-2xl font-extrabold tracking-[-0.015em]">
                {more.length === visible.length ? "Projects" : "Also built"}
              </h3>
              <ul className="mt-6 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {more.map((p, i) => (
                  <MiniCard key={p.id} project={p} i={i} />
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
