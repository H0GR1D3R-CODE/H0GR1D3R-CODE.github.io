import type { ReactNode } from "react";
import type { Project, ProjectEvidence } from "@/data/resume";
import { cn } from "@/lib/cn";

const KEYWORDS =
  "const|let|var|function|return|if|else|async|await|try|catch|throw|new|def|class|import|from|public|private|static|final|interface|suspend|fun|val|double|long|void|self|None|null|true|false|and|or|not|in|for|while";

/** Just enough colouring to read as code: comments, strings, annotations and keywords. */
function colour(line: string, lang: ProjectEvidence["lang"]): ReactNode[] {
  const comment = lang === "py" ? "#.*$" : "\\/\\/.*$|^\\s*\\/?\\*.*$";
  const pattern = new RegExp(
    `(${comment})|("""(?:.|\\n)*?"""|"(?:[^"\\\\]|\\\\.)*"|'(?:[^'\\\\]|\\\\.)*')|(@\\w+)|\\b(${KEYWORDS})\\b`,
    "g"
  );
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of line.matchAll(pattern)) {
    if (m.index > last) out.push(line.slice(last, m.index));
    const cls = m[1] ? "tok-comment" : m[2] ? "tok-string" : m[3] ? "tok-note" : "tok-keyword";
    out.push(
      <span key={m.index} className={cls}>
        {m[0]}
      </span>
    );
    last = m.index + m[0].length;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}

/**
 * A window onto the project's real source: lines copied verbatim from one
 * file in its repository. It stands in for a screenshot on projects that
 * have no interface to photograph, and links to the same lines on GitHub.
 */
export function CodeWindow({ project, compact = false }: { project: Project; compact?: boolean }) {
  const evidence = project.evidence!;
  const indent = Math.min(...evidence.code.filter((l) => l.trim()).map((l) => l.length - l.trimStart().length));
  const lines = compact ? evidence.code.slice(0, 7) : evidence.code;
  const lastLine = evidence.line + evidence.code.length - 1;
  const file = evidence.path.split("/").pop();

  return (
    <figure data-theme="night" className="code-window overflow-hidden rounded-2xl border border-line bg-card text-ink">
      <div className="flex h-9 items-center justify-between gap-3 border-b border-line px-3.5 font-mono text-[0.6875rem] text-ink-2">
        <span className="truncate">{compact ? file : evidence.path}</span>
        <span className="shrink-0">{evidence.files} files</span>
      </div>
      <pre aria-hidden="true" className={cn("code-lines overflow-hidden font-mono leading-[1.6]", compact ? "p-3 text-[0.625rem]" : "p-3.5 text-[0.6875rem]")}>
        {lines.map((line, i) => (
          <span key={i} className="block whitespace-pre">
            <span className="mr-3 inline-block w-5 select-none text-right text-edge">{evidence.line + i}</span>
            {colour(line.slice(indent), evidence.lang)}
          </span>
        ))}
      </pre>
      {!compact && (
        <figcaption className="border-t border-line px-3.5 py-2 text-xs text-ink-2">
          <a
            href={`${project.code}/blob/HEAD/${evidence.path}#L${evidence.line}-L${lastLine}`}
            target="_blank"
            rel="noreferrer noopener"
            className="link inline-flex min-h-6 items-center text-ink"
            aria-label={`${project.name}: lines ${evidence.line} to ${lastLine} of ${evidence.path} on GitHub`}
          >
            Lines {evidence.line}–{lastLine}, as they are on GitHub
          </a>
        </figcaption>
      )}
    </figure>
  );
}

/** Something to look at for any project: its screenshot if it has one, otherwise a window onto its code. */
export function ProjectPicture({ project, compact = false }: { project: Project; compact?: boolean }) {
  if (project.media) {
    return (
      <img
        src={project.media.still}
        alt={project.media.alt}
        width={project.media.width}
        height={project.media.height}
        loading="lazy"
        decoding="async"
        className="aspect-video w-full rounded-2xl border border-line object-cover object-left-top"
      />
    );
  }
  if (project.evidence) return <CodeWindow project={project} compact={compact} />;
  return null;
}
