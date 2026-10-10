/**
 * The site's mark: the letter N drawn as a route through four junctions,
 * from an ink start to a straw finish. It is the initial, and it is also
 * what most of the work here is about: getting from one point to another
 * through a graph.
 */
export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      <path
        d="M8 24V8l16 16V8"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="24" r="3.6" fill="currentColor" />
      <circle cx="24" cy="8" r="4.4" fill="var(--straw)" stroke="var(--bg)" strokeWidth="1.6" />
    </svg>
  );
}
