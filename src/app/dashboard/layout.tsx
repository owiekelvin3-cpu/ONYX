import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  DashboardSidebar,
  DashboardTopBar,
  DashboardMobileNav,
} from "@/components/dashboard/Sidebar";

export default async function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: { full_name: string | null } | null = null;

  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle();
    profile = data;
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <DashboardTopBar
          userName={profile?.full_name ?? undefined}
          userEmail={user?.email}
          isGuest={!user}
        />
        {!user && (
          <div className="bg-brand/10 border-b border-brand/20 px-3 sm:px-4 py-2.5 flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2">
            <p className="text-[11px] sm:text-[12px] text-text-secondary leading-snug">
              Browsing as guest. Sign in to access your real portfolio.
            </p>
            <Link
              href="/register"
              className="text-[12px] font-semibold text-brand hover:underline shrink-0 touch-target flex items-center"
            >
              Sign Up Free
            </Link>
          </div>
        )}
        <main className="flex-1 p-3 sm:p-4 lg:p-5 pb-[calc(3.5rem+var(--safe-bottom))] lg:pb-5 overflow-auto bg-bg-primary min-w-0">
          {children}
        </main>
        <DashboardMobileNav />
      </div>
    </div>
  );
}
