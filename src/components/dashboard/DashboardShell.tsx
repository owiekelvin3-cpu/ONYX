"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { clearAdminSession } from "@/lib/auth-guards";
import { cn } from "@/lib/utils";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { NotificationProvider } from "@/components/notifications/NotificationProvider";
import {
  DeckoMobileTopBar,
  DeckoSidebar,
} from "@/components/dashboard/decko/DeckoSidebar";
import { DeckoMobileDock } from "@/components/dashboard/decko/DeckoMobileDock";

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
  const [menuOpen, setMenuOpen] = useState(false);
  const hideBottomNav = shouldHideMobileBottomNav(pathname);
  useBodyScrollLock(menuOpen);

  async function handleLogout() {
    const supabase = createClient();
    await clearAdminSession();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <NotificationProvider userId={userId}>
      <div className="decko-shell flex min-h-dvh">
        <DeckoSidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <DeckoMobileTopBar
            userName={userName}
            userEmail={userEmail}
            avatarUrl={avatarUrl}
          />

          <main
            className={cn(
              "decko-main relative z-[1] flex-1 overflow-y-auto px-4 py-4 safe-area-x sm:px-5 sm:py-6 lg:px-8",
              hideBottomNav
                ? "pb-[max(0.75rem,var(--safe-bottom))]"
                : "pb-[calc(5.75rem+var(--safe-bottom))] lg:pb-8"
            )}
          >
            {children}
          </main>

          {!hideBottomNav && (
            <DeckoMobileDock
              menuOpen={menuOpen}
              onMenuOpen={() => setMenuOpen(true)}
              onMenuClose={() => setMenuOpen(false)}
              onLogout={() => void handleLogout()}
            />
          )}
        </div>
      </div>
    </NotificationProvider>
  );
}
