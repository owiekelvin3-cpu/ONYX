"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { executeTrade, getHoldings, getUsdBalance } from "@/lib/api/trading";
import { getDepositConfig, type DepositConfig } from "@/lib/api/deposits";
import { useLivePrices } from "@/hooks/useLivePrices";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatNumber, formatPercent } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { TradingViewAdvancedChart } from "@/components/trading/TradingViewAdvancedChart";
import { SpotOrderPanel } from "@/components/trading/SpotOrderPanel";
import {
  SpotWalletOverview,
  buildWalletRows,
  type SpotWalletTab,
  type WalletRow,
} from "@/components/trading/SpotWalletOverview";
import { SpotCryptoDepositSheet } from "@/components/trading/SpotCryptoDepositSheet";
import { SpotBuyCryptoSheet } from "@/components/trading/SpotBuyCryptoSheet";
import { SpotTransactionsSheet } from "@/components/trading/SpotTransactionsSheet";
import { SpotHoldingTransferSheet } from "@/components/trading/SpotHoldingTransferSheet";
import {
  countPendingTransactions,
  filterSpotTransactions,
  getUserTransactions,
} from "@/lib/api/transactions";
import type { MarketPair } from "@/lib/market-data";
import type { HoldingRow } from "@/lib/supabase/types";
import { filterSpotMarketPairs, SPOT_ASSETS, spotAssetBySymbol } from "@/lib/spot-assets";
import { DEFAULT_CRYPTO_PARTNERS } from "@/lib/deposit-options";
import { toTradingViewSymbol } from "@/lib/tradingview-symbols";
import { emitDashboardRefresh } from "@/lib/dashboard-live-sync";
import { DASHBOARD_REFRESH_EVENT } from "@/lib/dashboard-live-sync";

function SymbolHeader({ pair }: { pair: MarketPair }) {
  const isUp = pair.change24h >= 0;
  const priceDecimals = pair.price < 10 ? 4 : 2;
  const base = pair.symbol.split("/")[0];

  return (
    <div className="flex items-center justify-between gap-2 border-b border-border bg-bg-secondary px-3 py-2.5 sm:items-start sm:gap-3 sm:px-4 sm:py-3">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <h2 className="text-base font-bold text-text-primary sm:text-lg">{base}</h2>
          <p className="text-[11px] text-text-tertiary sm:hidden">{pair.name}</p>
        </div>
        <p className="mt-0.5 hidden text-[12px] text-text-tertiary sm:block">{pair.name}</p>
        <p className="mt-1 hidden text-[11px] font-mono text-text-tertiary sm:block">
          {toTradingViewSymbol(pair.symbol)}
        </p>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-lg font-bold font-mono text-text-primary sm:text-2xl">
          ${formatNumber(pair.price, priceDecimals)}
        </p>
        <p className={cn("text-xs font-mono sm:text-sm", isUp ? "text-green" : "text-red")}>
          {formatPercent(pair.change24h)}
        </p>
      </div>
    </div>
  );
}

function TradeQuickActions({
  row,
  onDeposit,
  onTransferToMain,
  onSendOut,
}: {
  row: WalletRow | null;
  onDeposit: () => void;
  onTransferToMain: () => void;
  onSendOut: () => void;
}) {
  if (!row) return null;
  const hasBalance = row.quantity > 0;

  return (
    <div className="grid grid-cols-3 gap-2 border-t border-border px-3 py-3 sm:px-4">
      <Button size="sm" variant="outline" className="min-h-10 text-[11px] sm:text-xs" onClick={onDeposit}>
        Deposit
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="min-h-10 text-[11px] sm:text-xs"
        disabled={!hasBalance}
        onClick={onTransferToMain}
      >
        To main
      </Button>
      <Button
        size="sm"
        variant="secondary"
        className="min-h-10 text-[11px] sm:text-xs"
        disabled={!hasBalance}
        onClick={onSendOut}
      >
        Send out
      </Button>
    </div>
  );
}

