"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { utcToday } from "@/lib/meme-coins/sync";
import type { MemeCoinRow } from "@/lib/meme-coins/types";
import { createClient } from "@/lib/supabase/client";
import { cn, formatPercent } from "@/lib/utils";
import { Loader2, RefreshCw, Sparkles, X } from "@/components/icons";

export default function AdminMemeCoinsPage() {
  const [listDate, setListDate] = useState(utcToday());
  const [coins, setCoins] = useState<MemeCoinRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { data, error: loadError } = await supabase
      .from("daily_meme_coins")
      .select("*")
      .eq("list_date", listDate)
      .in("source", ["trending", "onyx_generated"])
      .order("sort_order", { ascending: true });

    if (loadError) setError(loadError.message);
    else setCoins((data as MemeCoinRow[]) ?? []);
    setLoading(false);
  }, [listDate]);

  useEffect(() => {
    void load();
  }, [load]);

  const stats = useMemo(
    () => ({
      total: coins.filter((c) => c.status === "active").length,
      trending: coins.filter((c) => c.source === "trending" && c.status === "active").length,
      generated: coins.filter((c) => c.source === "onyx_generated" && c.status === "active").length,
    }),
    [coins]
  );

  function flash(msg: string) {
    setSuccess(msg);
    setError("");
  }

  async function runSync(force = false) {
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/admin/meme-coins/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ force }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sync failed");
      flash(
        `Synced ${data.listDate}: +${data.inserted} new (${data.trending} trending, ${data.generated} ONYX). Total ${data.total}.`
      );
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sync failed");
    } finally {
      setBusy(false);
    }
  }

  async function toggleFeatured(coin: MemeCoinRow) {
    setBusy(true);
    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("daily_meme_coins")
      .update({ featured: !coin.featured })
      .eq("id", coin.id);
    setBusy(false);
    if (updateError) setError(updateError.message);
    else await load();
  }

  async function archiveCoin(coin: MemeCoinRow) {
    if (!confirm(`Archive ${coin.symbol}?`)) return;
    setBusy(true);
    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("daily_meme_coins")
      .update({ status: "archived" })
      .eq("id", coin.id);
    setBusy(false);
    if (updateError) setError(updateError.message);
    else {
      flash(`Archived ${coin.symbol}.`);
      await load();
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Meme Coin Daily"
        subtitle="Import trending meme coins and generate ONYX originals for the user meme wallet."
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" disabled={busy} onClick={() => void runSync(false)}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Sync today
            </Button>
            <Button variant="secondary" disabled={busy} onClick={() => void runSync(true)}>
              <Sparkles className="h-4 w-4" />
              Force refresh
            </Button>
            <Button variant="secondary" disabled={loading} onClick={() => void load()}>
              Reload
            </Button>
          </div>
        }
      />

      {error ? (
        <div className="rounded-lg border border-red/30 bg-red/10 px-4 py-3 text-sm text-red">{error}</div>
      ) : null}
      {success ? (
        <div className="rounded-lg border border-green/30 bg-green/10 px-4 py-3 text-sm text-green">
          {success}
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Active today", value: stats.total },
          { label: "Trending", value: stats.trending },
          { label: "ONYX generated", value: stats.generated },
        ].map((item) => (
          <Card key={item.label} className="p-4">
            <p className="text-xs uppercase tracking-wide text-text-tertiary">{item.label}</p>
            <p className="mt-1 text-2xl font-bold">{item.value}</p>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden p-0">
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">Daily market list</h2>
            <p className="text-sm text-text-secondary">
              Target: 10 coins per day (up to 7 trending + ONYX originals). Users trade these in{" "}
              <a href="/dashboard/meme-coins" className="text-brand hover:underline">
                Meme Wallet
              </a>
              .
            </p>
          </div>
          <Input
            type="date"
            value={listDate}
            onChange={(e) => setListDate(e.target.value)}
            className="max-w-[11rem]"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-brand" />
          </div>
        ) : coins.length === 0 ? (
          <div className="px-4 py-12 text-center text-sm text-text-secondary">
            No coins for this date. Click <strong>Sync today</strong> to generate the daily feed.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {coins.map((coin) => (
              <div
                key={coin.id}
                className={cn(
                  "flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between",
                  coin.status === "archived" && "opacity-50"
                )}
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">
                      {coin.name}{" "}
                      <span className="text-text-tertiary">${coin.symbol}</span>
                    </p>
                    <StatusBadge status={coin.source.replace("_", " ")} />
                    {coin.featured ? <StatusBadge status="featured" /> : null}
                    {coin.status === "archived" ? <StatusBadge status="archived" /> : null}
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-text-secondary">{coin.description}</p>
                  <p className="mt-1 text-xs text-text-tertiary">
                    {coin.price_usd != null ? `$${coin.price_usd}` : "—"}
                    {coin.change_24h != null ? ` · ${formatPercent(coin.change_24h)}` : ""}
                    {coin.coingecko_id ? ` · ${coin.coingecko_id}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={busy || coin.status === "archived"}
                    onClick={() => void toggleFeatured(coin)}
                  >
                    {coin.featured ? "Unfeature" : "Feature"}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={busy || coin.status === "archived"}
                    onClick={() => void archiveCoin(coin)}
                  >
                    <X className="h-3.5 w-3.5" />
                    Archive
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
