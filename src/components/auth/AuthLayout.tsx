import Link from "next/link";
import { BRAND } from "@/lib/constants";
import { Globe, HelpCircle } from "lucide-react";

export function AuthLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden>
      <rect width="28" height="28" rx="6" fill="#F0B90B" />
      <path d="M8 18L14 8L20 18H16.5L14 14.5L11.5 18H8Z" fill="#0B0E11" />
    </svg>
  );
}

export function AuthShell({
  children,
  wide = false,
}: {
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="min-h-dvh bg-bg-primary auth-page flex flex-col">
      <header className="shrink-0 border-b border-border/60 safe-area-top">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <AuthLogo size={30} />
            <span className="text-[17px] font-bold text-text-primary tracking-tight">
              {BRAND.name}
            </span>
          </Link>
          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/help"
              className="flex items-center gap-1.5 h-9 px-2.5 sm:px-3 text-[13px] text-text-secondary hover:text-text-primary rounded-md hover:bg-bg-hover transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">English</span>
            </Link>
            <Link
              href="/help"
              className="flex items-center gap-1.5 h-9 px-2.5 sm:px-3 text-[13px] text-text-secondary hover:text-text-primary rounded-md hover:bg-bg-hover transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Help</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-start sm:justify-center px-4 py-8 sm:py-12">
        <div className={wide ? "w-full max-w-[520px]" : "w-full max-w-[400px]"}>
          {children}
        </div>
      </main>

      <footer className="shrink-0 py-5 px-4 safe-area-bottom">
        <p className="text-center text-[11px] text-text-tertiary leading-relaxed max-w-sm mx-auto">
          &copy; {new Date().getFullYear()} {BRAND.fullName}.{" "}
          <Link href="/risk" className="text-brand hover:underline">
            Trading involves risk
          </Link>
          .
        </p>
      </footer>
    </div>
  );
}
