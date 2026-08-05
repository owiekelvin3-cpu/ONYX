import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import {
  DashboardSidebar,
  DashboardTopBar,
  DashboardMobileNav,
} from "@/components/dashboard/Sidebar";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <DashboardTopBar
          userName={profile?.full_name ?? undefined}
          userEmail={user.email}
        />
        <main className="flex-1 p-3 sm:p-4 lg:p-5 pb-[calc(3.5rem+var(--safe-bottom))] lg:pb-5 overflow-auto bg-bg-primary min-w-0">
          {children}
        </main>
        <DashboardMobileNav />
      </div>
    </div>
  );
}
