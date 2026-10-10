import { useCallback, useEffect, useState } from "react";
import { flushSync } from "react-dom";

export type Theme = "day" | "night";

/** Only ever written when the visitor presses the toggle. */
const STORAGE_KEY = "theme-choice";
const THEME_COLOR: Record<Theme, string> = { day: "#F6FAFC", night: "#0B1622" };

function current(): Theme {
  return document.documentElement.dataset.theme === "night" ? "night" : "day";
}

function apply(theme: Theme) {
  const root = document.documentElement;
  if (theme === "night") root.dataset.theme = "night";
  else delete root.dataset.theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[theme]);
}

/**
 * Snowy night is the default for everyone; snow day is opt-in and remembered.
 * index.html applies a saved choice before first paint, so this hook only
 * has to read it back and keep the document in sync.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(current);

  useEffect(() => apply(theme), [theme]);

  /**
   * Flips the theme. Where the browser can, the new theme opens in a circle
   * from `origin` (the toggle button), so night falls from the moon icon.
   */
  const toggle = useCallback((origin?: { x: number; y: number }) => {
    const next: Theme = current() === "day" ? "night" : "day";
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private mode or blocked storage: the choice just won't persist.
    }
    const root = document.documentElement;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!("startViewTransition" in document) || calm) {
      setTheme(next);
      return;
    }

    if (origin) {
      root.style.setProperty("--switch-x", `${origin.x}px`);
      root.style.setProperty("--switch-y", `${origin.y}px`);
    }
    root.classList.add("theme-switch");
    const transition = document.startViewTransition(() => {
      flushSync(() => setTheme(next));
      apply(next);
    });
    transition.finished.finally(() => root.classList.remove("theme-switch"));
  }, []);

  return { theme, toggle };
}
