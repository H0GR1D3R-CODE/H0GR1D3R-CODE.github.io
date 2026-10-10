import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { ArrowOut } from "./icons";

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: "primary" | "secondary";
  size?: "md" | "sm";
  /** Opens in a new tab and shows the arrow that says so. */
  external?: boolean;
  icon?: ReactNode;
};

const base =
  "press group inline-flex items-center justify-center gap-2 rounded-[0.6rem] font-sans font-semibold leading-none whitespace-nowrap";
const sizes = { md: "h-11 px-5 text-[0.9375rem]", sm: "h-9 px-4 text-sm" };
const variants = {
  primary: "bg-straw text-on-straw hover:bg-straw-soft",
  secondary: "border-[1.5px] border-edge bg-bg/40 text-ink hover:border-ink hover:bg-bg-2",
};

export function ButtonLink({
  variant = "secondary",
  size = "md",
  external = false,
  icon,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <a
      className={cn(base, sizes[size], variants[variant], className)}
      {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      {...rest}
    >
      {icon}
      <span>{children}</span>
      {external && (
        <ArrowOut className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none" />
      )}
    </a>
  );
}
