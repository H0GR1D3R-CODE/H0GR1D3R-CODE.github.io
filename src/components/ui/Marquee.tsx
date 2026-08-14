import { Fragment, type PropsWithChildren, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

type MarqueeProps = {
  items: ReactNode[];
  className?: string;
  itemClassName?: string;
  separator?: ReactNode;
  duration?: number;
  reverse?: boolean;
};

/** Infinite auto-scrolling strip. Duplicates its content once for a seamless loop; freezes under reduced-motion. */
export function Marquee({
  items,
  className,
  itemClassName,
  separator = <span className="mx-6 text-gold/40" aria-hidden="true">&#9670;</span>,
  duration = 32,
  reverse = false,
}: PropsWithChildren<MarqueeProps>) {
  const reducedMotion = usePrefersReducedMotion();

  const track = (
    <div className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <Fragment key={i}>
          <span className={cn("whitespace-nowrap", itemClassName)}>{item}</span>
          {i < items.length - 1 && separator}
        </Fragment>
      ))}
      {separator}
    </div>
  );

  if (reducedMotion) {
    return <div className={cn("flex flex-wrap items-center gap-x-6 gap-y-3", className)}>{items}</div>;
  }

  return (
    <div className={cn("overflow-hidden", className)} aria-hidden="true">
      <div
        className="flex w-max"
        style={{
          animation: `marquee ${duration}s linear infinite ${reverse ? "reverse" : "normal"}`,
        }}
      >
        {track}
        {track}
      </div>
    </div>
  );
}
