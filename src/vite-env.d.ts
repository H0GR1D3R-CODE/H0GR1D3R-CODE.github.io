/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FORMSPREE_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/** Injected at build time by vite.config.ts — the short commit SHA and ISO timestamp of this build. */
declare const __BUILD_COMMIT__: string;
declare const __BUILD_DATE__: string;
