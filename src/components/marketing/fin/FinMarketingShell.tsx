"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BRAND } from "@/lib/constants";
import { MARKETING_MORE_LINKS, MARKETING_NAV } from "@/lib/marketing-nav";
import { OnyxLogo } from "@/components/brand/OnyxLogo";
import { LanguageSelector } from "@/components/i18n/LanguageSelector";
import { Button } from "@/components/ui/Button";
import { Menu, X } from "@/components/icons";
import { cn } from "@/lib/utils";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import {
  Bot,
  Globe,
  LayoutDashboard,
  LineChart,
  Star,
  TrendingUp,
  Users,
  Wallet,
} from "@/components/icons";

const SIDEBAR = [
  { href: "/", icon: LayoutDashboard, label: "Overview" },
  { href: "/products", icon: Wallet, label: "Products" },
  { href: "/community", icon: Users, label: "Community" },
  { href: "/markets", icon: Globe, label: "Markets" },
  { href: "/trading", icon: TrendingUp, label: "Trading" },
  { href: "/features", icon: Star, label: "Features" },
  { href: "/pricing", icon: LineChart, label: "Pricing" },
  { href: "/dashboard/ai-trading", icon: Bot, label: "AI" },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function FinMarketingSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fin-sidebar hidden lg:flex w-[72px] shrink-0 flex-col items-center gap-2 border-r border-[#E5E7EB] bg-[#F4F7F6] py-5">
      <Link
        href="/"
        className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm"
      >
        <OnyxLogo size={24} />
      </Link>
      <nav className="flex flex-1 flex-col items-center gap-2">
        {SIDEBAR.map((item) => {
          const Icon = item.icon;
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-300",
                active
                  ? "bg-[#111111] text-[var(--brand-accent)] shadow-lg scale-105"
                  : "text-[#9CA3AF] hover:bg-white hover:text-[#111111] hover:scale-105"
              )}
            >
              <Icon className="h-[18px] w-[18px]" />
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export function FinMarketingMobileBar() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  useBodyScrollLock(menuOpen);
  const links = [...MARKETING_NAV, ...MARKETING_MORE_LINKS.map((l) => ({ label: l.label, href: l.href }))];

  return (
    <>
      <header className="fin-mobile-bar sticky top-0 z-50 flex items-center justify-between border-b border-[#E5E7EB] bg-[#F4F7F6]/95 px-4 py-3 backdrop-blur-md lg:hidden safe-area-top">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm">
            <OnyxLogo size={20} />
          </span>
          <span className="font-bold text-[#111111]">{BRAND.name}</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/register">
            <Button size="sm" className="h-8 rounded-full bg-[#111111] px-3 text-xs text-white">
              Join
            </Button>
          </Link>
          <button type="button" onClick={() => setMenuOpen(true)} className="rounded-lg p-2">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <button type="button" className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[min(300px,88vw)] bg-white p-4 safe-area-top safe-area-bottom">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-bold">{BRAND.name}</span>
              <button type="button" onClick={() => setMenuOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="space-y-1">
              {links.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "block rounded-xl px-3 py-2.5 text-sm font-medium",
                    isActive(pathname, item.href)
                      ? "bg-[var(--brand-accent)] text-[#111111]"
                      : "text-[#6B7280]"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-4 space-y-2 border-t border-[#E5E7EB] pt-4">
              <LanguageSelector />
              <Link href="/login" className="block text-sm text-[#6B7280]">
                {t("auth.login")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function FinPageActions() {
  return (
    <div className="flex items-center gap-2">
      <Link
        href="/register"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-[#111111] text-white shadow-lg transition-transform hover:scale-105"
        aria-label="Get started"
      >
        +
      </Link>
      <Link
        href="/dashboard"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#111111] text-white shadow-md transition-transform hover:scale-105"
        aria-label="Open dashboard"
      >
        ↑
      </Link>
    </div>
  );
}
