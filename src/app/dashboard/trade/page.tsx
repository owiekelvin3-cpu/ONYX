"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { executeTrade, getHoldings, getUsdBalance } from "@/lib/api/trading";
import { getDepositConfig, type DepositConfig } from "@/lib/api/deposits";
import { useLivePrices } from "@/hooks/useLivePrices";
import { Card } from "@/components/ui/Card";
import { formatNumber, formatPercent } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { TradingViewAdvancedChart } from "@/components/trading/TradingViewAdvancedChart";
import { SpotOrderPanel } from "@/components/trading/SpotOrderPanel";
import { SpotWalletOverview } from "@/components/trading/SpotWalletOverview";
import { SpotCryptoDepositSheet } from "@/components/trading/SpotCryptoDepositSheet";
import { SpotHoldingTransferSheet } from "@/components/trading/SpotHoldingTransferSheet";
import type { WalletRow } from "@/components/trading/SpotWalletOverview";
import type { MarketPair } from "@/lib/market-data";
import type { HoldingRow } from "@/lib/supabase/types";
import { filterSpotMarketPairs, SPOT_ASSETS, spotAssetBySymbol } from "@/lib/spot-assets";
import { toTradingViewSymbol } from "@/lib/tradingview-symbols";
import { emitDashboardRefresh } from "@/lib/dashboard-live-sync";
import { DASHBOARD_REFRESH_EVENT } from "@/lib/dashboard-live-sync";

