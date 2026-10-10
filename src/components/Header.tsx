import { useEffect, useRef, useState } from "react";
import { nav, profile } from "@/data/resume";
import { useActiveSection } from "@/lib/useActiveSection";
import type { Theme } from "@/lib/useTheme";
import { cn } from "@/lib/cn";
import { ButtonLink } from "./Button";
import { Mark } from "./Logo";
import { Download, SnowDay, SnowNight } from "./icons";

type HeaderProps = {
  theme: Theme;
  onToggleTheme: (origin?: { x: number; y: number }) => void;
};

const sectionIds = nav.map((item) => item.id);

/**
 * A floating bar. A highlight slides to whichever section is being read,
 * and the straw line along the bottom edge is how far down the page you
 * are (see `.site-bar` in globals.css).
 */
export function Header({ theme, onToggleTheme }: HeaderProps) {
  const night = theme === "night";
  const active = useActiveSection(sectionIds);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [spot, setSpot] = useState<{ left: number; width: number } | null>(null);

  // Park the highlight under the active link, and keep it there when the bar reflows.
  useEffect(() => {
    const place = () => {
      const el = active ? linkRefs.current[active] : null;
      setSpot(el ? { left: el.offsetLeft, width: el.offsetWidth } : null);
    };
    place();
    window.addEventListener("resize", place);
    document.fonts?.ready.then(place);
    return () => window.removeEventListener("resize", place);
  }, [active]);

  return (
    <header className="site-header pointer-events-none sticky top-0 z-40 h-[4.5rem] px-2.5 pt-2.5 sm:px-5 sm:pt-3">
      <div className="site-bar pointer-events-auto relative mx-auto flex h-14 max-w-[78rem] items-center gap-1.5 rounded-2xl border pl-3 pr-2 sm:gap-4 sm:pl-4 sm:pr-2.5">
        <a href="#top" className="flex h-10 shrink-0 items-center gap-2.5 rounded-lg" aria-label={`${profile.name}, back to top`}>
          <Mark className="size-7" />
          <span className="hidden font-display text-lg font-extrabold tracking-[-0.015em] min-[600px]:inline">
            {profile.name}
          </span>
        </a>

        <nav aria-label="Sections" className="ml-auto min-w-0">
          <ul className="relative flex items-center">
            <li aria-hidden="true" className="contents">
              <span
                className={cn("nav-spot", spot ? "opacity-100" : "opacity-0")}
                style={spot ? { transform: `translateX(${spot.left}px)`, width: spot.width } : undefined}
              />
            </li>
            {nav.map((item) => (
              <li key={item.id}>
                <a
                  ref={(el) => {
                    linkRefs.current[item.id] = el;
                  }}
                  href={`#${item.id}`}
                  aria-current={active === item.id ? "location" : undefined}
                  className={cn(
                    "relative inline-flex h-10 items-center rounded-[0.7rem] px-2 text-[0.8125rem] font-semibold min-[400px]:px-2.5 min-[400px]:text-[0.875rem] sm:px-4 sm:text-[0.9375rem]",
                    active === item.id ? "text-ink" : "text-ink-2 hover:text-ink"
                  )}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            onToggleTheme({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
          }}
          aria-label={night ? "Switch to snow day theme" : "Switch to snowy night theme"}
          title={night ? "Snow day" : "Snowy night"}
          className="press flex size-10 shrink-0 items-center justify-center rounded-[0.7rem] border-[1.5px] border-edge text-ink hover:border-ink hover:bg-bg-2"
        >
          {night ? <SnowDay width={18} height={18} /> : <SnowNight width={18} height={18} />}
        </button>

        <div className="hidden shrink-0 md:block">
          <ButtonLink href={profile.cvPath} download variant="primary" size="sm" icon={<Download />}>
            CV
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
