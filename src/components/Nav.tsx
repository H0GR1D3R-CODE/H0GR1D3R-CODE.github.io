import { useState } from "react";
import { navSections, profile } from "@/data/resume";
import { useActiveSection } from "@/lib/useActiveSection";
import { scrollToId } from "@/lib/useLenis";
import { cn } from "@/lib/cn";

const ids = navSections.map((s) => s.id);

export function Nav() {
  const active = useActiveSection(ids);
  const [open, setOpen] = useState(false);

  const scrollTo = (id: string) => {
    scrollToId(id);
    setOpen(false);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 sm:px-10 py-5">
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            scrollTo("hero");
          }}
          className="font-display text-lg tracking-wide text-bone hover:text-gold transition-colors"
        >
          {profile.initials}
        </a>

        <nav className="hidden lg:flex items-center gap-7 rounded-full border border-gold-dim bg-ink/60 backdrop-blur-md px-7 py-3">
          {navSections.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className={cn(
                "font-mono text-[11px] uppercase tracking-[0.15em] transition-colors",
                active === s.id ? "text-gold" : "text-muted hover:text-bone"
              )}
            >
              {s.label}
            </button>
          ))}
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle navigation menu"
          className="lg:hidden flex flex-col gap-1.5 rounded-full border border-gold-dim bg-ink/60 backdrop-blur-md p-3"
        >
          <span className={cn("block h-px w-5 bg-bone transition-transform", open && "translate-y-[3px] rotate-45")} />
          <span className={cn("block h-px w-5 bg-bone transition-transform", open && "-translate-y-[3px] -rotate-45")} />
        </button>
      </div>

      {open && (
        <nav className="lg:hidden mx-6 mb-4 rounded-2xl border border-gold-dim bg-ink-2/95 backdrop-blur-md px-6 py-5 flex flex-col gap-4">
          {navSections.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className={cn(
                "text-left font-mono text-xs uppercase tracking-[0.15em] transition-colors",
                active === s.id ? "text-gold" : "text-muted hover:text-bone"
              )}
            >
              {s.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