function SymbolHeader({ pair }: { pair: MarketPair }) {
  const isUp = pair.change24h >= 0;
  const priceDecimals = pair.price < 10 ? 4 : 2;
  const base = pair.symbol.split("/")[0];

  return (
    <div className="flex flex-wrap items-start justify-between gap-3 px-3 sm:px-4 py-3 border-b border-border bg-bg-secondary">
      <div className="min-w-0">
        <h2 className="text-base sm:text-lg font-bold text-text-primary">{base}</h2>
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
  const { pairs: allPairs } = useLivePrices();
  const spotPairs = useMemo(() => filterSpotMarketPairs(allPairs), [allPairs]);

  const [selectedPair, setSelectedPair] = useState<MarketPair | null>(null);
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");
  const chartSectionRef = useRef<HTMLDivElement>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [holdings, setHoldings] = useState<HoldingRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [depositConfig, setDepositConfig] = useState<DepositConfig | null>(null);
  const [depositSheetKey, setDepositSheetKey] = useState<string | null>(null);
  const [transferTarget, setTransferTarget] = useState<WalletRow | null>(null);
  const [transferMode, setTransferMode] = useState<"to_main" | "send_out">("to_main");

  const refreshWallet = useCallback(async (uid: string) => {
    const supabase = createClient();
    const [bal, rows] = await Promise.all([
      getUsdBalance(supabase, uid),
      getHoldings(supabase, uid),
    ]);
    setBalance(bal);
    setHoldings(rows);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    void getDepositConfig(supabase).then(setDepositConfig);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      setUserId(user.id);
      await refreshWallet(user.id);
    });
  }, [refreshWallet]);

  useEffect(() => {
    if (!userId) return;
    const reload = () => void refreshWallet(userId);
    window.addEventListener(DASHBOARD_REFRESH_EVENT, reload);
    return () => window.removeEventListener(DASHBOARD_REFRESH_EVENT, reload);
  }, [refreshWallet, userId]);

  useEffect(() => {
    if (spotPairs.length === 0) return;
    setSelectedPair((prev) => {
      const match = spotPairs.find((p) => p.symbol === prev?.symbol);
      return match ?? spotPairs[0];
    });
  }, [spotPairs]);

  const heldQuantity = useMemo(() => {
    if (!selectedPair) return 0;
    const base = selectedPair.symbol.split("/")[0];
    const row = holdings.find((h) => h.asset.toUpperCase() === base);
    return Number(row?.quantity ?? 0);
  }, [holdings, selectedPair]);

  if (!selectedPair) {
    return (
      <div className="space-y-4">
        <h1 className="text-base sm:text-lg font-bold text-text-primary">Spot Trading</h1>
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

    if (side === "sell" && qty > heldQuantity) {
      setError(`You only hold ${heldQuantity} ${pair.symbol.split("/")[0]}`);
      return;
    }

    if (side === "buy" && balance !== null && total > balance) {
      setError("Insufficient cash balance. Deposit funds to buy crypto.");
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

      await refreshWallet(userId);
      setAmount("");
      setSuccess(
        `${side === "buy" ? "Bought" : "Sold"} ${qty} ${pair.symbol.split("/")[0]} · ${side === "buy" ? "Added to your crypto wallet" : "Cash credited to your balance"}`
      );
      emitDashboardRefresh();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Trade failed");
    } finally {
      setLoading(false);
    }
  }

  const depositAsset = depositSheetKey
    ? SPOT_ASSETS.find((a) => a.depositKey === depositSheetKey) ?? null
    : null;

  function openDeposit(depositKey: string) {
    setDepositSheetKey(depositKey);
  }

  function openDepositForSelectedPair() {
    if (!selectedPair) return;
    const base = selectedPair.symbol.split("/")[0];
    const asset = spotAssetBySymbol(base);
    if (asset) openDeposit(asset.depositKey);
  }

  function openTransfer(row: WalletRow, mode: "to_main" | "send_out") {
    setTransferTarget(row);
    setTransferMode(mode);
  }

  function selectPair(pair: MarketPair, scrollToChart = true) {
    setSelectedPair(pair);
    setError("");
    setSuccess("");
    if (scrollToChart) {
      requestAnimationFrame(() => {
        chartSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  return (
    <div className="space-y-3 sm:space-y-4 min-w-0">
      <div>
        <h1 className="text-base sm:text-lg font-bold text-text-primary">Spot Trading</h1>
        <p className="mt-1 max-w-3xl text-sm text-text-tertiary">
          Your crypto wallet and spot desk in one place. Deposit BTC, ETH, USDT, and more, buy with
          cash, hold in your wallet, and sell back anytime.
        </p>
      </div>

      <SpotWalletOverview
        holdings={holdings}
        pairs={spotPairs}
        selectedSymbol={selectedPair.symbol}
        onSelectAsset={selectPair}
        onDepositAsset={openDeposit}
        onTransferToMain={(row) => openTransfer(row, "to_main")}
        onSendOut={(row) => openTransfer(row, "send_out")}
      />

      <SpotCryptoDepositSheet
        open={Boolean(depositSheetKey && depositAsset)}
        depositKey={depositAsset?.depositKey ?? "bitcoin"}
        assetName={depositAsset?.name ?? "Bitcoin"}
        assetSymbol={depositAsset?.symbol ?? "BTC"}
        walletAddress={depositConfig?.cryptoWallets?.[depositAsset?.depositKey ?? "bitcoin"] ?? ""}
        userId={userId}
        onClose={() => setDepositSheetKey(null)}
        onSubmitted={() => emitDashboardRefresh()}
      />

      <SpotHoldingTransferSheet
        open={Boolean(transferTarget)}
        mode={transferMode}
        assetSymbol={transferTarget?.symbol ?? "BTC"}
        assetName={transferTarget?.name ?? "Bitcoin"}
        pairSymbol={transferTarget?.pairSymbol ?? "BTC/USDT"}
        price={transferTarget?.price ?? 0}
        heldQuantity={transferTarget?.quantity ?? 0}
        userId={userId}
        onClose={() => setTransferTarget(null)}
        onComplete={() => {
          if (userId) void refreshWallet(userId);
          emitDashboardRefresh();
        }}
      />

      <div
        ref={chartSectionRef}
        className="grid lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_340px] gap-3 sm:gap-4 scroll-mt-20"
      >
        <div className="space-y-3 min-w-0">
          <Card className="!p-0 overflow-hidden min-w-0">
            <SymbolHeader pair={selectedPair} />

            <div className="relative z-[1] h-[280px] sm:h-[360px] lg:h-[420px] xl:h-[480px] min-h-[280px] bg-[#131722]">
              <TradingViewAdvancedChart
                key={selectedPair.symbol}
                symbol={selectedPair.symbol}
              />
            </div>
          </Card>

          <div className="lg:hidden">
            <Card className="!p-3 sm:!p-4">
              <SpotOrderPanel
                symbol={selectedPair.symbol}
                side={side}
                onSideChange={setSide}
                amount={amount}
                onAmountChange={setAmount}
                total={total}
                price={selectedPair.price}
                cashBalance={balance}
                heldQuantity={heldQuantity}
                userId={userId}
                loading={loading}
                error={error}
                success={success}
                onSubmit={handleTrade}
                onDeposit={openDepositForSelectedPair}
              />
            </Card>
          </div>
        </div>

        <div className="hidden lg:block">
          <Card className="!p-4 sticky top-20">
            <p className="text-[11px] uppercase tracking-wide text-text-tertiary mb-3">
              Trade {selectedPair.symbol.split("/")[0]}
            </p>
            <SpotOrderPanel
              symbol={selectedPair.symbol}
              side={side}
              onSideChange={setSide}
              amount={amount}
              onAmountChange={setAmount}
              total={total}
              price={selectedPair.price}
              cashBalance={balance}
              heldQuantity={heldQuantity}
              userId={userId}
              loading={loading}
              error={error}
              success={success}
              onSubmit={handleTrade}
              onDeposit={openDepositForSelectedPair}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
