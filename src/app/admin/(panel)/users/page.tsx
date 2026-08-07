"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  fetchAdminUserDetails,
  moderateAdminUser,
  adjustAdminUserBalance,
  adjustAdminUserProfit,
} from "@/lib/admin-api";
import type { Profile } from "@/lib/admin-types";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { RefreshCw } from "@/components/icons";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [details, setDetails] = useState<Awaited<ReturnType<typeof fetchAdminUserDetails>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [acting, setActing] = useState(false);
  const [message, setMessage] = useState("");
  const [balanceAmount, setBalanceAmount] = useState("");
  const [balanceReason, setBalanceReason] = useState("");
  const [profitAmount, setProfitAmount] = useState("");
  const [profitNote, setProfitNote] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    setUsers((data as Profile[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function openUser(id: string) {
    setSelectedId(id);
    setDetailLoading(true);
    setMessage("");
    try {
      const d = await fetchAdminUserDetails(id);
      setDetails(d);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Could not load user");
      setDetails(null);
    }
    setDetailLoading(false);
  }

  async function handleModerate(action: "suspend" | "unsuspend") {
    if (!selectedId) return;
    setActing(true);
    try {
      await moderateAdminUser({
        userId: selectedId,
        action,
        reason: action === "suspend" ? "Suspended by team" : undefined,
      });
      setMessage(action === "suspend" ? "User suspended" : "User unsuspended");
      await openUser(selectedId);
      await load();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Action failed");
    }
    setActing(false);
  }

  async function handleProfit(mode: "profit" | "loss") {
    if (!selectedId || !profitAmount) return;
    const raw = Math.abs(parseFloat(profitAmount));
    if (!Number.isFinite(raw) || raw <= 0) {
      setMessage("Enter a valid profit or loss amount.");
      return;
    }
    setActing(true);
    try {
      const result = await adjustAdminUserProfit({
        userId: selectedId,
        amount: mode === "profit" ? raw : -raw,
        note: profitNote.trim() || undefined,
      });
      const total = Number(result.profit_total ?? 0);
      setMessage(
        `${mode === "profit" ? "Profit" : "Loss"} applied. Profit Total is now ${formatCurrency(total)}.`
      );
      setProfitAmount("");
      setProfitNote("");
      await openUser(selectedId);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Profit adjustment failed");
    }
    setActing(false);
  }

  async function handleBalance(direction: "credit" | "debit") {
    if (!selectedId || !balanceAmount || !balanceReason.trim()) return;
    setActing(true);
    try {
      await adjustAdminUserBalance({
        userId: selectedId,
        direction,
        amount: parseFloat(balanceAmount),
        reason: balanceReason.trim(),
      });
      setMessage(`Balance ${direction}ed`);
      setBalanceAmount("");
      setBalanceReason("");
      await openUser(selectedId);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Balance adjustment failed");
    }
    setActing(false);
  }

  return (
    <div className="space-y-5 max-w-6xl">
      <AdminPageHeader
        title="Users"
        subtitle="View accounts, balances, and moderation actions."
        action={
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
            Refresh
          </Button>
        }
      />

      {message && (
        <p className="text-sm text-text-secondary border border-border rounded-lg px-4 py-3 bg-bg-secondary">
          {message}
        </p>
      )}

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-0 overflow-hidden">
          {loading ? (
            <p className="p-8 text-center text-sm text-text-tertiary">Loading…</p>
          ) : (
            <ul className="divide-y divide-border max-h-[32rem] overflow-y-auto">
              {users.map((u) => (
                <li key={u.id}>
                  <button
                    type="button"
                    onClick={() => openUser(u.id)}
                    className={cn(
                      "w-full text-left p-4 hover:bg-bg-hover transition-colors",
                      selectedId === u.id && "bg-brand/5"
                    )}
                  >
                    <p className="font-medium text-text-primary truncate">{u.full_name || u.email}</p>
                    <p className="text-xs text-text-tertiary truncate">{u.email}</p>
                    <div className="flex gap-2 mt-2">
                      <StatusBadge status={u.kyc_status} />
                      {u.role === "admin" && <StatusBadge status="team" />}
                      {u.is_suspended && <StatusBadge status="suspended" />}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          {!selectedId ? (
            <p className="text-sm text-text-tertiary py-8 text-center">Select a user to view details.</p>
          ) : detailLoading ? (
            <p className="text-sm text-text-tertiary py-8 text-center">Loading user…</p>
          ) : details ? (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">{details.profile.full_name || details.profile.email}</h2>
                <p className="text-sm text-text-tertiary">{details.profile.email}</p>
                <p className="text-xs text-text-tertiary mt-1">Joined {formatDate(details.profile.created_at)}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-border p-3">
                  <p className="text-[11px] text-text-tertiary uppercase">Balance</p>
                  <p className="text-lg font-bold text-text-primary">{formatCurrency(details.balance)}</p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="text-[11px] text-text-tertiary uppercase">Profit Total</p>
                  <p
                    className={cn(
                      "text-lg font-bold",
                      (details.profit_total ?? 0) >= 0 ? "text-green" : "text-red"
                    )}
                  >
                    {formatCurrency(details.profit_total ?? 0)}
                  </p>
                </div>
                <div className="rounded-lg border border-border p-3 col-span-2 sm:col-span-1">
                  <p className="text-[11px] text-text-tertiary uppercase">Trades</p>
                  <p className="text-lg font-bold text-text-primary">{details.stats.trades_count}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {details.profile.is_suspended ? (
                  <Button size="sm" variant="outline" disabled={acting} onClick={() => handleModerate("unsuspend")}>
                    Unsuspend
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" disabled={acting} onClick={() => handleModerate("suspend")}>
                    Suspend
                  </Button>
                )}
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <p className="text-sm font-medium text-text-primary">Adjust profit / loss</p>
                <p className="text-xs text-text-tertiary">
                  Updates the user&apos;s Profit Total on the dashboard and credits or debits their balance.
                </p>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Amount (USD)"
                  value={profitAmount}
                  onChange={(e) => setProfitAmount(e.target.value)}
                  className="w-full h-10 px-3 bg-bg-primary border border-border rounded text-sm"
                />
                <input
                  type="text"
                  placeholder="Note (optional)"
                  value={profitNote}
                  onChange={(e) => setProfitNote(e.target.value)}
                  className="w-full h-10 px-3 bg-bg-primary border border-border rounded text-sm"
                />
                <div className="flex gap-2">
                  <Button size="sm" disabled={acting} onClick={() => handleProfit("profit")}>
                    Add profit
                  </Button>
                  <Button size="sm" variant="outline" disabled={acting} onClick={() => handleProfit("loss")}>
                    Add loss
                  </Button>
                </div>
              </div>

              {(details.profit_adjustments?.length ?? 0) > 0 && (
                <div className="border-t border-border pt-4 space-y-2">
                  <p className="text-sm font-medium text-text-primary">Recent profit adjustments</p>
                  <ul className="max-h-40 space-y-2 overflow-y-auto text-xs">
                    {details.profit_adjustments?.map((row) => (
                      <li
                        key={row.id}
                        className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2"
                      >
                        <span className={row.amount >= 0 ? "text-green font-semibold" : "text-red font-semibold"}>
                          {row.amount >= 0 ? "+" : ""}
                          {formatCurrency(row.amount)}
                        </span>
                        <span className="text-text-tertiary">{formatDate(row.created_at)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="border-t border-border pt-4 space-y-2">
                <p className="text-sm font-medium text-text-primary">Adjust balance</p>
                <input
                  type="number"
                  placeholder="Amount"
                  value={balanceAmount}
                  onChange={(e) => setBalanceAmount(e.target.value)}
                  className="w-full h-10 px-3 bg-bg-primary border border-border rounded text-sm"
                />
                <input
                  type="text"
                  placeholder="Reason"
                  value={balanceReason}
                  onChange={(e) => setBalanceReason(e.target.value)}
                  className="w-full h-10 px-3 bg-bg-primary border border-border rounded text-sm"
                />
                <div className="flex gap-2">
                  <Button size="sm" disabled={acting} onClick={() => handleBalance("credit")}>Credit</Button>
                  <Button size="sm" variant="outline" disabled={acting} onClick={() => handleBalance("debit")}>Debit</Button>
                </div>
              </div>
            </div>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
