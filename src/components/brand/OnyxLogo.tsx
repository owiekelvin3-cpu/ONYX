import { cn } from "@/lib/utils";

/** Purple stripe mark matching the reference dashboard video. */
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
      <rect width="32" height="32" rx="8" fill="#EEEAFD" />
      <path
        d="M8 22L14 10L20 22"
        stroke="#6B4AE3"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 22L17 10L23 22"
        stroke="#9B87F5"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.65"
      />
    </svg>
  );
}
