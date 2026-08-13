import { cn } from "@/lib/cn";

export function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-gold-dim px-3 py-1 text-xs font-mono text-muted",
        "transition-colors duration-300 hover:border-gold hover:text-gold",
        className
      )}
    >
      {children}
    </span>
  );
}
