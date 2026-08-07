"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { BRAND } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { LanguageSelector } from "@/components/i18n/LanguageSelector";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { OnyxLogo } from "@/components/brand/OnyxLogo";

export function Header() {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-bg-secondary/80 backdrop-blur-2xl safe-area-top safe-area-x">
      <div className="container-app flex h-16 items-center gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-2.5 group">
          <OnyxLogo size={34} />
          <span className="font-display text-base font-bold tracking-tight text-text-primary group-hover:text-brand transition-colors">
            {BRAND.name}
          </span>
        </Link>

        <nav className="hidden flex-1 items-center gap-1 lg:flex">
          {[
            { label: "Markets", href: "/dashboard/portfolio" },
            { label: "Trade", href: "/dashboard/trade" },
            { label: "AI Trading", href: "/dashboard/ai-trading" },
            { label: "Institutional", href: "/about" },
            { label: "Help", href: "/help" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-text-secondary transition-all hover:bg-bg-hover hover:text-text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <LanguageSelector className="hidden sm:block" />
          <Link href="/login" className="hidden sm:block">
            <Button variant="ghost" size="sm">
              {t("auth.login")}
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm" variant="premium">
              {t("common.openAccount")}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
