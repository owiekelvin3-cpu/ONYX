"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  getCopySubscriptions,
  subscribeToTrader,
} from "@/lib/api/subscriptions";
import type { CopySubscriptionRow } from "@/lib/supabase/types";
import { COPY_TRADERS } from "@/lib/copy-traders";
import { CopyTraderCard } from "@/components/dashboard/copy-trading/CopyTraderCard";
import { TraderAvatar } from "@/components/dashboard/copy-trading/TraderAvatar";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";

const DEFAULT_ALLOCATION = 1000;

export default function CopyTradingPage() {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<CopySubscriptionRow[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loadingTrader, setLoadingTrader] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      setUserId(user.id);
      const rows = await getCopySubscriptions(supabase, user.id);
      setSubscriptions(rows);
    });
  }, []);

  async function handleCopy(traderName: string) {
    setError("");

    if (!userId) {
      router.push("/register");
      return;
    }

    setLoadingTrader(traderName);
    try {
      const supabase = createClient();
      const row = await subscribeToTrader(supabase, {
        userId,
        traderName,
        allocation: DEFAULT_ALLOCATION,
      });
      setSubscriptions((prev) => [row, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Copy subscription failed");
    } finally {
      setLoadingTrader(null);
    }
  }

  const activeTraders = new Set(
    subscriptions.filter((s) => s.status === "active").map((s) => s.trader_name)
  );

  return (
    <div className="decko-dashboard mx-auto max-w-[1320px] space-y-5 pb-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Copy Trading</h1>
        <p className="mt-1 max-w-2xl text-sm text-text-secondary">
          Follow top performers like a social feed — each trader has their own style, stats, and profile.
          Past performance is not indicative of future results.
        </p>
      </div>

      {error && (
        <p role="alert" className="rounded-xl border border-red/30 bg-red/10 px-4 py-3 text-sm text-red">
          {error}
        </p>
      )}

      {subscriptions.length > 0 && (
        <Card className="p-4 sm:p-5">
          <h2 className="text-sm font-semibold text-text-primary">Following</h2>
          <div className="mt-3 space-y-3">
            {subscriptions.map((sub) => {
              const profile = COPY_TRADERS.find((t) => t.name === sub.trader_name);
              return (
                <div
                  key={sub.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-2.5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {profile ? (
                      <TraderAvatar trader={profile} size="sm" />
                    ) : (
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-bg-tertiary text-xs font-bold">
                        {sub.trader_name.charAt(0)}
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-text-primary">{sub.trader_name}</p>
                      <p className="text-xs capitalize text-text-tertiary">
                        {sub.status} · {formatCurrency(sub.allocation)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {COPY_TRADERS.map((trader, index) => (
          <CopyTraderCard
            key={trader.name}
            trader={trader}
            index={index}
            isActive={activeTraders.has(trader.name)}
            userId={userId}
            loading={loadingTrader === trader.name}
            onCopy={() => handleCopy(trader.name)}
          />
        ))}
      </div>
    </div>
  );
}
