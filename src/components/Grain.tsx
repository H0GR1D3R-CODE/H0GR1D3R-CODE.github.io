/** Static SVG-turbulence film grain, layered above the page, CSS-animated only (no canvas loop). */
export function Grain() {
  return (
    <>
      <svg className="grain-overlay" aria-hidden="true">
        <filter id="grain-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-filter)" />
      </svg>
      <div className="vignette-overlay" aria-hidden="true" />
    </>
  );
}
