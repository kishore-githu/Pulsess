import type { SVGProps } from "react";

type LogoProps = SVGProps<SVGSVGElement> & {
  light?: boolean;
};

export function Mark({ light = false, ...props }: LogoProps) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <rect width="32" height="32" rx="9" fill={light ? "#F3EEE4" : "#12382E"} />
      <path
        d="M5 16.5h6.2l2.1-5.4 3.3 10.6 2.3-5.2H27"
        fill="none"
        stroke={light ? "#12382E" : "#F3EEE4"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({ light = false, className = "" }: { light?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Mark light={light} className="h-7 w-7" />
      <span className={`font-serif text-[1.45rem] leading-none tracking-tight ${light ? "text-paper" : "text-ink"}`}>
        Pulse
      </span>
    </span>
  );
}
