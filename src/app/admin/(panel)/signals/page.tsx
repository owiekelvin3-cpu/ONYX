"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";
import {
  bulkAdjustAdminSignalPct,
  grantAdminUserSignal,
  setAdminUserSignalPct,
} from "@/lib/admin-api";
import { SIGNAL_PLANS, signalTierLabel } from "@/lib/signal-plans";
import type { TradingSignalRow } from "@/lib/supabase/types";
import { cn, formatDate, formatPercent } from "@/lib/utils";
import { Loader2, Plus, TrendingUp } from "@/components/icons";

type UserRow = {
  id: string;
  email: string;
  full_name: string | null;
  signal_pct: number;
  role: string;
};

const BULK_STEPS = [-10, -5, -1, 1, 5, 10] as const;

export default function AdminSignalsPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [signals, setSignals] = useState<TradingSignalRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);

  const [userQuery, setUserQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [targetPct, setTargetPct] = useState("10");
  const [pctNote, setPctNote] = useState("");
  const [bulkNote, setBulkNote] = useState("Platform signal adjustment");
  const [grantDays, setGrantDays] = useState("30");
  const [grantTier, setGrantTier] = useState("basic");

  const [symbol, setSymbol] = useState("BTC/USD");
  const [direction, setDirection] = useState<"buy" | "sell">("buy");
  const [entry, setEntry] = useState("");
  const [target, setTarget] = useState("");
  const [stop, setStop] = useState("");
  const [minTier, setMinTier] = useState<"basic" | "pro" | "vip">("basic");
  const [confidence, setConfidence] = useState("75");
  const [notes, setNotes] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const supabase = createClient();
    const [usersRes, signalsRes] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, email, full_name, signal_pct, role")
        .neq("role", "admin")
        .order("email")
        .limit(200),
      supabase
        .from("trading_signals")
        .select("*")
        .order("published_at", { ascending: false })
        .limit(30),
    ]);
    if (usersRes.error) setError(usersRes.error.message);
    else setUsers((usersRes.data as UserRow[]) ?? []);
    if (signalsRes.error) setError(signalsRes.error.message);
    else setSignals((signalsRes.data as TradingSignalRow[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filteredUsers = users.filter((u) => {
    const q = userQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      u.email.toLowerCase().includes(q) ||
      (u.full_name ?? "").toLowerCase().includes(q)
    );
  });

  async function runBulk(delta: number) {
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      const data = await bulkAdjustAdminSignalPct({ delta, note: bulkNote });
      setSuccess(`Adjusted ${data.users_updated ?? 0} users by ${delta > 0 ? "+" : ""}${delta}%.`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bulk adjust failed.");
    } finally {
      setBusy(false);
    }
  }

  async function saveUserPct() {
    if (!selectedUser) {
      setError("Select a user first.");
      return;
    }
    const pct = parseFloat(targetPct);
    if (!Number.isFinite(pct) || pct < 0 || pct > 100) {
      setError("Enter a percentage between 0 and 100.");
      return;
    }
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      await setAdminUserSignalPct({
        userId: selectedUser.id,
        pct,
        note: pctNote || undefined,
      });
      setSuccess(`Set ${selectedUser.email} signal allocation to ${pct}%.`);
      setSelectedUser(null);
      setUserQuery("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update user.");
    } finally {
      setBusy(false);
    }
  }

  async function grantPackage() {
    if (!selectedUser) {
      setError("Select a user first.");
      return;
    }
    const plan = SIGNAL_PLANS.find((p) => p.id === grantTier);
    if (!plan) return;
    const days = parseInt(grantDays, 10);
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      await grantAdminUserSignal({
        userId: selectedUser.id,
        packageId: plan.id,
        packageName: plan.name,
        durationDays: Number.isFinite(days) ? days : 30,
      });
      setSuccess(`Granted ${plan.name} to ${selectedUser.email}.`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Grant failed.");
    } finally {
      setBusy(false);
    }
  }

  async function publishSignal() {
    if (!entry.trim() || !target.trim() || !stop.trim()) {
      setError("Entry, target, and stop are required.");
      return;
    }
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      const supabase = createClient();
      const { error: insertErr } = await supabase.from("trading_signals").insert({
        symbol: symbol.trim(),
        direction,
        entry_price: entry.trim(),
        target_price: target.trim(),
        stop_price: stop.trim(),
        min_tier: minTier,
        confidence: Math.min(100, Math.max(0, parseInt(confidence, 10) || 70)),
        notes: notes.trim() || null,
        status: "active",
      });
      if (insertErr) throw insertErr;
      setSuccess("Signal published to the desk.");
      setEntry("");
      setTarget("");
      setStop("");
      setNotes("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not publish signal.");
    } finally {
      setBusy(false);
    }
  }

  async function closeSignal(id: string) {
    setBusy(true);
    setError("");
    try {
      const supabase = createClient();
      const { error: updErr } = await supabase
        .from("trading_signals")
        .update({ status: "closed", closed_at: new Date().toISOString() })
        .eq("id", id);
      if (updErr) throw updErr;
      setSuccess("Signal closed.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not close signal.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Signals"
        subtitle="Manage user signal allocation, grant access, and publish desk signals."
      />

      {error && (
        <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
          {success}
        </div>
      )}

      <Card className="space-y-4 p-4">
        <h2 className="text-sm font-semibold text-text-primary">Bulk adjust all users</h2>
        <p className="text-xs text-text-tertiary">
          Increase or decrease signal allocation % for every non-admin user (clamped 0–100%).
        </p>
        <Input
          label="Note"
          value={bulkNote}
          onChange={(e) => setBulkNote(e.target.value)}
          placeholder="Reason for adjustment"
        />
        <div className="flex flex-wrap gap-2">
          {BULK_STEPS.map((step) => (
            <Button
              key={step}
              variant="secondary"
              size="sm"
              disabled={busy}
              onClick={() => runBulk(step)}
            >
              {step > 0 && <Plus className="mr-1 h-3 w-3" />}
              {step > 0 ? "+" : ""}
              {step}%
            </Button>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-4 p-4">
          <h2 className="text-sm font-semibold text-text-primary">Per-user allocation</h2>
          <Input
            label="Search user"
            value={userQuery}
            onChange={(e) => {
              setUserQuery(e.target.value);
              setSelectedUser(null);
            }}
            placeholder="Email or name"
          />
          <div className="max-h-40 overflow-y-auto rounded-lg border border-border">
            {loading ? (
              <div className="flex justify-center p-4">
                <Loader2 className="h-5 w-5 animate-spin text-text-tertiary" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <p className="p-3 text-xs text-text-tertiary">No users found.</p>
            ) : (
              filteredUsers.slice(0, 12).map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => {
                    setSelectedUser(u);
                    setTargetPct(String(u.signal_pct ?? 0));
                  }}
                  className={cn(
                    "flex w-full items-center justify-between border-b border-border px-3 py-2 text-left text-xs last:border-0 hover:bg-surface-elevated",
                    selectedUser?.id === u.id && "bg-accent/10"
                  )}
                >
                  <span className="text-text-primary">{u.email}</span>
                  <span className="text-text-tertiary">{formatPercent(u.signal_pct ?? 0)}</span>
                </button>
              ))
            )}
          </div>
          {selectedUser && (
            <p className="text-xs text-text-secondary">
              Selected: <strong>{selectedUser.email}</strong>
            </p>
          )}
          <Input
            label="Signal %"
            type="number"
            min={0}
            max={100}
            step={0.1}
            value={targetPct}
            onChange={(e) => setTargetPct(e.target.value)}
          />
          <Input
            label="Note (optional)"
            value={pctNote}
            onChange={(e) => setPctNote(e.target.value)}
          />
          <Button disabled={busy || !selectedUser} onClick={saveUserPct}>
            Set allocation
          </Button>
        </Card>

        <Card className="space-y-4 p-4">
          <h2 className="text-sm font-semibold text-text-primary">Grant signal package</h2>
          <p className="text-xs text-text-tertiary">
            Free access — no balance debit. Select a user from the panel on the left.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs text-text-tertiary">
              Tier
              <select
                className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                value={grantTier}
                onChange={(e) => setGrantTier(e.target.value)}
              >
                {SIGNAL_PLANS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
            <Input
              label="Days"
              type="number"
              min={1}
              value={grantDays}
              onChange={(e) => setGrantDays(e.target.value)}
            />
          </div>
          <Button disabled={busy || !selectedUser} onClick={grantPackage}>
            Grant access
          </Button>
        </Card>
      </div>

      <Card className="space-y-4 p-4">
        <h2 className="text-sm font-semibold text-text-primary">Publish desk signal</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Input label="Symbol" value={symbol} onChange={(e) => setSymbol(e.target.value)} />
          <label className="text-xs text-text-tertiary">
            Direction
            <select
              className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
              value={direction}
              onChange={(e) => setDirection(e.target.value as "buy" | "sell")}
            >
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
          </label>
          <Input label="Entry" value={entry} onChange={(e) => setEntry(e.target.value)} placeholder="67250" />
          <Input label="Target" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="68500" />
          <Input label="Stop" value={stop} onChange={(e) => setStop(e.target.value)} placeholder="66500" />
          <label className="text-xs text-text-tertiary">
            Min tier
            <select
              className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
              value={minTier}
              onChange={(e) => setMinTier(e.target.value as "basic" | "pro" | "vip")}
            >
              <option value="basic">Basic</option>
              <option value="pro">Pro</option>
              <option value="vip">VIP</option>
            </select>
          </label>
          <Input
            label="Confidence %"
            type="number"
            min={0}
            max={100}
            value={confidence}
            onChange={(e) => setConfidence(e.target.value)}
          />
        </div>
        <Input label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <Button disabled={busy} onClick={publishSignal}>
          Publish signal
        </Button>
      </Card>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-text-primary">Recent signals</h2>
        {signals.length === 0 ? (
          <Card className="p-6 text-center text-sm text-text-tertiary">No signals yet.</Card>
        ) : (
          <div className="space-y-2">
            {signals.map((signal) => (
              <Card key={signal.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-accent" />
                    <span className="font-semibold text-text-primary">{signal.symbol}</span>
                    <StatusBadge status={signal.status} />
                    <span className="text-xs text-text-tertiary">{signalTierLabel(signal.min_tier)}</span>
                  </div>
                  <p className="mt-1 text-xs text-text-secondary">
                    {signal.direction.toUpperCase()} · Entry {signal.entry_price} · TP {signal.target_price} · SL{" "}
                    {signal.stop_price}
                  </p>
                  <p className="text-xs text-text-tertiary">{formatDate(signal.published_at)}</p>
                </div>
                {signal.status === "active" && (
                  <Button variant="secondary" size="sm" disabled={busy} onClick={() => closeSignal(signal.id)}>
                    Close
                  </Button>
                )}
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
