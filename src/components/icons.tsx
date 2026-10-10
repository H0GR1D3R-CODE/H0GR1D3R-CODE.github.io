import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, ...rest }: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const ArrowOut = (p: IconProps) => (
  <Icon {...p}>
    <path d="M7 17 17 7M9 7h8v8" />
  </Icon>
);

export const Download = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 20h14" />
  </Icon>
);

export const Play = (p: IconProps) => (
  <Icon {...p} fill="currentColor" stroke="none">
    <path d="M8 5.5v13a1 1 0 0 0 1.5.86l11-6.5a1 1 0 0 0 0-1.72l-11-6.5A1 1 0 0 0 8 5.5Z" />
  </Icon>
);

export const Pause = (p: IconProps) => (
  <Icon {...p} fill="currentColor" stroke="none">
    <rect x="6" y="5" width="4.5" height="14" rx="1" />
    <rect x="13.5" y="5" width="4.5" height="14" rx="1" />
  </Icon>
);

/** Sun over a snow line: the snow-day theme. */
export const SnowDay = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="10" r="3.5" />
    <path d="M12 2.5v1.5M4.5 10H6M18 10h1.5M6.7 4.7l1 1M17.3 4.7l-1 1M3 19c3-2.5 6-2.5 9 0s6 2.5 9 0" />
  </Icon>
);

/** Crescent moon with falling snow: the snowy-night theme. */
export const SnowNight = (p: IconProps) => (
  <Icon {...p}>
    <path d="M19 12.5A7.5 7.5 0 1 1 10.5 4a6 6 0 0 0 8.5 8.5Z" />
    <path d="M17 3.5v.01M20.5 6.5v.01M15.5 7.5v.01" strokeWidth="2.75" />
  </Icon>
);
