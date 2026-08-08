"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  getUserSignalContext,
  purchaseSignalPackage,
  type UserSignalContext,
} from "@/lib/api/signals";
import { SIGNAL_PLANS, signalTierLabel, type SignalTier } from "@/lib/signal-plans";
import type { SignalPackageRow, TradingSignalRow } from "@/lib/supabase/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn, formatCurrency, formatDate, formatPercent } from "@/lib/utils";
import { Loader2, Lock, TrendingUp, Zap } from "@/components/icons";

function tierRank(tier: string) {
  if (tier === "vip") return 3;
  if (tier === "pro") return 2;
  return 1;
}

function canViewSignal(signal: TradingSignalRow, userRank: number) {
  return tierRank(signal.min_tier) <= userRank;
}

export default function SignalsPage() {
  const router = useRouter();
  const [ctx, setCtx] = useState<UserSignalContext | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState<SignalTier | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }
    setUserId(user.id);
    try {
      const data = await getUserSignalContext(supabase, user.id);
      setCtx(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load signals.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void load();
  }, [load]);

  const visibleSignals = useMemo(() => {
    if (!ctx) return [];
    return ctx.signals.filter((s) => canViewSignal(s, ctx.tierRank));
  }, [ctx]);

  const lockedCount = useMemo(() => {
    if (!ctx) return 0;
    return ctx.signals.filter((s) => !canViewSignal(s, ctx.tierRank)).length;
  }, [ctx]);

  async function handlePurchase(planId: SignalTier) {
    if (!userId || !ctx) return;
    const plan = SIGNAL_PLANS.find((p) => p.id === planId);
    if (!plan) return;

    if (ctx.balance < plan.price) {
      setError("Insufficient balance. Deposit funds to purchase signal access.");
      return;
    }

    setBuying(planId);
    setError("");
    setSuccess("");
    try {
      const supabase = createClient();
      await purchaseSignalPackage(supabase, { userId, planId });
      setSuccess(`${plan.name} activated. New desk signals are now available.`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Purchase failed.");
    } finally {
      setBuying(null);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-text-tertiary">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!ctx) return null;

  const activePackage = ctx.activePackages[0] as SignalPackageRow | undefined;

  return (
    <div className="space-y-5 pb-8">
      <div>
        <h1 className="text-lg font-bold text-text-primary">Signals</h1>
        <p className="mt-1 text-xs text-text-tertiary">
          Purchase desk access from your balance. Your team-assigned signal allocation is shown below.
        </p>
      </div>

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

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wide text-text-tertiary">Signal allocation</p>
          <p className="mt-2 text-3xl font-bold text-text-primary">{formatPercent(ctx.signalPct)}</p>
          <p className="mt-1 text-xs text-text-tertiary">Set by your account manager</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wide text-text-tertiary">Available balance</p>
          <p className="mt-2 text-3xl font-bold text-text-primary">{formatCurrency(ctx.balance)}</p>
          <Link href="/dashboard/deposit" className="mt-2 inline-block text-xs text-accent hover:underline">
            Add funds
          </Link>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wide text-text-tertiary">Active access</p>
          {activePackage ? (
            <>
              <p className="mt-2 text-lg font-semibold text-text-primary">{activePackage.package_name}</p>
              <p className="text-xs text-text-tertiary">
                {activePackage.admin_granted ? "Granted by team · " : ""}
                Expires {activePackage.expires_at ? formatDate(activePackage.expires_at) : "—"}
              </p>
            </>
          ) : (
            <p className="mt-2 text-sm text-text-secondary">No active package — purchase below</p>
          )}
        </Card>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-text-primary">Buy signal access</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {SIGNAL_PLANS.map((plan) => {
            const owned = ctx.activePackages.some((p) => p.package_id === plan.id);
            const canAfford = ctx.balance >= plan.price;
            return (
              <Card key={plan.id} className="flex flex-col p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-text-primary">{plan.name}</p>
                    <p className="text-xs text-text-tertiary">{signalTierLabel(plan.id)} desk · {plan.days} days</p>
                  </div>
                  <Zap className="h-4 w-4 text-accent" />
                </div>
                <p className="mt-3 text-2xl font-bold text-text-primary">{formatCurrency(plan.price)}</p>
                <p className="mt-2 text-xs text-text-secondary">{plan.description}</p>
                <ul className="mt-3 space-y-1 text-xs text-text-tertiary">
                  {plan.features.map((f) => (
                    <li key={f}>• {f}</li>
                  ))}
                </ul>
                <Button
                  className="mt-4 w-full"
                  disabled={!!buying || owned}
                  onClick={() => handlePurchase(plan.id)}
                >
                  {buying === plan.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : owned ? (
                    "Active"
                  ) : canAfford ? (
                    "Purchase"
                  ) : (
                    "Insufficient balance"
                  )}
                </Button>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-text-primary">Live desk signals</h2>
          {lockedCount > 0 && (
            <span className="text-xs text-text-tertiary">{lockedCount} locked — upgrade tier to view</span>
          )}
        </div>

        {ctx.tierRank === 0 ? (
          <Card className="flex flex-col items-center gap-3 p-8 text-center">
            <Lock className="h-8 w-8 text-text-tertiary" />
            <p className="text-sm text-text-secondary">Purchase a signal package to unlock the trading desk.</p>
          </Card>
        ) : visibleSignals.length === 0 ? (
          <Card className="p-6 text-center text-sm text-text-tertiary">No signals published yet. Check back soon.</Card>
        ) : (
          <div className="space-y-2">
            {visibleSignals.map((signal) => (
              <Card key={signal.id} className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <TrendingUp
                        className={cn(
                          "h-4 w-4",
                          signal.direction === "buy" ? "text-success" : "text-danger"
                        )}
                      />
                      <span className="font-semibold text-text-primary">{signal.symbol}</span>
                      <span
                        className={cn(
                          "rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase",
                          signal.direction === "buy"
                            ? "bg-success/15 text-success"
                            : "bg-danger/15 text-danger"
                        )}
                      >
                        {signal.direction}
                      </span>
                      <span className="rounded bg-surface-elevated px-1.5 py-0.5 text-[10px] text-text-tertiary">
                        {signalTierLabel(signal.min_tier)}
                      </span>
                    </div>
                    <div className="mt-2 grid gap-1 text-xs text-text-secondary sm:grid-cols-3">
                      <span>Entry: {signal.entry_price}</span>
                      <span>Target: {signal.target_price}</span>
                      <span>Stop: {signal.stop_price}</span>
                    </div>
                    {signal.notes && (
                      <p className="mt-2 text-xs text-text-tertiary">{signal.notes}</p>
                    )}
                  </div>
                  <div className="text-right text-xs text-text-tertiary">
                    <p>{formatPercent(signal.confidence)} confidence</p>
                    <p className="mt-1 capitalize">{signal.status}</p>
                    <p>{formatDate(signal.published_at)}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
