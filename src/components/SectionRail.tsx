import { navSections } from "@/data/resume";
import { useActiveSection } from "@/lib/useActiveSection";
import { scrollToId } from "@/lib/useLenis";
import { cn } from "@/lib/cn";

const ids = navSections.map((s) => s.id);

/** Fixed right-edge scroll progress rail — dots with the active section's label revealed on hover/active. */
export function SectionRail() {
  const active = useActiveSection(ids);

  return (
    <div className="hidden xl:flex fixed right-8 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-4">
      {navSections.map((s) => {
        const isActive = active === s.id;
        return (
          <button
            key={s.id}
            onClick={() => scrollToId(s.id)}
            className="group flex items-center gap-3"
            aria-label={`Jump to ${s.label}`}
            aria-current={isActive}
          >
            <span
              className={cn(
                "font-mono text-[10px] uppercase tracking-[0.15em] opacity-0 -translate-x-1 transition-all duration-300",
                "group-hover:opacity-100 group-hover:translate-x-0",
                isActive && "opacity-100 translate-x-0 text-gold"
              )}
            >
              {s.label}
            </span>
            <span
              className={cn(
                "block rounded-full transition-all duration-300",
                isActive ? "h-2.5 w-2.5 bg-gold" : "h-1.5 w-1.5 bg-gold-dim group-hover:bg-gold/60"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
