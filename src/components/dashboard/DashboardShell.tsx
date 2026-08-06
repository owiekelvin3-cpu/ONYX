"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { createClient } from "@/lib/supabase/client";
import { clearAdminAuthCookie } from "@/lib/auth-guards";
import { cn } from "@/lib/utils";
import { AppTopNav } from "@/components/layout/AppTopNav";
import {
  LayoutDashboard,
  TrendingUp,
  Wallet,
  ArrowDownToLine,
  MoreHorizontal,
  LogOut,
} from "@/components/icons";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

const MOBILE_TABS = [
  { labelKey: "dashboard.dock.home", href: "/dashboard", icon: LayoutDashboard },
  { labelKey: "dashboard.navTrade", href: "/dashboard/trade", icon: TrendingUp },
  { labelKey: "dashboard.navPortfolio", href: "/dashboard/portfolio", icon: Wallet },
  { labelKey: "dashboard.navDeposit", href: "/dashboard/deposit", icon: ArrowDownToLine },
  { labelKey: "nav.more", href: null, icon: MoreHorizontal },
] as const;

const MORE_MENU_PATHS = [
  "/dashboard/transactions",
  "/dashboard/notifications",
  "/dashboard/withdraw",
  "/dashboard/ai-trading",
  "/dashboard/copy-trading",
  "/dashboard/support",
  "/dashboard/settings",
];

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isMoreMenuActive(pathname: string) {
  return MORE_MENU_PATHS.some(
    (href) => pathname === href || pathname.startsWith(`${href}/`)
  );
}

export function shouldHideMobileBottomNav(pathname: string) {
  return pathname.startsWith("/dashboard/support");
}

export function DashboardShell({
  children,
  userName,
  userEmail,
}: {
  children: React.ReactNode;
  userName?: string;
  userEmail?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const hideBottomNav = shouldHideMobileBottomNav(pathname);
  useBodyScrollLock(menuOpen);

  async function handleLogout() {
    const supabase = createClient();
    clearAdminAuthCookie();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="dashboard-shell flex min-h-dvh flex-col">
      <AppTopNav mode="dashboard" userName={userName} userEmail={userEmail} />

      <main
        className={cn(
          "relative z-[1] mx-auto w-full max-w-7xl flex-1 px-3 py-4 sm:px-5 sm:py-6 lg:px-8",
          hideBottomNav
            ? "pb-[max(0.75rem,var(--safe-bottom))]"
            : "pb-[calc(4.25rem+var(--safe-bottom))] lg:pb-8"
        )}
      >
        {children}
      </main>

      {!hideBottomNav && (
        <nav
          className="fixed inset-x-0 bottom-0 z-50 border-t border-border/80 bg-bg-secondary/95 backdrop-blur-xl safe-area-x lg:hidden"
          aria-label={t("dashboard.navLabel")}
        >
          <div className="flex items-stretch justify-around px-1 pt-1.5 pb-[max(0.35rem,var(--safe-bottom))]">
            {MOBILE_TABS.map((item) => {
              const Icon = item.icon;
              const isMore = item.href === null;
              const active = isMore
                ? menuOpen || isMoreMenuActive(pathname)
                : isActive(pathname, item.href);

              const className = cn(
                "relative flex max-w-[80px] min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-2 text-[10px] leading-tight transition-colors",
                active ? "text-brand" : "text-text-tertiary"
              );

              const content = (
                <>
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-xl",
                      active ? "bg-brand/10" : ""
                    )}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="w-full truncate text-center font-medium">{t(item.labelKey)}</span>
                </>
              );

              if (isMore) {
                return (
                  <button
                    key={item.labelKey}
                    type="button"
                    onClick={() => setMenuOpen(true)}
                    className={className}
                    aria-label={t("dashboard.openSidebar")}
                  >
                    {content}
                  </button>
                );
              }

              return (
                <Link key={item.href} href={item.href} className={className}>
                  {content}
                </Link>
              );
            })}
          </div>
        </nav>
      )}

      {menuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-black/20"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[70vh] overflow-y-auto rounded-t-3xl border-t border-border bg-bg-secondary p-4 safe-area-bottom">
            <div className="grid gap-2">
              {MORE_MENU_PATHS.map((href) => {
                const labelKey =
                  href === "/dashboard/transactions"
                    ? "dashboard.transactions"
                    : href === "/dashboard/notifications"
                      ? "dashboard.notifications"
                      : null;
                return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-text-secondary hover:bg-bg-hover"
                >
                  {labelKey ? t(labelKey) : href.split("/").pop()?.replace("-", " ")}
                </Link>
              );
              })}
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  void handleLogout();
                }}
                className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-red hover:bg-red/5"
              >
                <LogOut className="h-4 w-4" />
                {t("common.signOut")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
