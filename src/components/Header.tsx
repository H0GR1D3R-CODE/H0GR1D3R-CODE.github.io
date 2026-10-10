import { nav, profile } from "@/data/resume";
import type { Theme } from "@/lib/useTheme";
import { ButtonLink } from "./Button";
import { PandaMark } from "./Panda";
import { Download, SnowDay, SnowNight } from "./icons";

type HeaderProps = {
  theme: Theme;
  onToggleTheme: (origin?: { x: number; y: number }) => void;
};

export function Header({ theme, onToggleTheme }: HeaderProps) {
  const night = theme === "night";

  return (
    <header className="site-header sticky top-0 z-40">
      <div className="mx-auto flex h-16 max-w-[76rem] items-center gap-2 px-4 sm:gap-6 sm:px-8">
        <a href="#top" className="flex h-10 shrink-0 items-center gap-2.5 rounded-lg" aria-label={`${profile.name}, back to top`}>
          <PandaMark className="h-8 w-auto" />
          <span className="hidden font-display text-lg font-extrabold tracking-[-0.015em] min-[560px]:inline">
            {profile.name}
          </span>
        </a>

        <nav aria-label="Sections" className="ml-auto min-w-0">
          <ul className="flex items-center sm:gap-1">
            {nav.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="inline-flex h-10 items-center rounded-[0.6rem] px-2 text-[0.875rem] font-semibold text-ink-2 hover:bg-bg-2 hover:text-ink min-[400px]:px-2.5 sm:px-3.5 sm:text-[0.9375rem]"
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
          className="press flex size-10 shrink-0 items-center justify-center rounded-[0.6rem] border-[1.5px] border-edge text-ink hover:border-ink hover:bg-bg-2"
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
