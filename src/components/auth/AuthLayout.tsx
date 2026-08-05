import Link from "next/link";
import { BRAND, PLATFORM_HIGHLIGHTS } from "@/lib/constants";
import { ArrowLeft, Clock, HelpCircle, Layers, Receipt, Shield } from "@/components/icons";

const FEATURE_ICONS = [Shield, Receipt, Layers, Clock] as const;

export function AuthShell({
  children,
  wide = false,
  panelTitle,
  panelSubtitle,
}: {
  children: React.ReactNode;
  wide?: boolean;
  panelTitle?: string;
  panelSubtitle?: string;
}) {
  return (
    <div className="min-h-dvh bg-bg-primary auth-page flex flex-col lg:flex-row">
      {/* Brand panel — desktop */}
      <aside className="hidden lg:flex lg:w-[44%] xl:w-[42%] flex-col border-r border-border bg-bg-secondary/40">
        <div className="flex items-center justify-between h-16 px-8 border-b border-border/60">
          <Link href="/" className="flex items-center gap-2.5">
            <AuthLogo size={28} />
            <span className="text-base font-bold text-text-primary">{BRAND.name}</span>
          </Link>
          <Link
            href="/help"
            className="flex items-center gap-1.5 text-[13px] text-text-tertiary hover:text-text-primary transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            Help
          </Link>
        </div>

        <div className="flex-1 flex flex-col justify-center px-8 xl:px-12 py-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[13px] text-text-tertiary hover:text-brand transition-colors mb-8 w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <h2 className="text-[32px] xl:text-[36px] font-bold text-text-primary leading-tight tracking-tight">
            {panelTitle ?? BRAND.tagline}
          </h2>
          <p className="text-[15px] text-text-secondary mt-3 leading-relaxed max-w-md">
            {panelSubtitle ?? BRAND.description}
          </p>

          <ul className="mt-8 space-y-4">
            {PLATFORM_HIGHLIGHTS.map((item, i) => {
              const Icon = FEATURE_ICONS[i];
              return (
                <li key={item.title} className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-md bg-brand/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-brand" strokeWidth={1.75} />
                  </span>
                  <div>
                    <p className="text-[14px] font-medium text-text-primary">{item.title}</p>
                    <p className="text-[13px] text-text-tertiary mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      {/* Form panel */}
      <div className="flex-1 flex flex-col min-h-dvh min-w-0">
        <header className="lg:hidden shrink-0 border-b border-border/60 safe-area-top">
          <div className="flex items-center justify-between h-14 px-4">
            <Link href="/" className="flex items-center gap-2">
              <AuthLogo size={26} />
              <span className="font-bold text-text-primary">{BRAND.name}</span>
            </Link>
            <Link href="/help" className="p-2 text-text-tertiary">
              <HelpCircle className="w-5 h-5" />
            </Link>
          </div>
        </header>

        <main className="flex-1 flex items-start lg:items-center justify-center px-4 py-8 sm:py-10 lg:py-12 overflow-y-auto">
          <div
            className={
              wide
                ? "w-full max-w-[520px] auth-form-card"
                : "w-full max-w-[420px] auth-form-card"
            }
          >
            {children}
          </div>
        </main>

        <footer className="shrink-0 py-4 px-4 safe-area-bottom border-t border-border/40 lg:border-0">
          <p className="text-center text-[11px] text-text-tertiary">
            &copy; {new Date().getFullYear()} {BRAND.fullName}. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}

export function AuthLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden>
      <rect width="28" height="28" rx="6" fill="#F0B90B" />
      <path d="M8 18L14 8L20 18H16.5L14 14.5L11.5 18H8Z" fill="#0B0E11" />
    </svg>
  );
}

export function AuthCardHeader({
  title,
  subtitle,
  alternate,
}: {
  title: string;
  subtitle: string;
  alternate: { prompt: string; href: string; label: string };
}) {
  return (
    <div className="mb-6 sm:mb-8">
      <h1 className="text-[26px] sm:text-[30px] font-bold text-text-primary tracking-tight">
        {title}
      </h1>
      <p className="text-[14px] text-text-tertiary mt-2">{subtitle}</p>
      <p className="text-[14px] text-text-tertiary mt-4 pt-4 border-t border-border">
        {alternate.prompt}{" "}
        <Link
          href={alternate.href}
          className="text-brand font-semibold hover:text-brand-hover transition-colors"
        >
          {alternate.label}
        </Link>
      </p>
    </div>
  );
}
