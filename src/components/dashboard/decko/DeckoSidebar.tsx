"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { OnyxLogo } from "@/components/brand/OnyxLogo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { NotificationBell } from "@/components/dashboard/NotificationBell";
import {
  ArrowRight,
  Bot,
  FileCheck,
  HelpCircle,
  LayoutDashboard,
  LineChart,
  LogOut,
  Menu,
  Receipt,
  Search,
  Settings,
  Shield,
  TrendingUp,
  Users,
  Wallet,
  X,
} from "@/components/icons";
import { createClient } from "@/lib/supabase/client";
import { clearAdminSession } from "@/lib/auth-guards";

const MAIN_MENU = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { label: "Spot Trading", href: "/dashboard/trade", icon: TrendingUp },
  { label: "Portfolio", href: "/dashboard/portfolio", icon: Wallet },
  { label: "Transactions", href: "/dashboard/transactions", icon: Receipt },
  { label: "AI Trading", href: "/dashboard/ai-trading", icon: Bot },
  { label: "Copy Trading", href: "/dashboard/copy-trading", icon: Users },
  { label: "Market Analytics", href: "/dashboard/analytics", icon: LineChart },
] as const;

const SETTINGS_MENU = [
  { label: "KYC Verification", href: "/dashboard/kyc", icon: FileCheck },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
  { label: "Security & Privacy", href: "/dashboard/settings/account", icon: Shield },
  { label: "Help Center", href: "/dashboard/support", icon: HelpCircle },
] as const;

const MOBILE_PAGE_TITLES: Array<{ prefix: string; title: string; exact?: boolean }> = [
  { prefix: "/dashboard/trade", title: "Spot Trading" },
  { prefix: "/dashboard/portfolio", title: "Portfolio" },
  { prefix: "/dashboard/transactions", title: "Transactions" },
  { prefix: "/dashboard/analytics", title: "Market Analytics" },
  { prefix: "/dashboard/copy-trading", title: "Copy Trading" },
  { prefix: "/dashboard/ai-trading", title: "AI Trading" },
  { prefix: "/dashboard/deposit", title: "Deposit" },
  { prefix: "/dashboard/withdraw", title: "Withdraw" },
  { prefix: "/dashboard/notifications", title: "Notifications" },
  { prefix: "/dashboard/kyc", title: "KYC Verification" },
  { prefix: "/dashboard/support", title: "Help Center" },
  { prefix: "/dashboard/settings", title: "Settings" },
  { prefix: "/dashboard/signals", title: "Signals" },
  { prefix: "/dashboard", title: "Overview", exact: true },
];

function navActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function getMobilePageTitle(pathname: string) {
  const match = MOBILE_PAGE_TITLES.find((item) =>
    item.exact ? pathname === item.prefix : pathname === item.prefix || pathname.startsWith(`${item.prefix}/`)
  );
  return match?.title ?? "Dashboard";
}

