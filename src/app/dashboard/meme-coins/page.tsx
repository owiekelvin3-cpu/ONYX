"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/client";
import {
  executeMemeTrade,
  getMemeWalletItems,
  getTodayMemeMarket,
  heldMemeQuantity,
  memeCoinPrice,
} from "@/lib/api/meme-trading";
import { getUsdBalance } from "@/lib/api/trading";
import type { MemeCoinRow } from "@/lib/meme-coins/types";
import type { MemeWalletItem } from "@/lib/api/meme-trading";
import {
  MemeCoinOrderPanel,
  MemeCoinWalletOverview,
  type MemeWalletTab,
} from "@/components/meme-coins/MemeCoinWallet";
import { emitDashboardRefresh } from "@/lib/dashboard-live-sync";
import { DASHBOARD_REFRESH_EVENT } from "@/lib/dashboard-live-sync";
import { cn, formatPercent } from "@/lib/utils";

export default function DashboardMemeCoinsPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>();
  const [cashBalance, setCashBalance] = useState<number | null>(null);
  const [bagItems, setBagItems] = useState<MemeWalletItem[]>([]);
  const [marketCoins, setMarketCoins] = useState<MemeCoinRow[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<MemeCoinRow | null>(null);
  const [activeTab, setActiveTab] = useState<MemeWalletTab>("market");
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const bagValue = useMemo(
    () => bagItems.reduce((sum, item) => sum + item.valueUsd, 0),
    [bagItems]
  );

  const heldQuantity = useMemo(
    () => (selectedCoin ? heldMemeQuantity(bagItems, selectedCoin.id) : 0),
    [bagItems, selectedCoin]
  );

  const price = selectedCoin ? memeCoinPrice(selectedCoin) : 0;
  const qty = amount ? parseFloat(amount) : 0;
  const total = qty * price;

  const refreshWallet = useCallback(async (uid: string) => {
    const supabase = createClient();
    const [cash, items, market] = await Promise.all([
      getUsdBalance(supabase, uid),
      getMemeWalletItems(supabase, uid),
      getTodayMemeMarket(supabase),
    ]);
    setCashBalance(cash);
    setBagItems(items);
    setMarketCoins(market);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        router.replace("/login?next=/dashboard/meme-coins");
        return;
      }
      setUserId(user.id);
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();
      setUserName(profile?.full_name ?? undefined);
      await refreshWallet(user.id);
    });
  }, [refreshWallet, router]);

  useEffect(() => {
    if (!userId) return;
    const reload = () => void refreshWallet(userId);
    window.addEventListener(DASHBOARD_REFRESH_EVENT, reload);
    return () => window.removeEventListener(DASHBOARD_REFRESH_EVENT, reload);
  }, [refreshWallet, userId]);

  useEffect(() => {
    if (!selectedCoin && marketCoins.length > 0) {
      setSelectedCoin(marketCoins[0] ?? null);
    }
  }, [marketCoins, selectedCoin]);

  async function handleTrade() {
    if (!selectedCoin || !userId) return;

    setError("");
    setSuccess("");

    if (!qty || qty <= 0) {
      setError("Enter a valid amount");
      return;
    }

    if (total < 1) {
      setError("Minimum meme trade is $1");
      return;
    }

    if (side === "sell" && qty > heldQuantity) {
      setError(`You only hold ${heldQuantity} ${selectedCoin.symbol}`);
      return;
    }

    if (side === "buy" && cashBalance !== null && total > cashBalance) {
      setError("Insufficient cash balance. Deposit funds to buy meme coins.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      await executeMemeTrade(supabase, {
        userId,
        memeCoinId: selectedCoin.id,
        type: side,
        quantity: qty,
        priceUsd: price,
      });

      await refreshWallet(userId);
      setAmount("");
      setSuccess(
        `${side === "buy" ? "Bought" : "Sold"} ${qty} ${selectedCoin.symbol} · ${
          side === "buy" ? "Added to your meme bag" : "Cash credited to your balance"
        }`
      );
      emitDashboardRefresh();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Trade failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto min-w-0 max-w-6xl space-y-3 sm:space-y-4">
      <div className="rounded-xl border border-gold/20 bg-gold/5 px-4 py-3 text-sm leading-relaxed text-text-secondary">
        Meme coins are high risk and can lose most or all value. This wallet is separate from spot
        trading — buys use your main USD balance and settle instantly.
      </div>

      <div
        className={cn(
          "grid gap-3 sm:gap-4",
          activeTab === "trade" &&
            "lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]"
        )}
      >
        <MemeCoinWalletOverview
          userName={userName}
          bagValue={bagValue}
          cashBalance={cashBalance}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          bagItems={bagItems}
          marketCoins={marketCoins}
          selectedCoin={selectedCoin}
          onSelectCoin={(coin) => {
            setSelectedCoin(coin);
            setError("");
            setSuccess("");
          }}
        />

        <div className={cn("min-w-0 lg:sticky lg:top-20 lg:self-start", activeTab !== "trade" && "hidden")}>
          {activeTab === "trade" && (
            <button
              type="button"
              onClick={() => setActiveTab("market")}
              className="mb-3 text-sm font-semibold text-[var(--brand-accent)] lg:hidden touch-target"
            >
              ← Back to list
            </button>
          )}

          {selectedCoin ? (
            <Card className="!overflow-hidden !p-0 min-w-0 shadow-[var(--shadow-card)]">
              <div className="border-b border-border bg-bg-secondary px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h2 className="text-lg font-bold text-text-primary">{selectedCoin.name}</h2>
                    <p className="text-xs text-text-tertiary">${selectedCoin.symbol}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold font-mono text-text-primary">
                      ${price < 0.01 ? price.toFixed(8) : price.toFixed(price < 1 ? 6 : 4)}
                    </p>
                    {selectedCoin.change_24h != null ? (
                      <p
                        className={cn(
                          "text-xs font-mono",
                          selectedCoin.change_24h >= 0 ? "text-green" : "text-red"
                        )}
                      >
                        {formatPercent(selectedCoin.change_24h)}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="p-3 sm:p-4">
                <MemeCoinOrderPanel
                  coin={selectedCoin}
                  side={side}
                  onSideChange={setSide}
                  amount={amount}
                  onAmountChange={setAmount}
                  total={total}
                  cashBalance={cashBalance}
                  heldQuantity={heldQuantity}
                  loading={loading}
                  error={error}
                  success={success}
                  onSubmit={() => void handleTrade()}
                />
              </div>
            </Card>
          ) : (
            <Card className="p-6 text-center text-sm text-text-secondary">
              Select a meme coin from Market or My bag to trade.
            </Card>
          )}
        </div>
      </div>

      <p className="text-center text-xs text-text-tertiary">
        Browse the public daily feed at{" "}
        <Link href="/meme-coins" className="text-brand hover:underline">
          /meme-coins
        </Link>
      </p>
    </div>
  );
}
