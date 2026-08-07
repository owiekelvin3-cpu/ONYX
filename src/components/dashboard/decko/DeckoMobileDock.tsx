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
  LayoutDashboard,
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
  { labelKey: "dashboard.dock.trade", href: "/dashboard/trade", icon: TrendingUp, featured: true },
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
      <div className="decko-mobile-dock fixed inset-x-0 bottom-0 z-50 px-4 pb-[max(0.65rem,var(--safe-bottom))] lg:hidden">
        <nav
          className="mx-auto max-w-[420px] rounded-[26px] border border-white/10 bg-[#111111]/92 p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.28)] backdrop-blur-2xl"
          aria-label={t("dashboard.navLabel")}
        >
          <div className="relative flex items-end justify-between gap-0.5">
            {MOBILE_TABS.map((item) => {
              const Icon = item.icon;
              const isMore = item.href === null;
              const active = isMore
                ? menuOpen || isMoreMenuActive(pathname)
                : isActive(pathname, item.href);
              const featured = "featured" in item && item.featured;

              const tabBody = (
                <>
                  {active && !featured && (
                    <motion.span
                      layoutId="decko-dock-active"
                      className="absolute inset-x-1 inset-y-0.5 rounded-[18px] bg-[var(--decko-accent)]/20"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span
                    className={cn(
                      "relative flex items-center justify-center transition-transform duration-200",
                      featured
                        ? cn(
                            "-mt-5 h-[52px] w-[52px] rounded-full border-4 border-[#111111] shadow-[0_8px_24px_rgba(226,255,76,0.45)]",
                            active
                              ? "bg-[var(--decko-accent)] text-[#111111] scale-105"
                              : "bg-[var(--decko-accent)] text-[#111111]"
                          )
                        : cn(
                            "h-9 w-9 rounded-2xl",
                            active ? "text-[var(--decko-accent)]" : "text-[#9CA3AF]"
                          )
                    )}
                  >
                    <Icon className={cn("shrink-0", featured ? "h-5 w-5" : "h-[18px] w-[18px]")} />
                  </span>
                  <span
                    className={cn(
                      "relative mt-0.5 max-w-full truncate text-[10px] font-medium leading-none",
                      active ? "text-white" : "text-[#737373]",
                      featured && "mt-1"
                    )}
                  >
                    {t(item.labelKey)}
                  </span>
                </>
              );

              const tabClass = cn(
                "relative flex min-h-[58px] min-w-0 flex-1 flex-col items-center justify-end px-1 pb-1 pt-2 touch-target",
                featured && "z-10"
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
                    {tabBody}
                  </button>
                );
              }

              return (
                <Link key={item.href} href={item.href} className={tabClass}>
                  {tabBody}
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
              className="absolute bottom-0 left-0 right-0 max-h-[min(82vh,680px)] overflow-hidden rounded-t-[28px] border-t border-[#E5E7EB] bg-white shadow-[0_-20px_60px_rgba(0,0,0,0.18)] safe-area-bottom"
            >
              <div className="flex justify-center pt-3">
                <span className="h-1 w-10 rounded-full bg-[#E5E7EB]" aria-hidden />
              </div>

              <div className="flex items-center justify-between px-5 pb-3 pt-2">
                <div>
                  <p className="text-base font-bold text-[#111111]">{t("nav.more")}</p>
                  <p className="text-xs text-[#6B7280]">{t("dashboard.clientPortal")}</p>
                </div>
                <button
                  type="button"
                  onClick={onMenuClose}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F4F6F8] text-[#6B7280] transition-colors hover:bg-[#ECEEF2] hover:text-[#111111]"
                  aria-label={t("common.close")}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="max-h-[calc(min(82vh,680px)-11rem)] overflow-y-auto px-4 pb-3">
                <div className="grid grid-cols-4 gap-2.5">
                  {MORE_MENU_ITEMS.map((item, i) => {
                    const Icon = item.icon;
                    const active = isActive(pathname, item.href);
                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.04 + i * 0.03 }}
                      >
                        <Link
                          href={item.href}
                          onClick={onMenuClose}
                          className="group flex flex-col items-center gap-2 rounded-2xl p-2 text-center"
                        >
                          <span
                            className={cn(
                              "flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-200 group-active:scale-95",
                              active
                                ? "bg-[var(--decko-accent)] text-[#111111] shadow-[0_8px_20px_rgba(226,255,76,0.35)]"
                                : "bg-[#F4F6F8] text-[#111111] group-hover:bg-[#ECEEF2]"
                            )}
                          >
                            <Icon className="h-5 w-5" />
                          </span>
                          <span
                            className={cn(
                              "line-clamp-2 text-[10px] font-medium leading-tight",
                              active ? "text-[#111111]" : "text-[#6B7280]"
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

              <div className="border-t border-[#ECEEF2] px-4 py-3">
                <button
                  type="button"
                  onClick={() => {
                    onMenuClose();
                    onLogout();
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FEF2F2] px-4 py-3.5 text-sm font-semibold text-[#DC2626] transition-colors active:bg-[#FEE2E2]"
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
