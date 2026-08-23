"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { adjustAdminMemeCoinProfit } from "@/lib/admin-api";
import { utcToday } from "@/lib/meme-coins/sync";
import type { MemeCoinRow } from "@/lib/meme-coins/types";
import { createClient } from "@/lib/supabase/client";
import { cn, formatPercent } from "@/lib/utils";
import { Loader2, RefreshCw, Sparkles, X } from "@/components/icons";

type ProfitDraft = {
  price: string;
  change: string;
  lock: boolean;
  note: string;
};

const PROFIT_STEPS = [5, 10, 25, 50, 100] as const;

function draftForCoin(coin: MemeCoinRow): ProfitDraft {
  return {
    price: coin.price_usd != null ? String(coin.price_usd) : "",
    change: coin.change_24h != null ? String(coin.change_24h) : "0",
    lock: coin.admin_price_locked ?? false,
    note: "",
  };
}

export default function AdminMemeCoinsPage() {
  const [listDate, setListDate] = useState(utcToday());
  const [coins, setCoins] = useState<MemeCoinRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [savingCoinId, setSavingCoinId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [drafts, setDrafts] = useState<Record<string, ProfitDraft>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { data, error: loadError } = await supabase
      .from("daily_meme_coins")
      .select("*")
      .eq("list_date", listDate)
      .eq("source", "trending")
      .order("sort_order", { ascending: true });

    if (loadError) setError(loadError.message);
    else {
      const rows = (data as MemeCoinRow[]) ?? [];
      setCoins(rows);
      setDrafts(Object.fromEntries(rows.map((coin) => [coin.id, draftForCoin(coin)])));
    }
    setLoading(false);
  }, [listDate]);

  useEffect(() => {
    void load();
  }, [load]);

  const stats = useMemo(
    () => ({
      total: coins.filter((c) => c.status === "active").length,
      coingecko: coins.filter((c) => c.coingecko_id && c.status === "active").length,
      liveFill: coins.filter((c) => !c.coingecko_id && c.status === "active").length,
      locked: coins.filter((c) => c.admin_price_locked && c.status === "active").length,
    }),
    [coins]
  );

  function flash(msg: string) {
    setSuccess(msg);
    setError("");
  }

  function setDraft(coinId: string, patch: Partial<ProfitDraft>) {
    setDrafts((prev) => ({
      ...prev,
      [coinId]: { ...(prev[coinId] ?? { price: "", change: "0", lock: true, note: "" }), ...patch },
    }));
  }

  function bumpProfit(coinId: string, delta: number) {
    const draft = drafts[coinId];
    if (!draft) return;
    const current = Number(draft.change) || 0;
    setDraft(coinId, { change: String(Math.round((current + delta) * 100) / 100) });
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
        `Synced ${data.listDate}: +${data.inserted} new (${data.trending} CoinGecko, ${data.generated} live market). Total ${data.total}.`
      );
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sync failed");
    } finally {
      setBusy(false);
    }
  }

  async function saveProfit(coin: MemeCoinRow) {
    const draft = drafts[coin.id] ?? draftForCoin(coin);
    const priceUsd = Number(draft.price);
    const change24h = Number(draft.change);

    if (!Number.isFinite(priceUsd) || priceUsd <= 0) {
      setError("Enter a valid price greater than zero.");
      return;
    }
    if (!Number.isFinite(change24h)) {
      setError("Enter a valid 24h profit percentage.");
      return;
    }

    setSavingCoinId(coin.id);
    setError("");
    setSuccess("");
    try {
      await adjustAdminMemeCoinProfit({
        memeCoinId: coin.id,
        priceUsd,
        change24h,
        lock: draft.lock,
        note: draft.note || `Admin profit update for ${coin.symbol}`,
      });
      flash(`Updated ${coin.symbol}: ${formatPercent(change24h)} · $${priceUsd}`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save profit.");
    } finally {
      setSavingCoinId(null);
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
        subtitle="Import live trending meme coins, set profit on any coin, and fill today's market."
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

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Active today", value: stats.total },
          { label: "CoinGecko live", value: stats.coingecko },
          { label: "Market live", value: stats.liveFill },
          { label: "Profit locked", value: stats.locked },
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
              Set price and 24h profit on any coin. Locked coins keep your values during sync.
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
            {coins.map((coin) => {
              const draft = drafts[coin.id] ?? draftForCoin(coin);
              const saving = savingCoinId === coin.id;

              return (
                <div
                  key={coin.id}
                  className={cn("p-4", coin.status === "archived" && "opacity-50")}
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold">
                          {coin.name}{" "}
                          <span className="text-text-tertiary">${coin.symbol}</span>
                        </p>
                        <StatusBadge status={coin.source.replace("_", " ")} />
                        {coin.featured ? <StatusBadge status="featured" /> : null}
                        {coin.admin_price_locked ? <StatusBadge status="locked" /> : null}
                        {coin.status === "archived" ? <StatusBadge status="archived" /> : null}
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm text-text-secondary">{coin.description}</p>
                      <p className="mt-1 text-xs text-text-tertiary">
                        Live: {coin.price_usd != null ? `$${coin.price_usd}` : "—"}
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

                  {coin.status !== "archived" ? (
                    <div className="mt-4 rounded-xl border border-border bg-bg-primary/50 p-3 sm:p-4">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-tertiary">
                        Set profit
                      </p>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                          <label className="mb-1 block text-xs text-text-tertiary">Price (USD)</label>
                          <Input
                            type="number"
                            step="any"
                            min="0"
                            value={draft.price}
                            onChange={(e) => setDraft(coin.id, { price: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs text-text-tertiary">24h profit (%)</label>
                          <Input
                            type="number"
                            step="any"
                            value={draft.change}
                            onChange={(e) => setDraft(coin.id, { change: e.target.value })}
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="mb-1 block text-xs text-text-tertiary">Note (optional)</label>
                          <Input
                            placeholder="Reason for adjustment"
                            value={draft.note}
                            onChange={(e) => setDraft(coin.id, { note: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="text-xs text-text-tertiary">Quick add:</span>
                        {PROFIT_STEPS.map((step) => (
                          <button
                            key={step}
                            type="button"
                            onClick={() => bumpProfit(coin.id, step)}
                            className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-text-secondary hover:bg-bg-hover"
                          >
                            +{step}%
                          </button>
                        ))}
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={draft.lock}
                            onChange={(e) => setDraft(coin.id, { lock: e.target.checked })}
                          />
                          Lock price & profit (ignore sync)
                        </label>
                        <Button
                          size="sm"
                          disabled={saving || busy}
                          onClick={() => void saveProfit(coin)}
                        >
                          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                          Save profit
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
