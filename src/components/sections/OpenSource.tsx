import { useEffect, useRef, useState } from "react";
import { useReveal } from "@/lib/useReveal";
import { useGithubStats } from "@/lib/useGithubStats";
import { useCountUp } from "@/lib/useCountUp";
import { RevealText } from "../ui/RevealText";
import { SectionHeading } from "../ui/SectionHeading";
import { MagneticLink } from "../ui/MagneticLink";
import { profile } from "@/data/resume";

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

export function OpenSource() {
  const ref = useReveal<HTMLDivElement>({ stagger: 0.08 });
  const stats = useGithubStats(profile.githubUsername);

  return (
    <section id="opensource" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <SectionHeading index="07" eyebrow="Open Source" title="Code, in the open." />

        <div ref={ref} className="mt-16">
          <RevealText as="p" className="max-w-2xl text-lg text-muted leading-relaxed mb-10">
            Live from{" "}
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer noopener"
              className="text-gold hover:text-gold-lite transition-colors"
            >
              {profile.githubLabel}
            </a>{" "}
            — pulled straight from the GitHub API, not typed in by hand.
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
