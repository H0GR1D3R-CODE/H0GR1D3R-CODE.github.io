# Nebin Stanly — Portfolio

An immersive, single-page portfolio built from a resume PDF: Vite + React 19 + TypeScript, Tailwind v4, GSAP/ScrollTrigger, Lenis smooth scroll, and a lazy-loaded Three.js hero.

## Develop

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

## Content

All copy lives in one place: [`src/data/resume.ts`](src/data/resume.ts). Edit it there — no need to touch component files for text changes.

The three project descriptions are **drafted, not verified** (the resume only lists project titles + tech + dates, no descriptions). Each one is marked in `resume.ts` with:

```ts
// TODO: VERIFY — drafted from resume title, confirm before publishing
```

Rewrite or approve those before treating the site as final.

## Portrait photo

The About section currently shows a gold-framed "NS" monogram placeholder. To use a real photo, drop an image at `src/assets/portrait.jpg` and swap the placeholder `<div>` in [`src/components/sections/About.tsx`](src/components/sections/About.tsx) for an `<img src={portrait} ... />`.

## Contact form

The contact form posts to [Formspree](https://formspree.io). To enable it:

1. Create a free form at formspree.io and copy its ID.
2. Copy `.env.example` to `.env` and set `VITE_FORMSPREE_ID`.

Without an ID, the form gracefully falls back to opening the visitor's mail client with a pre-filled message.

## Build

```bash
npm run build
npm run preview   # serve the production build locally
```

## Deploy to GitHub Pages (H0GR1D3R-CODE.github.io)

A workflow at `.github/workflows/deploy.yml` builds and deploys on every push to `main`.

```bash
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/H0GR1D3R-CODE/H0GR1D3R-CODE.github.io.git
git push -u origin main
```

Then, one time only, in the repo on GitHub: **Settings → Pages → Source → GitHub Actions**. The next push (or the one that just landed) will publish the site at `https://h0gr1d3r-code.github.io/`.

## Notes

- All animation is gated behind `prefers-reduced-motion`; the 3D hero is also skipped on coarse-pointer (touch) devices to keep mobile fast.
- Fonts (Fraunces, Manrope, JetBrains Mono) are self-hosted via `@fontsource-variable/*` — no external font requests.
