import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import {
  DashboardSidebar,
  DashboardMobileFrame,
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
    <div className="dashboard-shell flex min-h-dvh">
      <DashboardSidebar
        userName={profile?.full_name ?? undefined}
        userEmail={user.email}
      />
      <div className="flex-1 flex flex-col min-h-dvh min-w-0">
        <DashboardMobileFrame
          userName={profile?.full_name ?? undefined}
          userEmail={user.email}
        >
          {children}
        </DashboardMobileFrame>
      </div>
    </div>
  );
}
