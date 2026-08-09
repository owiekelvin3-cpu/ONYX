"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Bell,
  Bot,
  Comments,
  Copy,
  FileCheck,
  LayoutDashboard,
  LineChart,
  LogOut,
  MoreHorizontal,
  Receipt,
  Settings,
  TrendingUp,
  Wallet,
  X,
} from "@/components/icons";

const MOBILE_TABS = [
  { labelKey: "dashboard.dock.home", href: "/dashboard", icon: LayoutDashboard },
  { labelKey: "dashboard.dock.trade", href: "/dashboard/trade", icon: TrendingUp },
  { labelKey: "dashboard.navPortfolio", href: "/dashboard/portfolio", icon: Wallet },
  { labelKey: "dashboard.transactions", href: "/dashboard/transactions", icon: Receipt },
  { labelKey: "nav.more", href: null, icon: MoreHorizontal },
] as const;

const MORE_MENU_ITEMS = [
  { href: "/dashboard/deposit", labelKey: "dashboard.navDeposit", icon: ArrowDownToLine },
  { href: "/dashboard/withdraw", labelKey: "dashboard.navWithdraw", icon: ArrowUpFromLine },
  { href: "/dashboard/analytics", labelKey: "dashboard.marketAnalytics", icon: LineChart },
  { href: "/dashboard/notifications", labelKey: "dashboard.notifications", icon: Bell },
  { href: "/dashboard/ai-trading", labelKey: "dashboard.aiTrading", icon: Bot },
  { href: "/dashboard/copy-trading", labelKey: "dashboard.copyTrading", icon: Copy },
  { href: "/dashboard/kyc", labelKey: "dashboard.kyc", icon: FileCheck },
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

type DeckoMobileDockProps = {
  menuOpen: boolean;
  onMenuOpen: () => void;
  onMenuClose: () => void;
  onLogout: () => void;
};

export function DeckoMobileDock({
  menuOpen,
  onMenuOpen,
  onMenuClose,
  onLogout,
}: DeckoMobileDockProps) {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <>
      <div className="decko-mobile-dock fixed inset-x-0 bottom-0 z-50 lg:hidden">
        <nav
          className="border-t border-[var(--decko-dock-border)] bg-[var(--decko-dock-bg)] pb-[max(0.25rem,var(--safe-bottom))] backdrop-blur-xl safe-area-x"
          aria-label={t("dashboard.navLabel")}
        >
          <div className="grid grid-cols-5">
            {MOBILE_TABS.map((item) => {
              const Icon = item.icon;
              const isMore = item.href === null;
              const active = isMore
                ? menuOpen || isMoreMenuActive(pathname)
                : isActive(pathname, item.href!);

              const tabClass = cn(
                "relative flex min-h-[56px] flex-col items-center justify-center gap-1 px-1 py-2 touch-target transition-colors",
                active ? "text-[var(--decko-accent)]" : "text-text-tertiary"
              );

              const inner = (
                <>
                  {active && !isMore && (
                    <span className="absolute inset-x-3 top-0 h-0.5 rounded-full bg-[var(--decko-accent)]" />
                  )}
                  <Icon className="h-[18px] w-[18px] shrink-0" />
                  <span className="max-w-[68px] truncate text-[11px] font-medium leading-none">
                    {t(item.labelKey)}
                  </span>
                </>
              );

              if (isMore) {
                return (
                  <button
                    key={item.labelKey}
                    type="button"
                    onClick={onMenuOpen}
                    className={tabClass}
                    aria-label={t("nav.more")}
                    aria-expanded={menuOpen}
                  >
                    {inner}
                  </button>
                );
              }

              return (
                <Link key={item.href} href={item.href!} className={tabClass}>
                  {inner}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true">
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
              onClick={onMenuClose}
              aria-label={t("common.close")}
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 36 }}
              className="decko-sheet absolute bottom-0 left-0 right-0 overflow-hidden rounded-t-[20px] border-t pb-[max(0.75rem,var(--safe-bottom))] shadow-[0_-12px_40px_rgba(0,0,0,0.18)]"
            >
              <div className="flex justify-center pt-2.5">
                <span className="h-1 w-9 rounded-full bg-border" aria-hidden />
              </div>

              <div className="flex items-center justify-between px-4 pb-3 pt-1.5">
                <p className="text-sm font-bold text-text-primary">{t("nav.more")}</p>
                <button
                  type="button"
                  onClick={onMenuClose}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-bg-tertiary text-text-secondary transition-colors active:bg-bg-hover"
                  aria-label={t("common.close")}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="px-4 pb-3">
                <div className="grid grid-cols-3 gap-2">
                  {MORE_MENU_ITEMS.map((item, i) => {
                    const Icon = item.icon;
                    const active = isActive(pathname, item.href);
                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.03 + i * 0.025 }}
                      >
                        <Link
                          href={item.href}
                          onClick={onMenuClose}
                          className="group flex flex-col items-center gap-1.5 rounded-xl border border-transparent p-2 text-center active:bg-bg-tertiary"
                        >
                          <span
                            className={cn(
                              "flex h-11 w-11 items-center justify-center rounded-xl transition-colors",
                              active
                                ? "bg-[var(--decko-accent)] text-[var(--decko-accent-text)]"
                                : "bg-bg-tertiary text-text-primary"
                            )}
                          >
                            <Icon className="h-4 w-4" />
                          </span>
                          <span
                            className={cn(
                              "line-clamp-2 min-h-[2rem] w-full text-[10px] font-medium leading-tight",
                              active ? "text-text-primary" : "text-text-secondary"
                            )}
                          >
                            {t(item.labelKey)}
                          </span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-border px-4 py-3">
                <button
                  type="button"
                  onClick={() => {
                    onMenuClose();
                    onLogout();
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-red/20 bg-red/8 px-3 py-3 text-sm font-semibold text-red transition-colors active:bg-red/12"
                >
                  <LogOut className="h-4 w-4" />
                  {t("common.signOut")}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export { isMoreMenuActive, isActive as isDockActive };