export default function TradePage() {
  const router = useRouter();
  const { pairs: allPairs } = useLivePrices();
  const spotPairs = useMemo(() => filterSpotMarketPairs(allPairs), [allPairs]);

  const [selectedPair, setSelectedPair] = useState<MarketPair | null>(null);
  const [activeTab, setActiveTab] = useState<SpotWalletTab>("coins");
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | undefined>();
  const [balance, setBalance] = useState<number | null>(null);
  const [holdings, setHoldings] = useState<HoldingRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [depositConfig, setDepositConfig] = useState<DepositConfig | null>(null);
  const [depositSheetKey, setDepositSheetKey] = useState<string | null>(null);
  const [buyCryptoSheetOpen, setBuyCryptoSheetOpen] = useState(false);
  const [transactionsSheetOpen, setTransactionsSheetOpen] = useState(false);
  const [pendingTxCount, setPendingTxCount] = useState(0);
  const [transferTarget, setTransferTarget] = useState<WalletRow | null>(null);
  const [transferMode, setTransferMode] = useState<"to_main" | "send_out">("to_main");

  const walletRows = useMemo(
    () => buildWalletRows(holdings, spotPairs),
    [holdings, spotPairs]
  );

  const selectedRow = useMemo(
    () => walletRows.find((row) => row.pairSymbol === selectedPair?.symbol) ?? null,
    [walletRows, selectedPair]
  );

  const refreshSpotTransactions = useCallback(async (uid: string) => {
    const supabase = createClient();
    const rows = filterSpotTransactions(await getUserTransactions(supabase, uid, 40));
    setPendingTxCount(countPendingTransactions(rows));
  }, []);

  const refreshWallet = useCallback(async (uid: string) => {
    const supabase = createClient();
    const [bal, rows] = await Promise.all([
      getUsdBalance(supabase, uid),
      getHoldings(supabase, uid),
    ]);
    setBalance(bal);
    setHoldings(rows);
    await refreshSpotTransactions(uid);
  }, [refreshSpotTransactions]);

  useEffect(() => {
    const supabase = createClient();
    void getDepositConfig(supabase).then(setDepositConfig);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      setUserId(user.id);

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();

      setUserName(profile?.full_name ?? undefined);
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
      <div className="min-w-0">
        <div className="animate-pulse overflow-hidden rounded-2xl border border-border bg-bg-secondary shadow-[var(--shadow-card)]">
          <div className="spot-wallet-hero h-52 rounded-t-2xl" />
          <div className="h-80 bg-bg-secondary" />
        </div>
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

  function selectPair(pair: MarketPair) {
    setSelectedPair(pair);
    setError("");
    setSuccess("");
    setActiveTab("trade");
  }

  function resolveActionRow(): WalletRow | null {
    if (selectedRow && selectedRow.quantity > 0) return selectedRow;
    return walletRows.find((row) => row.quantity > 0) ?? selectedRow;
  }

  function handleSend() {
    const row = resolveActionRow();
    if (!row || row.quantity <= 0) return;
    openTransfer(row, "send_out");
  }

  function handleReceive() {
    const depositKey =
      selectedRow?.depositKey ??
      (selectedPair ? spotAssetBySymbol(selectedPair.symbol.split("/")[0])?.depositKey : undefined) ??
      "bitcoin";
    openDeposit(depositKey);
  }

  function handleBuyCrypto() {
    setBuyCryptoSheetOpen(true);
  }

  const tradePanel = (
    <Card className="!overflow-hidden !p-0 min-w-0 shadow-[var(--shadow-card)]">
      <SymbolHeader pair={selectedPair} />
      <div className="relative z-[1] h-[240px] min-h-[240px] bg-[#131722] sm:h-[300px] sm:min-h-[300px] lg:h-[360px] xl:h-[420px]">
        <TradingViewAdvancedChart key={selectedPair.symbol} symbol={selectedPair.symbol} />
      </div>
      <TradeQuickActions
        row={selectedRow}
        onDeposit={openDepositForSelectedPair}
        onTransferToMain={() => selectedRow && openTransfer(selectedRow, "to_main")}
        onSendOut={() => selectedRow && openTransfer(selectedRow, "send_out")}
      />
      <div className="border-t border-border p-3 sm:p-4">
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
      </div>
    </Card>
  );

  return (
    <div className="mx-auto min-w-0 max-w-6xl space-y-3 sm:space-y-4">
      <div className="grid gap-3 sm:gap-4 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <SpotWalletOverview
          userName={userName}
          cashBalance={balance}
          holdings={holdings}
          pairs={spotPairs}
          selectedSymbol={selectedPair.symbol}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onSelectAsset={selectPair}
          onSend={handleSend}
          onReceive={handleReceive}
          onBuyCrypto={handleBuyCrypto}
          onOpenTransactions={() => setTransactionsSheetOpen(true)}
          pendingTransactionCount={pendingTxCount}
        />

        <div
          className={cn(
            "min-w-0 lg:sticky lg:top-20 lg:self-start",
            activeTab !== "trade" && "hidden lg:block"
          )}
        >
          {activeTab === "trade" && (
            <button
              type="button"
              onClick={() => setActiveTab("coins")}
              className="mb-3 text-sm font-semibold text-[var(--brand-accent)] lg:hidden touch-target"
            >
              ← Back to coins
            </button>
          )}
          {tradePanel}
        </div>
      </div>

      <SpotTransactionsSheet
        open={transactionsSheetOpen}
        userId={userId}
        onClose={() => {
          setTransactionsSheetOpen(false);
          if (userId) void refreshSpotTransactions(userId);
        }}
      />

      <SpotBuyCryptoSheet
        open={buyCryptoSheetOpen}
        partners={depositConfig?.cryptoPartners ?? DEFAULT_CRYPTO_PARTNERS}
        onClose={() => setBuyCryptoSheetOpen(false)}
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
    </div>
  );
}
