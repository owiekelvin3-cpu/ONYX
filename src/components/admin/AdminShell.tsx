"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { OnyxLogo } from "@/components/brand/OnyxLogo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { clearAdminSession } from "@/lib/auth-guards";
import { createClient } from "@/lib/supabase/client";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { Button } from "@/components/ui/Button";
import {
  LayoutDashboard,
  Users,
  FileCheck,
  ArrowDownToLine,
  ArrowUpFromLine,
  Comments,
  Settings,
  LogOut,
  Menu,
  X,
  Bot,
  Zap,
} from "@/components/icons";

const ADMIN_LINKS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/kyc", label: "KYC Review", icon: FileCheck },
  { href: "/admin/deposits", label: "Deposits", icon: ArrowDownToLine },
  { href: "/admin/withdrawals", label: "Withdrawals", icon: ArrowUpFromLine },
  { href: "/admin/ai-trading", label: "AI Trading", icon: Bot },
  { href: "/admin/signals", label: "Signals", icon: Zap },
  { href: "/admin/support", label: "Support", icon: Comments },
  { href: "/admin/settings", label: "Settings", icon: Settings },
] as const;

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function getPageTitle(pathname: string): string {
  const match = ADMIN_LINKS.find((link) =>
    isActive(pathname, link.href, "exact" in link ? link.exact : undefined)
  );
  return match?.label ?? "Team Console";
}

export function AdminShell({
  children,
  adminName,
  adminEmail,
}: {
  children: React.ReactNode;
  adminName?: string;
  adminEmail?: string;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  useBodyScrollLock(menuOpen);
  const pageTitle = getPageTitle(pathname);

  async function handleLogout() {
    const supabase = createClient();
    await clearAdminSession();
    await supabase.auth.signOut();
    window.location.assign("/admin/login");
  }

  return (
    <div className="min-h-dvh bg-bg-primary flex">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[min(18rem,92vw)] bg-bg-secondary border-r border-border flex flex-col transition-transform duration-200 ease-out lg:static lg:translate-x-0 safe-area-top safe-area-bottom safe-area-x",
          menuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 min-h-14 items-center justify-between px-4 border-b border-border">
          <Link href="/admin" className="flex min-w-0 items-center gap-2" onClick={() => setMenuOpen(false)}>
            <OnyxLogo size={24} />
            <span className="truncate font-bold text-sm">{BRAND.name}</span>
            <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-brand bg-brand/10 px-2 py-0.5 rounded">
              Team
            </span>
          </Link>
          <button
            type="button"
            className="lg:hidden flex h-11 w-11 items-center justify-center rounded-lg text-text-tertiary hover:bg-bg-hover"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {ADMIN_LINKS.map((link) => {
            const Icon = link.icon;
            const active = isActive(pathname, link.href, "exact" in link ? link.exact : undefined);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "flex min-h-11 items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] transition-colors",
                  active
                    ? "bg-nav-active text-nav-active-text font-medium"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-hover"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-2 border-t border-border p-3">
          <Link
            href="/dashboard"
            className="flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-[13px] text-text-tertiary hover:bg-bg-hover hover:text-text-primary"
          >
            <LayoutDashboard className="w-4 h-4" />
            User dashboard
          </Link>
          <div className="px-3 py-2">
            <p className="truncate text-sm font-medium text-text-primary">{adminName ?? "Team member"}</p>
            <p className="truncate text-xs text-text-tertiary">{adminEmail}</p>
          </div>
          <Button variant="outline" size="sm" className="w-full min-h-10" onClick={handleLogout}>
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </Button>
        </div>
      </aside>

      {menuOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 min-h-14 items-center gap-2 border-b border-border bg-bg-secondary/90 px-3 backdrop-blur safe-area-top safe-area-x sm:gap-3 sm:px-4">
          <button
            type="button"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-text-secondary hover:bg-bg-hover lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-text-primary lg:hidden">{pageTitle}</p>
            <p className="hidden truncate text-sm font-medium text-text-secondary lg:block">Team Console</p>
          </div>
          <div className="shrink-0">
            <ThemeToggle />
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 min-w-0 overflow-x-hidden overflow-y-auto p-3 safe-area-x safe-area-bottom sm:p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
