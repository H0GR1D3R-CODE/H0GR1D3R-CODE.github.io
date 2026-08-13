import { createElement, type PropsWithChildren, type ElementType } from "react";
import { cn } from "@/lib/cn";

/**
 * Marks a child as an animation target for the nearest ancestor's
 * useReveal() call — that hook queries `[data-reveal]` and staggers them
 * in on scroll. This component is just a thin, semantic wrapper.
 */
export function RevealText({
  as = "div",
  children,
  className,
  delay,
}: PropsWithChildren<{ as?: ElementType; className?: string; delay?: number }>) {
  return createElement(
    as,
    {
      "data-reveal": true,
      className: cn(className),
      style: delay ? { transitionDelay: `${delay}ms` } : undefined,
    },
    children
  );
}
