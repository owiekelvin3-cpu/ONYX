import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { ADMIN_AUTH_COOKIE } from "@/lib/auth-guards";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, email")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  const cookieStore = await cookies();
  if (cookieStore.get(ADMIN_AUTH_COOKIE)?.value !== "1") {
    redirect("/admin/login");
  }

  return (
    <AdminShell adminName={profile.full_name ?? undefined} adminEmail={profile.email ?? user.email}>
      {children}
    </AdminShell>
  );
}
