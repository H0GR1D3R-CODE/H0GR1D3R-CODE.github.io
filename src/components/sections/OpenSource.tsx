import { useEffect, useRef, useState } from "react";
import { useReveal } from "@/lib/useReveal";
import { useGithubStats } from "@/lib/useGithubStats";
import { useCountUp } from "@/lib/useCountUp";
import { RevealText } from "../ui/RevealText";
import { SectionHeading } from "../ui/SectionHeading";
import { MagneticLink } from "../ui/MagneticLink";
import { profile, repos, repoCategories, type Repo, type RepoCategory } from "@/data/resume";
import { cn } from "@/lib/cn";

function StatTile({ label, value }: { label: string; value: number }) {
  const ref = useCountUp<HTMLSpanElement>(value);
  return (
    <div className="rounded-2xl border border-gold-dim p-6 text-center">
      <p className="font-display text-4xl sm:text-5xl text-gold">
        <span ref={ref}>0</span>
      </p>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">{label}</p>
    </div>
  );
}

function StatTileSkeleton({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-gold-dim p-6 text-center">
      <p className="font-display text-4xl sm:text-5xl text-gold/30 animate-pulse">—</p>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">{label}</p>
    </div>
  );
}

function ContributionChart({ username }: { username: string }) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    // ghchart occasionally responds 200 with an empty/error SVG for brand-new
    // accounts — a naked <img onError> alone won't catch that, so we also
    // bound the load with a timeout and swap to the fallback if it never fires.
    const id = setTimeout(() => {
      if (!imgRef.current?.complete) setFailed(true);
    }, 6000);
    return () => clearTimeout(id);
  }, []);

  if (failed) return null;

  return (
    <div className="mt-6 overflow-x-auto rounded-2xl border border-gold-dim p-6 no-scrollbar">
      <img
        ref={imgRef}
        src={`https://ghchart.rshah.org/c8a24c/${username}`}
        alt={`${username}'s GitHub contribution graph`}
        className="min-w-[640px] w-full"
        loading="lazy"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

const LANGUAGE_COLOR: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572a5",
  Java: "#b07219",
  Kotlin: "#a97bff",
};

function RepoCard({ repo }: { repo: Repo }) {
  return (
    <article className="group relative flex h-full flex-col rounded-2xl border border-gold-dim bg-ink-2/50 p-6 transition-colors duration-300 hover:border-gold/60">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="break-all font-mono text-sm text-bone transition-colors group-hover:text-gold">
          <a
            href={repo.href}
            target="_blank"
            rel="noreferrer noopener"
            className="after:absolute after:inset-0 after:content-['']"
          >
            {repo.name}
          </a>
        </h3>
        {repo.featured && (
          <span className="shrink-0 rounded-full border border-gold-dim px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] text-gold">
            Featured
          </span>
        )}
      </div>

      <p className="mb-5 flex-1 text-sm leading-relaxed text-muted">{repo.description}</p>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: LANGUAGE_COLOR[repo.language] ?? "var(--color-gold)" }}
            aria-hidden="true"
          />
          {repo.language}
        </span>
        <span>{repo.date}</span>
        {repo.live && (
          <a
            href={repo.live}
            target="_blank"
            rel="noreferrer noopener"
            className="relative z-10 ml-auto text-gold transition-colors hover:text-gold-lite"
          >
            Live ↗
          </a>
        )}
      </div>
    </article>
  );
}

function RepoArchive() {
  const [filter, setFilter] = useState<RepoCategory | "All">("All");
  const visible = filter === "All" ? repos : repos.filter((r) => r.category === filter);
  const options: (RepoCategory | "All")[] = ["All", ...repoCategories];

  return (
    <div className="mb-20">
      <div role="group" aria-label="Filter repositories" className="mb-8 flex flex-wrap gap-2">
        {options.map((opt) => {
          const count = opt === "All" ? repos.length : repos.filter((r) => r.category === opt).length;
          const active = filter === opt;
          return (
            <button
              key={opt}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(opt)}
              className={cn(
                "rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors",
                active
                  ? "border-gold bg-gold text-ink"
                  : "border-gold-dim text-muted hover:border-gold hover:text-gold"
              )}
            >
              {opt} <span className={active ? "text-ink/70" : "text-gold/70"}>{count}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((repo) => (
          <RepoCard key={repo.name} repo={repo} />
        ))}
      </div>
    </div>
  );
}

export function OpenSource() {
  const ref = useReveal<HTMLDivElement>({ stagger: 0.08 });
  const stats = useGithubStats(profile.githubUsername);

  return (
    <section id="opensource" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <SectionHeading index="07" eyebrow="Open Source" title="Code, in the open." />

        <div ref={ref} className="mt-16">
          <RevealText as="p" className="max-w-2xl text-lg text-muted leading-relaxed mb-12">
            Everything I've pushed — coursework, experiments and the projects above — at{" "}
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer noopener"
              className="text-gold hover:text-gold-lite transition-colors"
            >
              {profile.githubLabel}
            </a>
            . The profile stats below come straight from the GitHub API.
          </RevealText>

          <RevealText as="div">
            <RepoArchive />
          </RevealText>

          <RevealText as="div" className="grid grid-cols-3 gap-4 sm:gap-6 max-w-xl">
            {stats.status === "ready" ? (
              <>
                <StatTile label="Public Repos" value={stats.data.publicRepos} />
                <StatTile label="Followers" value={stats.data.followers} />
                <StatTile label="Following" value={stats.data.following} />
              </>
            ) : (
              <>
                <StatTileSkeleton label="Public Repos" />
                <StatTileSkeleton label="Followers" />
                <StatTileSkeleton label="Following" />
              </>
            )}
          </RevealText>

          <RevealText as="div">
            <ContributionChart username={profile.githubUsername} />
          </RevealText>

          <RevealText as="div" className="mt-10">
            <MagneticLink href={profile.github} target="_blank" rel="noreferrer noopener" variant="outline">
              Visit GitHub Profile
            </MagneticLink>
          </RevealText>
        </div>
      </div>
    </section>
  );
}
