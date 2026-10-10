# Nebin Stanly — Portfolio

A single-page portfolio: Vite, React 19, TypeScript and Tailwind v4. Live at [h0gr1d3r-code.github.io](https://h0gr1d3r-code.github.io/).

The look comes from the GitHub profile: a panda in a straw hat in the snow. The page opens as a "snowy night" and the toggle switches to a "snow day"; the hero is always the night scene.

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

- [`Loader.tsx`](src/components/Loader.tsx): the opening screen. The mark draws itself as a route, the name rises in, and the screen opens outwards from the mark's destination dot. It plays on every load, and every load starts at the top of the page; it is skipped for reduced motion. `index.html` carries a plain navy panel so nothing flashes before it mounts.
- [`Showcase.tsx`](src/components/Showcase.tsx): the deck of project windows. The front one can run the real site inside the page.
- [`Hero.tsx`](src/components/Hero.tsx): on a wide screen the hero is pinned. It stays put while the page scrolls through one step per live project, and each step brings the next project to the front of the deck. On phones, short screens and with reduced motion it is not pinned and the deck turns on its own.
- [`HeroCatch.tsx`](src/components/HeroCatch.tsx): the hero's mini game. Project names drift down one at a time; move the panda (mouse, finger or arrow keys) so one lands on its hat and that project comes to the front of the deck. It is an extra on top of the deck's own tabs, so it is not shown with reduced motion.
- [`livePing.ts`](src/lib/livePing.ts): the one-per-page-load ping they all share.

## The rest of the page

- [`Header.tsx`](src/components/Header.tsx): a floating bar. A highlight slides to the section being read and a straw line shows progress down the page. The mark in [`Logo.tsx`](src/components/Logo.tsx) is an N drawn as a route through four junctions.
- [`SledGame.tsx`](src/components/SledGame.tsx): a small game between Work and About. Every flag on the hill is a project; steer the sled to one (arrow keys, the two buttons, or pick a flag) and it shows what is planted there. Each flag is a real button, so it works with a keyboard and a screen reader.
- [`Panda.tsx`](src/components/Panda.tsx): `PandaAtWork` is the About figure. Its performance (laptop opens, mark lights up, Web / IoT / ML lift off, a flag goes in) is tied to scrolling through About.
- [`Timeline.tsx`](src/components/Timeline.tsx): the timeline as a slalom run. The trail is laid through one gate per entry, and the sled is kept level with the middle of the screen as you scroll.
- [`ProjectPicture.tsx`](src/components/ProjectPicture.tsx): projects without a screenshot show a `CodeWindow` instead: lines copied verbatim from one file in the repo (the `evidence` field in `resume.ts`), linked to the same lines on GitHub. If that file changes upstream, update the excerpt.

## Motion

Scroll-linked motion uses CSS scroll-driven animations (`animation-timeline`), so it is tied to scroll position rather than time. Browsers without support show the same content in place. Wheel scrolling is eased with [Lenis](https://github.com/darkroomengineering/lenis); touch devices keep their native momentum.

Everything that moves is inside a `prefers-reduced-motion: no-preference` block in [`src/styles/globals.css`](src/styles/globals.css). With reduced motion there is no opening screen, the page is complete and still, the deck waits to be clicked, recordings wait for a Play button, the timeline is drawn with every flag up and no sled, and the game places the sled instead of sliding it.

## Build

```bash
npm run build
npm run preview   # serve the production build locally
```

## Deploy

`.github/workflows/deploy.yml` builds and deploys to GitHub Pages on every push to `main`. The repository's Pages source must be set to **GitHub Actions** (Settings → Pages).
