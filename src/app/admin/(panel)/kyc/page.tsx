"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateKycStatus } from "@/lib/admin-api";
import type { KycRow } from "@/lib/admin-types";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatusBadge, isPending } from "@/components/admin/StatusBadge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatDate, cn } from "@/lib/utils";
import { RefreshCw } from "@/components/icons";

export default function AdminKycPage() {
  const [rows, setRows] = useState<KycRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("kyc_submissions")
      .select("*, profiles(email, full_name, kyc_status)")
      .order("created_at", { ascending: false });
    setRows((data as KycRow[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleReview(id: string, userId: string, status: "approved" | "rejected") {
    setActing(id);
    setMessage("");
    try {
      await updateKycStatus(id, userId, status);
      setMessage(`KYC ${status}`);
      await load();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Action failed");
    }
    setActing(null);
  }

  return (
    <div className="space-y-5 max-w-5xl">
      <AdminPageHeader
        title="KYC Review"
        subtitle="Approve or reject identity verification submissions."
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

      <Card className="p-0 overflow-hidden">
        {loading ? (
          <p className="p-8 text-center text-sm text-text-tertiary">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="p-8 text-center text-sm text-text-tertiary">No KYC submissions yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((k) => {
              const userLabel = k.profiles?.full_name || k.profiles?.email || k.user_id.slice(0, 8);
              const pending = isPending(k.status);
              return (
                <li key={k.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-text-primary">{userLabel}</span>
                      <StatusBadge status={k.status} />
                    </div>
                    <p className="text-sm text-text-tertiary mt-1">
                      {k.document_type} · {formatDate(k.created_at)}
                    </p>
                    {k.document_url && (
                      <a
                        href={k.document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-brand hover:underline mt-1 inline-block"
                      >
                        View document
                      </a>
                    )}
                  </div>
                  {pending && (
                    <div className="flex gap-2 shrink-0">
                      <Button size="sm" disabled={acting === k.id} onClick={() => handleReview(k.id, k.user_id, "approved")}>
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" disabled={acting === k.id} onClick={() => handleReview(k.id, k.user_id, "rejected")}>
                        Reject
                      </Button>
                    </div>
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
