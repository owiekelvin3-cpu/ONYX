"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Shield } from "@/components/icons";

export function AdminNavLink() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
      setIsAdmin(data?.role === "admin");
    });
  }, []);

  if (!isAdmin) return null;

  return (
    <Link
      href="/admin"
      className="flex items-center gap-2.5 px-3 py-2.5 rounded text-[13px] text-brand hover:bg-brand/10 transition-colors mt-2 border border-brand/20"
    >
      <Shield className="w-4 h-4 shrink-0" />
      Team Console
    </Link>
  );
}
