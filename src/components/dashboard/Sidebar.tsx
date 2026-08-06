"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { BRAND } from "@/lib/constants";
import { clearAdminAuthCookie } from "@/lib/auth-guards";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  TrendingUp,
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  Settings,
  LogOut,
  Bell,
  Bot,
  Users,
  Comments,
  Menu,
  X,
  MoreHorizontal,
} from "@/components/icons";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Trade", href: "/dashboard/trade", icon: TrendingUp },
      { label: "Portfolio", href: "/dashboard/portfolio", icon: Wallet },
    ],
  },
  {
    label: "Cash",
    items: [
      { label: "Deposit", href: "/dashboard/deposit", icon: ArrowDownToLine },
      { label: "Withdraw", href: "/dashboard/withdraw", icon: ArrowUpFromLine },
    ],
  },
  {
    label: "Tools",
    items: [
      { label: "AI Trading", href: "/dashboard/ai-trading", icon: Bot },
      { label: "Copy Trading", href: "/dashboard/copy-trading", icon: Users },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Support", href: "/dashboard/support", icon: Comments },
      { label: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
] as const;

const MOBILE_TABS = [
  { label: "Home", href: "/dashboard", icon: LayoutDashboard },
  { label: "Trade", href: "/dashboard/trade", icon: TrendingUp },
  { label: "Portfolio", href: "/dashboard/portfolio", icon: Wallet },
  { label: "Deposit", href: "/dashboard/deposit", icon: ArrowDownToLine },
  { label: "More", href: null, icon: MoreHorizontal },
] as const;

const MORE_MENU_PATHS = [
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

/** Hide bottom tabs on immersive full-screen views (e.g. support chat). */
export function shouldHideMobileBottomNav(pathname: string) {
  return pathname.startsWith("/dashboard/support");
}

function NavLinks({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <>
      {NAV_GROUPS.map((group) => (
        <div key={group.label} className="mb-4 last:mb-0">
          <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-text-tertiary/80">
            {group.label}
          </p>
          <div className="space-y-0.5">
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] transition-all",
                    active
                      ? "dashboard-nav-active text-brand font-semibold"
                      : "text-text-secondary hover:text-text-primary hover:bg-bg-hover/70"
                  )}
                >
                  <Icon className="w-[17px] h-[17px] shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
}

export function DashboardSidebar({
  userName,
  userEmail,
}: {
  userName?: string;
  userEmail?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const initial = (userName || userEmail || "U").charAt(0).toUpperCase();

  async function handleLogout() {
    const supabase = createClient();
    clearAdminAuthCookie();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="dashboard-sidebar hidden lg:flex flex-col w-[240px] border-r border-border h-dvh sticky top-0 shrink-0 z-10">
      <div className="h-16 flex items-center px-5 border-b border-border/80">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Logo size={24} />
          <span className="font-bold text-sm tracking-tight text-text-primary group-hover:text-brand transition-colors">
            {BRAND.name}
          </span>
        </Link>
      </div>

      <nav className="flex-1 py-4 px-2.5 overflow-y-auto overscroll-contain">
        <NavLinks pathname={pathname} />
      </nav>

      <div className="p-3 border-t border-border/80 space-y-2">
        <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-bg-primary/40 px-3 py-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand/30 to-brand/5 border border-brand/20 flex items-center justify-center text-xs font-bold text-brand shrink-0">
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium text-text-primary truncate">
              {userName || userEmail?.split("@")[0] || "Trader"}
            </p>
            <p className="text-[11px] text-text-tertiary truncate">{userEmail ?? "Account"}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] text-text-tertiary hover:text-red hover:bg-red/5 w-full transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>
    </aside>
  );
}

export function DashboardMobileFrame({
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
    <>
      <header className="h-14 lg:h-16 border-b border-border/80 bg-bg-primary/90 backdrop-blur-xl flex items-center justify-between px-3 sm:px-4 lg:px-6 sticky top-0 z-40 safe-area-top safe-area-x shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            className="lg:hidden p-2 -ml-1 text-text-secondary hover:text-text-primary cursor-pointer rounded-lg active:bg-bg-hover"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link href="/" className="flex items-center gap-2 lg:hidden min-w-0">
            <Logo size={20} />
            <span className="font-bold text-sm truncate">{BRAND.name}</span>
          </Link>
          <p className="hidden lg:block text-sm font-medium text-text-tertiary">
            Trading terminal
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            href="/dashboard/support"
            className="relative p-2 text-text-tertiary hover:text-text-primary transition-colors rounded-lg hover:bg-bg-hover"
            aria-label="Notifications"
          >
            <Bell className="w-[18px] h-[18px]" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red rounded-full" />
          </Link>
          <div className="flex items-center gap-2 min-w-0 pl-1 border-l border-border/60">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand/25 to-brand/5 border border-brand/15 flex items-center justify-center text-[11px] font-bold text-brand shrink-0">
              {(userName || userEmail || "U").charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:block text-[13px] text-text-secondary truncate max-w-[140px]">
              {userName || userEmail?.split("@")[0] || "User"}
            </span>
          </div>
        </div>
      </header>

      <main
        className={cn(
          "relative z-[1] flex-1 p-3 sm:p-4 lg:p-6 overflow-x-hidden overflow-y-auto min-w-0",
          hideBottomNav
            ? "pb-[max(0.75rem,var(--safe-bottom))] lg:pb-6"
            : "pb-[calc(4.25rem+var(--safe-bottom))] lg:pb-6"
        )}
      >
        {children}
      </main>

      {!hideBottomNav && (
        <nav
          className="lg:hidden fixed bottom-0 inset-x-0 z-50 border-t border-border/80 bg-bg-secondary/95 backdrop-blur-xl safe-area-x"
          aria-label="Primary"
        >
          <div className="flex items-stretch justify-around px-1 pt-1.5 pb-[max(0.35rem,var(--safe-bottom))]">
            {MOBILE_TABS.map((item) => {
              const Icon = item.icon;
              const isMore = item.href === null;
              const active = isMore
                ? menuOpen || isMoreMenuActive(pathname)
                : isActive(pathname, item.href);

              const className = cn(
                "relative flex flex-col items-center justify-center gap-0.5 flex-1 min-w-0 max-w-[80px] py-2 px-1 text-[10px] leading-tight transition-colors rounded-xl",
                active ? "text-brand" : "text-text-tertiary active:text-text-secondary"
              );

              const content = (
                <>
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-xl transition-colors",
                      active ? "bg-brand/10" : ""
                    )}
                  >
                    <Icon className="w-[18px] h-[18px] shrink-0" />
                  </span>
                  <span className="truncate w-full text-center font-medium">{item.label}</span>
                </>
              );

              if (isMore) {
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setMenuOpen(true)}
                    className={className}
                    aria-label="Open menu"
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
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <button
            type="button"
            className="absolute inset-0 bg-black/60 mobile-nav-backdrop"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          />
          <div className="dashboard-sidebar absolute left-0 top-0 h-full w-[min(300px,88vw)] border-r border-border flex flex-col safe-area-top safe-area-bottom safe-area-x mobile-nav-drawer">
            <div className="h-14 flex items-center justify-between px-4 border-b border-border/80 shrink-0">
              <Link
                href="/"
                className="flex items-center gap-2 min-w-0"
                onClick={() => setMenuOpen(false)}
              >
                <Logo size={22} />
                <span className="font-bold text-sm truncate">{BRAND.name}</span>
              </Link>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="p-2 -mr-1 text-text-tertiary hover:text-text-primary cursor-pointer rounded-lg active:bg-bg-hover"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 p-3 overflow-y-auto overscroll-contain">
              <NavLinks pathname={pathname} onNavigate={() => setMenuOpen(false)} />
            </nav>
            <div className="p-3 border-t border-border/80 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-2.5 px-3 py-3 rounded-lg text-[14px] text-text-tertiary hover:text-red hover:bg-red/5 w-full cursor-pointer transition-colors"
              >
                <LogOut className="w-[18px] h-[18px]" />
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Logo({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden>
      <rect width="28" height="28" rx="6" fill="#F0B90B" />
      <path d="M8 18L14 8L20 18H16.5L14 14.5L11.5 18H8Z" fill="#0B0E11" />
    </svg>
  );
}
