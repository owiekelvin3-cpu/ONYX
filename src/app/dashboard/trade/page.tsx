"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { executeTrade, getUsdBalance } from "@/lib/api/trading";
import { useLivePrices } from "@/hooks/useLivePrices";
import { Card } from "@/components/ui/Card";
import { formatNumber, formatPercent } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { TradingViewTickerTape } from "@/components/trading/TradingViewTickerTape";
import { TradingViewAdvancedChart } from "@/components/trading/TradingViewAdvancedChart";
import { TradingViewTechnicalAnalysis } from "@/components/trading/TradingViewTechnicalAnalysis";
import { SpotMarketList } from "@/components/trading/SpotMarketList";
import { SpotOrderPanel } from "@/components/trading/SpotOrderPanel";
import type { MarketPair } from "@/lib/market-data";
import { toTradingViewSymbol } from "@/lib/tradingview-symbols";

function SymbolHeader({
  pair,
  onToggleMarkets,
  marketsOpen,
}: {
  pair: MarketPair;
  onToggleMarkets?: () => void;
  marketsOpen?: boolean;
}) {
  const isUp = pair.change24h >= 0;
  const priceDecimals = pair.price < 10 ? 4 : 2;

  return (
    <div className="flex flex-wrap items-start justify-between gap-3 px-3 sm:px-4 py-3 border-b border-border bg-bg-secondary">
      <div className="min-w-0">
        {onToggleMarkets ? (
          <button
            type="button"
            onClick={onToggleMarkets}
            className="flex items-center gap-1.5 text-left touch-target"
          >
            <span className="text-base sm:text-lg font-bold text-text-primary">
              {pair.symbol}
            </span>
            <span className="text-brand text-sm">{marketsOpen ? "▴" : "▾"}</span>
          </button>
        ) : (
          <h2 className="text-base sm:text-lg font-bold text-text-primary">
            {pair.symbol}
          </h2>
        )}
        <p className="text-[12px] text-text-tertiary mt-0.5">{pair.name}</p>
        <p className="text-[11px] text-text-tertiary mt-1 font-mono">
          {toTradingViewSymbol(pair.symbol)}
        </p>
      </div>

      <div className="text-right shrink-0">
        <p className="text-xl sm:text-2xl font-bold font-mono text-text-primary">
          ${formatNumber(pair.price, priceDecimals)}
        </p>
        <p
          className={cn(
            "text-sm font-mono mt-0.5",
            isUp ? "text-green" : "text-red"
          )}
        >
          {formatPercent(pair.change24h)}
        </p>
      </div>
    </div>
  );
}

export default function TradePage() {
  const router = useRouter();
  const { pairs } = useLivePrices();
  const [selectedPair, setSelectedPair] = useState<MarketPair | null>(null);
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");
  const [showMobileMarkets, setShowMobileMarkets] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      setUserId(user.id);
      const bal = await getUsdBalance(supabase, user.id);
      setBalance(bal);
    });
  }, []);

  useEffect(() => {
    if (pairs.length === 0) return;
    setSelectedPair((prev) => {
      const match = pairs.find((p) => p.symbol === prev?.symbol);
      return match ?? pairs[0];
    });
  }, [pairs]);

  if (!selectedPair) {
    return (
      <div className="space-y-4">
        <h1 className="text-base sm:text-lg font-bold text-text-primary">
          Spot Trading
        </h1>
        <div className="animate-pulse h-96 rounded-2xl bg-bg-secondary border border-border" />
      </div>
    );
  }

  const qty = amount ? parseFloat(amount) : 0;
  const total = qty * selectedPair.price;

  async function handleTrade() {
    const pair = selectedPair;
    if (!pair) return;

    setError("");
    setSuccess("");

    if (!userId) {
      router.push("/login");
      return;
    }

    if (!qty || qty <= 0) {
      setError("Enter a valid amount");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      await executeTrade(supabase, {
        userId,
        asset: pair.symbol,
        type: side,
        amount: qty,
        price: pair.price,
      });

      const bal = await getUsdBalance(supabase, userId);
      setBalance(bal);
      setAmount("");
      setSuccess(
        `${side === "buy" ? "Bought" : "Sold"} ${qty} ${pair.symbol.split("/")[0]} for $${formatNumber(total, 2)}`
      );
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Trade failed");
    } finally {
      setLoading(false);
    }
  }

  function selectPair(pair: MarketPair) {
    setSelectedPair(pair);
    setShowMobileMarkets(false);
  }

  return (
    <div className="space-y-3 sm:space-y-4 min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-text-primary">
            Spot Trading
          </h1>
          <p className="text-[12px] text-text-tertiary mt-0.5">
            Live charts powered by{" "}
            <a
              href="https://www.tradingview.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand hover:underline"
            >
              TradingView
            </a>
          </p>
        </div>
      </div>

      <TradingViewTickerTape />

      <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_340px] gap-3 sm:gap-4">
        <div className="space-y-3 min-w-0">
          <Card className="!p-0 overflow-hidden min-w-0">
            <SymbolHeader
              pair={selectedPair}
              onToggleMarkets={() => setShowMobileMarkets((v) => !v)}
              marketsOpen={showMobileMarkets}
            />

            <div className="h-[280px] sm:h-[360px] lg:h-[420px] xl:h-[480px] bg-[#131722]">
              <TradingViewAdvancedChart
                key={selectedPair.symbol}
                symbol={selectedPair.symbol}
              />
            </div>

            <div className="hidden lg:block">
              <SpotMarketList
                pairs={pairs}
                selectedSymbol={selectedPair.symbol}
                onSelect={selectPair}
              />
            </div>
          </Card>

          {showMobileMarkets && (
            <SpotMarketList
              pairs={pairs}
              selectedSymbol={selectedPair.symbol}
              onSelect={selectPair}
              compact
            />
          )}

          <div className="lg:hidden">
            <Card className="!p-3 sm:!p-4">
              <SpotOrderPanel
                symbol={selectedPair.symbol}
                side={side}
                onSideChange={setSide}
                amount={amount}
                onAmountChange={setAmount}
                total={total}
                balance={balance}
                userId={userId}
                loading={loading}
                error={error}
                success={success}
                onSubmit={handleTrade}
              />
            </Card>
          </div>
        </div>

        <div className="hidden lg:flex flex-col gap-3">
          <Card className="!p-4 flex-1">
            <p className="text-[11px] uppercase tracking-wide text-text-tertiary mb-3">
              Order
            </p>
            <SpotOrderPanel
              symbol={selectedPair.symbol}
              side={side}
              onSideChange={setSide}
              amount={amount}
              onAmountChange={setAmount}
              total={total}
              balance={balance}
              userId={userId}
              loading={loading}
              error={error}
              success={success}
              onSubmit={handleTrade}
            />
          </Card>

          <Card className="!p-3">
            <p className="text-[11px] uppercase tracking-wide text-text-tertiary mb-2 px-1">
              Technical Analysis
            </p>
            <TradingViewTechnicalAnalysis
              key={selectedPair.symbol}
              symbol={selectedPair.symbol}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
