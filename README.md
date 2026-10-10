# Nebin Stanly — Portfolio

A single-page portfolio: Vite, React 19, TypeScript and Tailwind v4. Live at [h0gr1d3r-code.github.io](https://h0gr1d3r-code.github.io/).

The look comes from the GitHub profile: a panda in a straw hat in the snow. The page opens as a "snow day" and the toggle switches to a "snowy night"; the hero is always the night scene.

## Develop

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

## Content

All copy lives in one place: [`src/data/resume.ts`](src/data/resume.ts). Edit it there; components only lay it out.

- Experience, education, certifications, skills, leadership and awards come from the résumé PDF.
- Project descriptions and every project number come from each repo's README.
- The timeline is derived from those lists and sorted newest first, so there is nothing to keep in sync by hand.

When the résumé changes, update `resume.ts` and replace `public/Nebin-Stanly-CV.pdf`.

Screenshots and recordings are in `public/shots/`. A recording is an animated WebP plus a `-poster.webp` first frame; only the poster loads with the page.

### Adding a live project

A project with a `live` URL and a `media` entry appears in the hero's deck automatically. Two optional fields control how:

- `ping`: a small static file on the live host (an icon or stylesheet). The page fetches it to show the demo is up and how fast it answered. Browsers refuse to let one site fetch another site's HTML, so this must not be the page itself.
- `runsInPage`: set to `true` only if the site allows being embedded (no `X-Frame-Options: DENY` and no restrictive `frame-ancestors`). The deck then offers "Run it right here". EcoTrack refuses embedding on purpose, so it plays its recording instead.

## The hero

- [`Loader.tsx`](src/components/Loader.tsx): the loading screen pings every live demo and lists each one as it answers. It shows once per visit and never for reduced motion. `index.html` carries a static copy so it paints before any script runs.
- [`Showcase.tsx`](src/components/Showcase.tsx): the deck of project windows. The front one can run the real site inside the page.
- [`LiveBoard.tsx`](src/components/LiveBoard.tsx): the list of live demos with their reply times. Hovering a row brings its window forward.
- [`livePing.ts`](src/lib/livePing.ts): the one-per-page-load ping they all share.

## Motion

Scroll-linked motion uses CSS scroll-driven animations (`animation-timeline`), so it is tied to scroll position rather than time. Browsers without support show the same content in place. Wheel scrolling is eased with [Lenis](https://github.com/darkroomengineering/lenis); touch devices keep their native momentum.

Everything that moves is inside a `prefers-reduced-motion: no-preference` block in [`src/styles/globals.css`](src/styles/globals.css). With reduced motion there is no loading screen, the page is complete and still, the deck waits to be clicked, and recordings wait for a Play button.

## Build

```bash
npm run build
npm run preview   # serve the production build locally
```

## Deploy

`.github/workflows/deploy.yml` builds and deploys to GitHub Pages on every push to `main`. The repository's Pages source must be set to **GitHub Actions** (Settings → Pages).
