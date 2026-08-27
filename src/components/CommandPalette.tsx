import { useEffect, useMemo, useRef, useState } from "react";
import { navSections, profile } from "@/data/resume";
import { scrollToId } from "@/lib/useLenis";

type Command = {
  id: string;
  label: string;
  group: "Navigate" | "Contact" | "Résumé";
  keywords?: string;
  run: () => void;
};

function downloadCv() {
  const a = document.createElement("a");
  a.href = profile.cvPath;
  a.download = "";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const lastFocused = useRef<Element | null>(null);

  const commands = useMemo<Command[]>(
    () => [
      ...navSections.map((s) => ({
        id: `go-${s.id}`,
        label: `Go to ${s.label}`,
        group: "Navigate" as const,
        run: () => scrollToId(s.id),
      })),
      {
        id: "copy-email",
        label: `Copy email — ${profile.email}`,
        group: "Contact",
        keywords: "clipboard",
        run: () => navigator.clipboard?.writeText(profile.email).catch(() => {}),
      },
      {
        id: "email",
        label: "Send me an email",
        group: "Contact",
        keywords: "mailto contact",
        run: () => {
          window.location.href = `mailto:${profile.email}`;
        },
      },
      {
        id: "linkedin",
        label: "Open LinkedIn profile",
        group: "Contact",
        run: () => window.open(profile.linkedin, "_blank", "noopener,noreferrer"),
      },
      {
        id: "github",
        label: "Open GitHub profile",
        group: "Contact",
        run: () => window.open(profile.github, "_blank", "noopener,noreferrer"),
      },
      {
        id: "download-cv",
        label: "Download CV (PDF)",
        group: "Résumé",
        keywords: "resume pdf",
        run: downloadCv,
      },
      {
        id: "print",
        label: "Print this page as a résumé",
        group: "Résumé",
        keywords: "pdf save export ats",
        run: () => window.print(),
      },
      {
        id: "source",
        label: "View this site's source code",
        group: "Résumé",
        keywords: "github repo code open source",
        run: () => window.open(profile.repoUrl, "_blank", "noopener,noreferrer"),
      },
    ],
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (c) => c.label.toLowerCase().includes(q) || c.keywords?.toLowerCase().includes(q)
    );
  }, [commands, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, open]);

  useEffect(() => {
    if (open) {
      lastFocused.current = document.activeElement;
      setQuery("");
      requestAnimationFrame(() => inputRef.current?.focus());
    } else if (lastFocused.current instanceof HTMLElement) {
      lastFocused.current.focus();
    }
  }, [open]);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  if (!open) return null;

  const runCommand = (cmd: Command) => {
    cmd.run();
    onClose();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const cmd = filtered[activeIndex];
      if (cmd) runCommand(cmd);
    }
  };

  let cursor = -1;
  const groups: { name: string; items: { cmd: Command; index: number }[] }[] = [];
  for (const cmd of filtered) {
    cursor += 1;
    const idx = cursor;
    let group = groups.find((g) => g.name === cmd.group);
    if (!group) {
      group = { name: cmd.group, items: [] };
      groups.push(group);
    }
    group.items.push({ cmd, index: idx });
  }

  return (
    <div
      className="command-palette-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="command-palette"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-gold-dim px-5 py-4">
          <span className="font-mono text-gold" aria-hidden="true">
            &gt;
          </span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Jump to a section, or run a command…"
            autoComplete="off"
            spellCheck={false}
            aria-label="Search commands"
            className="flex-1 bg-transparent font-mono text-sm text-bone outline-none placeholder:text-muted"
          />
          <kbd className="hidden shrink-0 rounded border border-gold-dim px-1.5 py-0.5 font-mono text-[10px] text-muted sm:block">
            esc
          </kbd>
        </div>

        <div ref={listRef} className="max-h-[60vh] overflow-y-auto p-2 no-scrollbar">
          {filtered.length === 0 && (
            <p className="px-3 py-6 text-center font-mono text-xs text-muted">No matching command.</p>
          )}
          {groups.map((group) => (
            <div key={group.name} className="mb-2 last:mb-0">
              <p className="px-3 pb-1 pt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-gold/60">
                {group.name}
              </p>
              {group.items.map(({ cmd, index }) => (
                <button
                  key={cmd.id}
                  data-index={index}
                  onClick={() => runCommand(cmd)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`block w-full rounded-lg px-3 py-2.5 text-left font-sans text-sm transition-colors ${
                    index === activeIndex ? "bg-gold-dim/40 text-gold" : "text-bone"
                  }`}
                >
                  {cmd.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
