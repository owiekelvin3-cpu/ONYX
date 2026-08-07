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
  MoreHorizontal,
  LogOut,
  ArrowDownToLine,
  ArrowUpFromLine,
  Receipt,
  Bell,
  Bot,
  Copy,
  Comments,
  Settings,
  X,
} from "@/components/icons";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { NotificationProvider } from "@/components/notifications/NotificationProvider";

const MOBILE_TABS = [
  { labelKey: "dashboard.dock.home", href: "/dashboard", icon: LayoutDashboard },
  { labelKey: "dashboard.dock.trade", href: "/dashboard/trade", icon: TrendingUp },
  { labelKey: "nav.markets", href: "/dashboard/portfolio", icon: Wallet },
  { labelKey: "nav.more", href: null, icon: MoreHorizontal },
] as const;

const MORE_MENU_ITEMS = [
  { href: "/dashboard/deposit", labelKey: "dashboard.navDeposit", icon: ArrowDownToLine },
  { href: "/dashboard/withdraw", labelKey: "dashboard.navWithdraw", icon: ArrowUpFromLine },
  { href: "/dashboard/transactions", labelKey: "dashboard.transactions", icon: Receipt },
  { href: "/dashboard/notifications", labelKey: "dashboard.notifications", icon: Bell },
  { href: "/dashboard/ai-trading", labelKey: "dashboard.aiTrading", icon: Bot },
  { href: "/dashboard/copy-trading", labelKey: "dashboard.copyTrading", icon: Copy },
  { href: "/dashboard/support", labelKey: "dashboard.support", icon: Comments },
  { href: "/dashboard/settings", labelKey: "dashboard.settings", icon: Settings },
] as const;

const MORE_MENU_PATHS = MORE_MENU_ITEMS.map((item) => item.href);

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
  userId,
  userName,
  userEmail,
  avatarUrl,
}: {
  children: React.ReactNode;
  userId?: string;
  userName?: string;
  userEmail?: string;
  avatarUrl?: string;
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
    <NotificationProvider userId={userId}>
      <div className="dashboard-shell flex min-h-dvh flex-col">
        <AppTopNav
          mode="dashboard"
          userName={userName}
          userEmail={userEmail}
          avatarUrl={avatarUrl}
        />

      <main
        className={cn(
          "relative z-[1] mx-auto w-full max-w-7xl flex-1 px-3 py-4 sm:px-5 sm:py-6 lg:px-8",
          hideBottomNav
            ? "pb-[max(0.75rem,var(--safe-bottom))]"
            : "pb-[calc(5.5rem+var(--safe-bottom))] lg:pb-8"
        )}
      >
        {children}
      </main>

      {!hideBottomNav && (
        <nav
          className="dashboard-mobile-dock fixed inset-x-0 bottom-0 z-50 border-t border-border/60 bg-bg-secondary/90 shadow-[0_-12px_40px_rgba(10,10,15,0.08)] backdrop-blur-2xl safe-area-x lg:hidden"
          aria-label={t("dashboard.navLabel")}
        >
          <div className="mx-auto flex max-w-lg items-stretch justify-around px-2 pt-1.5 pb-[max(0.5rem,var(--safe-bottom))]">
            {MOBILE_TABS.map((item) => {
              const Icon = item.icon;
              const isMore = item.href === null;
              const active = isMore
                ? menuOpen || isMoreMenuActive(pathname)
                : isActive(pathname, item.href);

              const className = cn(
                "touch-target relative flex min-h-[52px] min-w-0 flex-1 max-w-[88px] flex-col items-center justify-center gap-1 rounded-xl px-1 py-1.5 text-[10px] leading-none transition-all duration-200",
                active ? "text-brand" : "text-text-tertiary active:text-text-secondary"
              );

              const content = (
                <>
                  <span
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200",
                      active ? "bg-gradient-brand text-white shadow-[var(--shadow-glow)]" : ""
                    )}
                  >
                    <Icon className="h-[18px] w-[18px] shrink-0" />
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
                    aria-label={t("nav.more")}
                    aria-expanded={menuOpen}
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
            className="absolute inset-0 bg-black/30 mobile-nav-backdrop"
            onClick={() => setMenuOpen(false)}
            aria-label={t("common.close")}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[min(78vh,640px)] overflow-hidden rounded-t-3xl border-t border-border bg-bg-secondary shadow-[0_-16px_48px_rgba(15,23,42,0.12)] safe-area-bottom">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-text-primary">{t("nav.more")}</p>
                <p className="text-[11px] text-text-tertiary">{t("dashboard.clientPortal")}</p>
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl p-2 text-text-tertiary hover:bg-bg-hover hover:text-text-primary"
                aria-label={t("common.close")}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[calc(min(78vh,640px)-8rem)] overflow-y-auto px-3 py-2">
              <div className="grid gap-1">
                {MORE_MENU_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(pathname, item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors",
                        active
                          ? "nav-pill-active"
                          : "text-text-secondary hover:bg-bg-hover hover:text-text-primary"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                          active ? "bg-white/10" : "bg-bg-primary text-brand"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      {t(item.labelKey)}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-border p-3">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  void handleLogout();
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red hover:bg-red/5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red/10">
                  <LogOut className="h-4 w-4" />
                </span>
                {t("common.signOut")}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </NotificationProvider>
  );
}
