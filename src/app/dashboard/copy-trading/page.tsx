"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  getCopySubscriptions,
  subscribeToTrader,
} from "@/lib/api/subscriptions";
import type { CopySubscriptionRow } from "@/lib/supabase/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatPercent, formatCurrency } from "@/lib/utils";
import { Users, TrendingUp, Star, Loader2 } from "lucide-react";

const TRADERS = [
  { name: "AlphaTrader", roi: 142.5, followers: 2840, winRate: 78, rating: 4.9 },
  { name: "CryptoKing", roi: 98.3, followers: 5620, winRate: 72, rating: 4.8 },
  { name: "QuantMaster", roi: 67.1, followers: 1890, winRate: 81, rating: 4.7 },
  { name: "SwingPro", roi: 54.8, followers: 3210, winRate: 69, rating: 4.6 },
  { name: "DeFiWhale", roi: 203.2, followers: 8900, winRate: 65, rating: 4.9 },
  { name: "SteadyGains", roi: 38.4, followers: 1450, winRate: 85, rating: 4.5 },
];

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
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-text-primary">Copy Trading</h1>

      {error && (
        <p role="alert" className="text-[13px] text-red bg-red/10 border border-red/30 rounded px-3 py-2">
          {error}
        </p>
      )}

      {subscriptions.length > 0 && (
        <Card>
          <h3 className="text-[13px] font-semibold mb-3">Your Copy Subscriptions</h3>
          {subscriptions.map((sub) => (
            <div
              key={sub.id}
              className="flex items-center justify-between py-2 border-b border-border last:border-0 text-[13px]"
            >
              <div>
                <p className="font-medium">{sub.trader_name}</p>
                <p className="text-[11px] text-text-tertiary capitalize">
                  {sub.status} · {formatCurrency(sub.allocation)}
                </p>
              </div>
            </div>
          ))}
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {TRADERS.map((trader) => (
          <Card key={trader.name}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-bg-hover flex items-center justify-center text-xs font-bold">
                {trader.name.charAt(0)}
              </div>
              <div>
                <p className="text-[13px] font-semibold">{trader.name}</p>
                <div className="flex items-center gap-1 text-[11px] text-text-tertiary">
                  <Star className="w-3 h-3 text-brand fill-brand" />
                  {trader.rating}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-[10px] text-text-tertiary">30d ROI</p>
                <p className="text-sm font-bold text-green">
                  {formatPercent(trader.roi)}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-text-tertiary">Win Rate</p>
                <p className="text-sm font-bold">{trader.winRate}%</p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-text-tertiary mb-3">
              <Users className="w-3 h-3" />
              {trader.followers.toLocaleString()} followers
            </div>

            {activeTraders.has(trader.name) ? (
              <Button className="w-full" size="sm" variant="secondary" disabled>
                Copying
              </Button>
            ) : userId ? (
              <Button
                type="button"
                className="w-full"
                size="sm"
                disabled={loadingTrader === trader.name}
                onClick={() => handleCopy(trader.name)}
              >
                {loadingTrader === trader.name ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <TrendingUp className="w-3.5 h-3.5" />
                    Copy
                  </>
                )}
              </Button>
            ) : (
              <Link href="/register">
                <Button className="w-full" size="sm">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Copy
                </Button>
              </Link>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
