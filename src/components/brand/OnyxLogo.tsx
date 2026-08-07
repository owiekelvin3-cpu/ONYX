import { cn } from "@/lib/utils";

/** ONYX premium mark — indigo gradient chevron */
export function OnyxLogo({
  size = 28,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id="onyx-bg" x1="0" y1="0" x2="32" y2="32">
          <stop stopColor="#EEF2FF" />
          <stop offset="1" stopColor="#E0E7FF" />
        </linearGradient>
        <linearGradient id="onyx-mark" x1="8" y1="22" x2="24" y2="10">
          <stop stopColor="#5046E5" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#onyx-bg)" />
      <path
        d="M8 22L16 8L24 22"
        stroke="url(#onyx-mark)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 22L16 12L21 22"
        stroke="#A5B4FC"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />
    </svg>
  );
}
