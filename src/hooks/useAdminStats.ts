"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export interface AdminStats {
  totalUsers: number;
  pendingKyc: number;
  pendingDeposits: number;
  pendingWithdrawals: number;
  totalDeposits: number;
  totalWithdrawals: number;
  activeTrades: number;
}

const EMPTY: AdminStats = {
  totalUsers: 0,
  pendingKyc: 0,
  pendingDeposits: 0,
  pendingWithdrawals: 0,
  totalDeposits: 0,
  totalWithdrawals: 0,
  activeTrades: 0,
};

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats>(EMPTY);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const [users, kyc, deposits, withdrawals, trades] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("kyc_submissions").select("id", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("deposits").select("amount, status"),
      supabase.from("withdrawals").select("amount, status"),
      supabase.from("trades").select("id", { count: "exact", head: true }).in("status", ["pending", "approved"]),
    ]);

    const depData = deposits.data ?? [];
    const wData = withdrawals.data ?? [];

    setStats({
      totalUsers: users.count ?? 0,
      pendingKyc: kyc.count ?? 0,
      pendingDeposits: depData.filter((d) => d.status === "pending").length,
      pendingWithdrawals: wData.filter((w) => w.status === "pending").length,
      totalDeposits: depData
        .filter((d) => d.status === "completed")
        .reduce((s, d) => s + Number(d.amount), 0),
      totalWithdrawals: wData
        .filter((w) => w.status === "completed")
        .reduce((s, w) => s + Number(w.amount), 0),
      activeTrades: trades.count ?? 0,
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { stats, loading, refresh };
}
