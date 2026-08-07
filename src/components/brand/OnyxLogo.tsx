import { cn } from "@/lib/utils";

/** ONYX logo mark — lime + charcoal, no blue */
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
      <rect width="32" height="32" rx="6" className="fill-[#111111] dark:fill-[#E2FF4C]" />
      <path
        d="M8 22L16 8L24 22"
        className="stroke-white dark:stroke-[#111111]"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