export function DeckoSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();

  async function logout() {
    const supabase = createClient();
    await clearAdminSession();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="decko-sidebar hidden w-[248px] shrink-0 flex-col px-4 py-5 lg:flex">
      <Link href="/dashboard" className="mb-6 flex items-center gap-2.5 px-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--decko-accent)]">
          <OnyxLogo size={22} />
        </span>
        <span className="text-lg font-bold text-[var(--decko-sidebar-text)]">{BRAND.name}</span>
      </Link>

      <div className="relative mb-6">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--decko-sidebar-muted)]" />
        <input
          type="search"
          placeholder="Search here..."
          className="h-10 w-full rounded-xl border border-[var(--decko-sidebar-border)] bg-[var(--decko-sidebar-input)] pl-10 pr-12 text-sm text-[var(--decko-sidebar-text)] placeholder:text-[var(--decko-sidebar-muted)] outline-none focus:border-[var(--decko-accent)]/40"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-[var(--decko-sidebar-hover)] px-1.5 py-0.5 text-[10px] text-[var(--decko-sidebar-muted)]">
          ⌘K
        </span>
      </div>

      <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--decko-sidebar-muted)]">
        Main Menu
      </p>
      <nav className="space-y-1">
        {MAIN_MENU.map((item) => {
          const Icon = item.icon;
          const active = navActive(pathname, item.href, "exact" in item ? item.exact : false);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-[var(--decko-accent)] text-[var(--decko-accent-text)] shadow-[0_8px_24px_rgba(212,255,66,0.25)]"
                  : "text-[var(--decko-sidebar-muted)] hover:bg-[var(--decko-sidebar-hover)] hover:text-[var(--decko-sidebar-text)]"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <p className="mb-2 mt-6 px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--decko-sidebar-muted)]">
        Settings
      </p>
      <nav className="space-y-1">
        {SETTINGS_MENU.map((item) => {
          const Icon = item.icon;
          const active = navActive(pathname, item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-[var(--decko-sidebar-hover)] text-[var(--decko-sidebar-text)]"
                  : "text-[var(--decko-sidebar-muted)] hover:bg-[var(--decko-sidebar-hover)] hover:text-[var(--decko-sidebar-text)]"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3 pt-6">
        <Link
          href="/dashboard/deposit"
          className="block rounded-2xl border border-[var(--decko-sidebar-border)] bg-[var(--decko-sidebar-surface)] p-4 transition-transform hover:scale-[1.02]"
        >
          <p className="text-[11px] uppercase tracking-wide text-[var(--decko-sidebar-muted)]">Upcoming Event</p>
          <p className="mt-1 text-sm font-semibold text-[var(--decko-sidebar-text)]">Fund your account</p>
          <span className="mt-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--decko-accent)] text-[var(--decko-accent-text)]">
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </Link>

        <ThemeToggle className="w-full justify-start rounded-xl border border-[var(--decko-sidebar-border)] bg-[var(--decko-sidebar-surface)] px-3 text-[var(--decko-sidebar-text)] hover:bg-[var(--decko-sidebar-hover)]" showLabel />

        <button
          type="button"
          onClick={() => void logout()}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red transition-colors hover:bg-[var(--decko-sidebar-hover)]"
        >
          <LogOut className="h-4 w-4" />
          {t("common.signOut")}
        </button>
      </div>
    </aside>
  );
}

export function DeckoMobileNavDrawer({
  open,
  onClose,
  onLogout,
}: {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
}) {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true">
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
            onClick={onClose}
            aria-label={t("common.close")}
          />

          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 36 }}
            className="decko-sidebar absolute left-0 top-0 flex h-full w-[min(300px,88vw)] flex-col px-4 py-5 safe-area-top safe-area-bottom safe-area-x"
          >
            <div className="mb-5 flex items-center justify-between">
              <Link href="/dashboard" onClick={onClose} className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--decko-accent)]">
                  <OnyxLogo size={20} />
                </span>
                <span className="text-base font-bold text-[var(--decko-sidebar-text)]">{BRAND.name}</span>
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--decko-sidebar-hover)] text-[var(--decko-sidebar-text)]"
                aria-label={t("common.close")}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--decko-sidebar-muted)]">
                Main Menu
              </p>
              <nav className="space-y-1">
                {MAIN_MENU.map((item) => {
                  const Icon = item.icon;
                  const active = navActive(pathname, item.href, "exact" in item ? item.exact : false);
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors",
                        active
                          ? "bg-[var(--decko-accent)] text-[var(--decko-accent-text)]"
                          : "text-[var(--decko-sidebar-muted)] hover:bg-[var(--decko-sidebar-hover)] hover:text-[var(--decko-sidebar-text)]"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <p className="mb-2 mt-5 px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--decko-sidebar-muted)]">
                Settings
              </p>
              <nav className="space-y-1">
                {SETTINGS_MENU.map((item) => {
                  const Icon = item.icon;
                  const active = navActive(pathname, item.href);
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors",
                        active
                          ? "bg-[var(--decko-sidebar-hover)] text-[var(--decko-sidebar-text)]"
                          : "text-[var(--decko-sidebar-muted)] hover:bg-[var(--decko-sidebar-hover)] hover:text-[var(--decko-sidebar-text)]"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="mt-4 space-y-3 border-t border-[var(--decko-sidebar-border)] pt-4">
              <Link
                href="/dashboard/deposit"
                onClick={onClose}
                className="flex items-center justify-between rounded-2xl border border-[var(--decko-sidebar-border)] bg-[var(--decko-sidebar-surface)] px-4 py-3"
              >
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-[var(--decko-sidebar-muted)]">Fund account</p>
                  <p className="text-sm font-semibold text-[var(--decko-sidebar-text)]">Deposit now</p>
                </div>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--decko-accent)] text-[var(--decko-accent-text)]">
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>

              <ThemeToggle className="w-full justify-start rounded-xl border border-[var(--decko-sidebar-border)] bg-[var(--decko-sidebar-surface)] px-3 text-[var(--decko-sidebar-text)]" showLabel />

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red transition-colors hover:bg-[var(--decko-sidebar-hover)]"
              >
                <LogOut className="h-4 w-4" />
                {t("common.signOut")}
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

export function DeckoMobileTopBar({
  userName,
  userEmail,
  avatarUrl,
  onOpenDrawer,
}: {
  userName?: string;
  userEmail?: string;
  avatarUrl?: string;
  onOpenDrawer: () => void;
}) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const initial = (userName || userEmail || "U").charAt(0).toUpperCase();
  const pageTitle = getMobilePageTitle(pathname);

  return (
    <header className="decko-mobile-bar sticky top-0 z-40 flex items-center gap-2 border-b px-4 py-2.5 lg:hidden safe-area-top safe-area-x">
      <button
        type="button"
        onClick={onOpenDrawer}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-bg-tertiary text-text-primary transition-colors active:bg-bg-hover"
        aria-label={t("dashboard.openSidebar")}
      >
        <Menu className="h-4 w-4" />
      </button>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] font-medium uppercase tracking-wide text-text-tertiary">{BRAND.name}</p>
        <p className="truncate text-sm font-semibold text-text-primary">{pageTitle}</p>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <NotificationBell className="h-10 w-10 rounded-xl border border-border bg-bg-tertiary" />
        <Link
          href="/dashboard/settings"
          className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-border bg-bg-tertiary"
          aria-label={t("dashboard.settings")}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-xs font-bold text-text-primary">{initial}</span>
          )}
        </Link>
      </div>
    </header>
  );
}
