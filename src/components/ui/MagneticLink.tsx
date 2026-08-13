import type { AnchorHTMLAttributes, PropsWithChildren } from "react";
import { useMagnetic } from "@/lib/useMagnetic";
import { cn } from "@/lib/cn";

type MagneticLinkProps = PropsWithChildren<AnchorHTMLAttributes<HTMLAnchorElement>> & {
  variant?: "solid" | "outline" | "ghost";
};

export function MagneticLink({ children, className, variant = "outline", ...rest }: MagneticLinkProps) {
  const ref = useMagnetic<HTMLAnchorElement>();

  const base =
    "inline-flex items-center gap-2 rounded-full px-6 py-3 font-mono text-xs uppercase tracking-[0.18em] transition-colors duration-300";
  const variants: Record<string, string> = {
    solid: "bg-gold text-ink hover:bg-gold-lite",
    outline: "border border-gold-dim text-bone hover:border-gold hover:text-gold",
    ghost: "text-bone hover:text-gold",
  };

  return (
    <a ref={ref} className={cn(base, variants[variant], className)} {...rest}>
      {children}
    </a>
  );
}
