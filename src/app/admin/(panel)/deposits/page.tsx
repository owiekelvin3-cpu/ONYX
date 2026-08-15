"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { approveDeposit, rejectDeposit } from "@/lib/admin-api";
import type { DepositRow } from "@/lib/admin-types";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminFilterBar, AdminListActions } from "@/components/admin/AdminFilterBar";
import { StatusBadge, isPending } from "@/components/admin/StatusBadge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatDepositMethod } from "@/lib/deposit-options";
import { parseDepositNotes } from "@/lib/deposit-details";
import { RefreshCw } from "@/components/icons";
import { formatCurrency, formatDate, cn } from "@/lib/utils";

type Filter = "all" | "pending" | "completed" | "rejected";

export default function AdminDepositsPage() {
  const [deposits, setDeposits] = useState<DepositRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [acting, setActing] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("deposits")
      .select("*, profiles(email, full_name)")
      .order("created_at", { ascending: false });
    if (!error) setDeposits((data as DepositRow[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleApprove(d: DepositRow) {
    setActing(d.id);
    setMessage("");
    try {
      await approveDeposit(d.id, d.user_id, d.amount);
      setMessage(`Approved ${formatCurrency(d.amount)}`);
      await load();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Action failed");
    }
    setActing(null);
  }

  async function handleReject(id: string) {
    setActing(id);
    setMessage("");
    try {
      await rejectDeposit(id);
      setMessage("Deposit rejected");
      await load();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Action failed");
    }
    setActing(null);
  }

  const filtered = deposits.filter((d) => {
    if (filter === "pending") return d.status === "pending";
    if (filter === "completed") return d.status === "completed" || d.status === "approved";
    if (filter === "rejected") return d.status === "rejected";
    return true;
  });

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "completed", label: "Completed" },
    { key: "rejected", label: "Rejected" },
  ];

  return (
    <div className="space-y-5 max-w-5xl">
      <AdminPageHeader
        title="Deposits"
        subtitle="Approve or reject user deposit requests."
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

      <AdminFilterBar value={filter} onChange={setFilter} options={filters.map((f) => ({ key: f.key, label: f.label }))} />

      <Card className="overflow-hidden p-0">
        {loading ? (
          <p className="p-8 text-center text-sm text-text-tertiary">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="p-8 text-center text-sm text-text-tertiary">No deposits found.</p>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((d) => {
              const userLabel = d.profiles?.full_name || d.profiles?.email || d.user_id.slice(0, 8);
              const pending = isPending(d.status);
              const parsedNotes = parseDepositNotes(d.notes ?? null, d.method);
              return (
                <li key={d.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-text-primary">{formatCurrency(d.amount)}</span>
                      <StatusBadge status={d.status} />
                    </div>
                    <p className="text-sm text-text-tertiary mt-1">
                      {userLabel} · {formatDepositMethod(d.method)} · {formatDate(d.created_at)}
                    </p>
                    {parsedNotes.type === "gift_card" && parsedNotes.cardCode && (
                      <p className="text-xs text-text-secondary mt-1 font-mono">
                        Code: {parsedNotes.cardCode}
                      </p>
                    )}
                    {parsedNotes.type === "plain" && parsedNotes.text && (
                      <p className="text-xs text-text-tertiary mt-1 truncate">{parsedNotes.text}</p>
                    )}
                    {parsedNotes.type === "gift_card" && parsedNotes.additionalNotes && (
                      <p className="text-xs text-text-tertiary mt-1 truncate">{parsedNotes.additionalNotes}</p>
                    )}
                  </div>
                  {pending && (
                    <AdminListActions>
                      <Button size="sm" disabled={acting === d.id} onClick={() => handleApprove(d)}>
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" disabled={acting === d.id} onClick={() => handleReject(d.id)}>
                        Reject
                      </Button>
                    </AdminListActions>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
