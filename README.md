# Nebin Stanly — Portfolio

A single-page portfolio: Vite, React 19, TypeScript and Tailwind v4, with no animation or 3D libraries. Live at [h0gr1d3r-code.github.io](https://h0gr1d3r-code.github.io/).

The look comes from the GitHub profile: a panda in a straw hat in the snow. It opens as a "snow day" and the toggle switches to a "snowy night".

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

## The map in the hero

The hero is a small cut of [Corridor](https://github.com/H0GR1D3R-CODE/corridor-routing-atlas): a schematic of 18 places and 30 roads in Bengaluru. Pick a place and A* draws the fastest route from Yeshwanthpur; pick a road and it gets snowed in, so the route goes around it.

- [`src/lib/route.ts`](src/lib/route.ts) holds the places, the roads, the travel-time model and both searches (A* and Dijkstra, which the readout compares).
- [`src/components/RouteMap.tsx`](src/components/RouteMap.tsx) draws it and handles pointer, touch and keyboard input.

Positions are approximate and travel times are modelled, not measured.

## Motion

Scroll-linked motion uses CSS scroll-driven animations (`animation-timeline`), so it is tied to scroll position rather than time and needs no script. Browsers without support show the same content in place. Everything that moves is inside a `prefers-reduced-motion: no-preference` block in [`src/styles/globals.css`](src/styles/globals.css): with reduced motion the page is complete and still, recordings wait for a Play button, and the map still works.

## Build

```bash
npm run build
npm run preview   # serve the production build locally
```

## Deploy

`.github/workflows/deploy.yml` builds and deploys to GitHub Pages on every push to `main`. The repository's Pages source must be set to **GitHub Actions** (Settings → Pages).
