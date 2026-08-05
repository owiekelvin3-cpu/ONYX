"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { BRAND } from "@/lib/constants";
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
  Menu,
  X,
  MoreHorizontal,
} from "@/components/icons";
import { AdminNavLink } from "@/components/admin/AdminNavLink";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Trade", href: "/dashboard/trade", icon: TrendingUp },
  { label: "Portfolio", href: "/dashboard/portfolio", icon: Wallet },
  { label: "Deposit", href: "/dashboard/deposit", icon: ArrowDownToLine },
  { label: "Withdraw", href: "/dashboard/withdraw", icon: ArrowUpFromLine },
  { label: "AI Trading", href: "/dashboard/ai-trading", icon: Bot },
  { label: "Copy Trading", href: "/dashboard/copy-trading", icon: Users },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const MOBILE_TABS = [
  { label: "Home", href: "/dashboard", icon: LayoutDashboard },
  { label: "Trade", href: "/dashboard/trade", icon: TrendingUp },
  { label: "Portfolio", href: "/dashboard/portfolio", icon: Wallet },
  { label: "Deposit", href: "/dashboard/deposit", icon: ArrowDownToLine },
  { label: "More", href: "/dashboard/settings", icon: MoreHorizontal },
];

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
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
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2.5 rounded text-[13px] transition-colors",
              active
                ? "bg-bg-hover text-brand font-medium"
                : "text-text-secondary hover:text-text-primary hover:bg-bg-hover"
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="hidden lg:flex flex-col w-[220px] bg-bg-secondary border-r border-border h-dvh sticky top-0 shrink-0">
      <div className="h-14 flex items-center px-5 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <Logo size={22} />
          <span className="font-bold text-sm">{BRAND.name}</span>
        </Link>
      </div>

      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        <NavLinks pathname={pathname} />
        <AdminNavLink />
      </nav>

      <div className="p-2 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2 rounded text-[13px] text-text-tertiary hover:text-red w-full transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>
    </aside>
  );
}

export function DashboardMobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-bg-secondary/95 backdrop-blur-md border-t border-border safe-area-x">
      <div className="flex items-stretch justify-around min-h-[56px] pb-[var(--safe-bottom)]">
        {MOBILE_TABS.map((item) => {
          const Icon = item.icon;
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 flex-1 min-w-0 px-1 text-[10px] transition-colors touch-target",
                active ? "text-brand" : "text-text-tertiary"
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="truncate max-w-full">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function DashboardTopBar({
  userName,
  userEmail,
}: {
  userName?: string;
  userEmail?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  useBodyScrollLock(menuOpen);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      <header className="h-14 border-b border-border bg-bg-primary flex items-center justify-between px-3 sm:px-4 lg:px-5 sticky top-0 z-40 safe-area-top safe-area-x">
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden p-1.5 text-text-secondary hover:text-text-primary cursor-pointer"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link href="/" className="flex items-center gap-2 lg:hidden">
            <Logo size={20} />
            <span className="font-bold text-sm">{BRAND.name}</span>
          </Link>
        </div>

        <div className="hidden lg:block" />

        <div className="flex items-center gap-3">
          <Link
            href="/help"
            className="relative p-1.5 text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
            aria-label="Notifications and help"
          >
            <Bell className="w-[18px] h-[18px]" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red rounded-full" />
          </Link>
          <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-bg-hover flex items-center justify-center text-[11px] font-bold text-text-secondary">
            {(userName || userEmail || "U").charAt(0).toUpperCase()}
          </div>
          <span className="hidden sm:block text-[13px] text-text-secondary">
            {userName || userEmail?.split("@")[0] || "User"}
          </span>
          </div>
        </div>
      </header>

      {/* Mobile slide-out menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[min(280px,88vw)] bg-bg-secondary border-r border-border flex flex-col safe-area-top safe-area-bottom safe-area-x">
            <div className="h-14 flex items-center justify-between px-4 border-b border-border">
              <Link
                href="/"
                className="flex items-center gap-2"
                onClick={() => setMenuOpen(false)}
              >
                <Logo size={22} />
                <span className="font-bold text-sm">{BRAND.name}</span>
              </Link>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-1.5 text-text-tertiary cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
              <NavLinks
                pathname={pathname}
                onNavigate={() => setMenuOpen(false)}
              />
              <AdminNavLink />
            </nav>
            <div className="p-2 border-t border-border">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded text-[13px] text-text-tertiary hover:text-red w-full cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Log Out
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
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="6" fill="#F0B90B" />
      <path d="M8 18L14 8L20 18H16.5L14 14.5L11.5 18H8Z" fill="#0B0E11" />
    </svg>
  );
}
