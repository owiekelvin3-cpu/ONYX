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
];

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
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
          "fixed inset-y-0 left-0 z-50 w-[min(18rem,88vw)] bg-bg-secondary border-r border-border flex flex-col transition-transform duration-200 ease-out lg:static lg:translate-x-0 safe-area-top safe-area-bottom safe-area-x",
          menuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-14 flex items-center justify-between px-4 border-b border-border">
          <Link href="/admin" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
            <OnyxLogo size={24} />
            <span className="font-bold text-sm">{BRAND.name}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand bg-brand/10 px-2 py-0.5 rounded">
              Team
            </span>
          </Link>
          <button type="button" className="lg:hidden p-2 text-text-tertiary" onClick={() => setMenuOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {ADMIN_LINKS.map((link) => {
            const Icon = link.icon;
            const active = isActive(pathname, link.href, link.exact);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] transition-colors",
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

        <div className="p-3 border-t border-border space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 text-[13px] text-text-tertiary hover:text-text-primary"
          >
            <LayoutDashboard className="w-4 h-4" />
            User dashboard
          </Link>
          <div className="px-3 py-2">
            <p className="text-sm font-medium text-text-primary truncate">{adminName ?? "Team member"}</p>
            <p className="text-xs text-text-tertiary truncate">{adminEmail}</p>
          </div>
          <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
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

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 flex items-center gap-3 px-3 sm:px-4 border-b border-border bg-bg-secondary/80 backdrop-blur sticky top-0 z-30 safe-area-top safe-area-x">
          <button type="button" className="lg:hidden p-2 text-text-secondary" onClick={() => setMenuOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <p className="text-sm font-medium text-text-secondary">Team Console</p>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-x-hidden overflow-y-auto min-w-0">{children}</main>
      </div>
    </div>
  );
}
