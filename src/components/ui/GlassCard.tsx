import { forwardRef, type PropsWithChildren } from "react";
import { cn } from "@/lib/cn";

export const GlassCard = forwardRef<HTMLDivElement, PropsWithChildren<{ className?: string }>>(
  function GlassCard({ children, className }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-2xl border border-gold-dim bg-ink-2/60 backdrop-blur-sm",
          "shadow-[0_1px_0_0_rgba(200,162,76,0.08)_inset]",
          "transition-colors duration-300 hover:border-gold/50",
          className
        )}
      >
        {children}
      </div>
    );
  }
);
