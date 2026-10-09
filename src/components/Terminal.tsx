import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  profile,
  summary,
  skills,
  projects,
  experience,
  certifications,
  focusAreas,
  repos,
} from "@/data/resume";

type Line = { kind: "in" | "out"; text: string };

const PROMPT = "guest@nebin-stanly:~$";

function buildResponse(raw: string): string[] {
  const cmd = raw.trim().toLowerCase();

  switch (cmd) {
    case "":
      return [];
    case "help":
      return [
        "Available commands:",
        "  about        — who this is",
        "  skills       — technical toolkit",
        "  projects     — things that got built",
        "  repos        — everything on GitHub",
        "  live         — projects with a live demo",
        "  experience   — where it's been applied",
        "  certs        — certifications on file",
        "  focus        — domains currently worked in",
        "  contact      — how to reach me",
        "  whoami",
        "  sudo hire-me",
        "  clear",
      ];
    case "about":
      return [summary];
    case "whoami":
      return [`${profile.name} — ${profile.role}`, profile.university];
    case "skills":
      return skills.map((g) => `${g.label.padEnd(14)}: ${g.items.join(", ")}`);
    case "projects":
      return projects.map((p) => `[${p.index}] ${p.title} — ${p.tech.join(" / ")}`);
    case "repos":
    case "github":
      return [
        `${repos.length} repositories at ${profile.githubLabel}`,
        ...repos.map((r) => `  ${r.name.padEnd(28)} ${r.language}`),
      ];
    case "live":
      return repos.filter((r) => r.live).map((r) => `${r.name.padEnd(28)} ${r.live}`);
    case "experience":
      return experience.map((e) => `${e.role} @ ${e.org} (${e.start} – ${e.end})`);
    case "certs":
    case "certifications":
      return certifications.map((c) => `${c.name} — ${c.issuer}, ${c.date}`);
    case "focus":
      return [focusAreas.join(" · ")];
    case "contact":
      return [`email  ${profile.email}`, `phone  ${profile.phone}`, `github ${profile.githubLabel}`];
    case "sudo hire-me":
    case "sudo hire nebin":
      return ["Permission granted. Redirecting to the contact form below…", "[scroll down, it's right there]"];
    case "ls":
      return ["about  skills  projects  repos  live  experience  certs  focus  contact"];
    case "clear":
      return ["__CLEAR__"];
    default:
      return [`command not found: ${cmd} — type 'help' to see what's available`];
  }
}

export function Terminal() {
  const [lines, setLines] = useState<Line[]>([
    { kind: "out", text: `${profile.name} — interactive shell. Type 'help' to get started.` },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const value = input;
    const response = buildResponse(value);

    if (response[0] === "__CLEAR__") {
      setLines([]);
    } else {
      setLines((prev) => [
        ...prev,
        { kind: "in", text: value },
        ...response.map((text): Line => ({ kind: "out", text })),
      ]);
    }
    setInput("");
  };

  return (
    <div
      className="rounded-2xl border border-gold-dim bg-ink-2/80 backdrop-blur-sm overflow-hidden"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex items-center gap-2 border-b border-gold-dim px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-gold-dim" />
        <span className="h-2.5 w-2.5 rounded-full bg-gold-dim" />
        <span className="h-2.5 w-2.5 rounded-full bg-gold-dim" />
        <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
          nebin@portfolio — zsh
        </span>
      </div>

      <div
        ref={scrollRef}
        className="h-64 overflow-y-auto px-4 py-4 font-mono text-xs leading-relaxed no-scrollbar"
        aria-live="polite"
      >
        {lines.map((line, i) => (
          <div key={i} className={line.kind === "in" ? "text-bone" : "text-muted whitespace-pre-wrap"}>
            {line.kind === "in" ? (
              <>
                <span className="text-gold">{PROMPT}</span> {line.text}
              </>
            ) : (
              line.text
            )}
          </div>
        ))}
      </div>

      <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-gold-dim px-4 py-3">
        <label htmlFor="terminal-input" className="font-mono text-xs text-gold shrink-0">
          {PROMPT}
        </label>
        <input
          ref={inputRef}
          id="terminal-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoComplete="off"
          spellCheck={false}
          aria-label="Terminal command input"
          className="flex-1 bg-transparent font-mono text-xs text-bone outline-none terminal-caret"
          placeholder="type 'help'"
        />
      </form>
    </div>
  );
}
