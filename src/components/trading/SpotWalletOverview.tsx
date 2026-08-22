"use client";

import Link from "next/link";
import type { HoldingRow } from "@/lib/supabase/types";
import { CryptoIcon } from "@/components/crypto/CryptoIcon";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ArrowDownToLine, Wallet } from "@/components/icons";
import { SPOT_ASSETS } from "@/lib/spot-assets";
import { cn, formatCurrency, formatNumber } from "@/lib/utils";
import type { MarketPair } from "@/lib/market-data";

type WalletRow = {
  symbol: string;
  name: string;
  quantity: number;
  price: number;
  value: number;
  depositKey: string;
  pairSymbol: string;
};

function buildWalletRows(
  holdings: HoldingRow[],
  pairs: MarketPair[]
): WalletRow[] {
  const priceBySymbol = new Map<string, number>();
  for (const pair of pairs) {
    const base = pair.symbol.split("/")[0];
    priceBySymbol.set(base, pair.price);
  }

  return SPOT_ASSETS.map((asset) => {
    const held = holdings.find((h) => h.asset.toUpperCase() === asset.symbol);
    const quantity = Number(held?.quantity ?? 0);
    const price = priceBySymbol.get(asset.symbol) ?? (asset.symbol === "USDT" ? 1 : 0);
    return {
      symbol: asset.symbol,
      name: asset.name,
      quantity,
      price,
      value: quantity * price,
      depositKey: asset.depositKey,
      pairSymbol: asset.pairSymbol,
    };
  });
}

export function SpotWalletOverview({
  cashBalance,
  holdings,
  pairs,
  selectedSymbol,
  onSelectAsset,
  onDepositAsset,
}: {
  cashBalance: number | null;
  holdings: HoldingRow[];
  pairs: MarketPair[];
  selectedSymbol: string;
  onSelectAsset: (pair: MarketPair) => void;
  onDepositAsset: (depositKey: string) => void;
}) {
  const rows = buildWalletRows(holdings, pairs);
  const cryptoValue = rows.reduce((sum, row) => sum + row.value, 0);
  const totalValue = (cashBalance ?? 0) + cryptoValue;

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="!p-4 sm:col-span-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-text-tertiary">
                Total wallet
              </p>
              <p className="mt-1 text-2xl font-bold text-text-primary">
                {formatCurrency(totalValue)}
              </p>
              <p className="mt-1 text-xs text-text-tertiary">
                Cash + crypto holdings
              </p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <Wallet className="h-5 w-5" />
            </span>
          </div>
        </Card>

        <Card className="!p-4 sm:col-span-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-text-tertiary">
            Cash balance
          </p>
          <p className="mt-1 text-2xl font-bold font-mono text-text-primary">
            {cashBalance === null ? "—" : formatCurrency(cashBalance)}
          </p>
          <p className="mt-1 text-xs text-text-tertiary">Used to buy crypto instantly</p>
          <Link href="/dashboard/deposit?from=trade" className="mt-3 inline-block">
            <Button size="sm" variant="outline" className="gap-1.5">
              <ArrowDownToLine className="h-3.5 w-3.5" />
              Deposit funds
            </Button>
          </Link>
        </Card>

        <Card className="!p-4 sm:col-span-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-text-tertiary">
            Crypto holdings
          </p>
          <p className="mt-1 text-2xl font-bold font-mono text-text-primary">
            {formatCurrency(cryptoValue)}
          </p>
          <p className="mt-1 text-xs text-text-tertiary">
            {rows.filter((r) => r.quantity > 0).length} asset
            {rows.filter((r) => r.quantity > 0).length === 1 ? "" : "s"} in wallet
          </p>
        </Card>
      </div>

      <Card className="!p-0 overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">Crypto wallet</h2>
            <p className="text-xs text-text-tertiary">
              Deposit crypto, buy with cash, hold, and sell anytime on the spot desk.
            </p>
          </div>
        </div>

        <div className="divide-y divide-border">
          {rows.map((row) => {
            const active = selectedSymbol === row.pairSymbol;
            return (
              <div
                key={row.symbol}
                className={cn(
                  "flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
                  active && "bg-brand/5"
                )}
              >
                <button
                  type="button"
                  onClick={() => {
                    const pair = pairs.find((p) => p.symbol === row.pairSymbol);
                    if (pair) onSelectAsset(pair);
                  }}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <CryptoIcon symbol={row.symbol} label={row.name} size="md" />
                  <div className="min-w-0">
                    <p className="font-semibold text-text-primary">{row.name}</p>
                    <p className="text-xs text-text-tertiary">{row.symbol}</p>
                  </div>
                </button>

                <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                  <div className="text-right">
                    <p className="font-mono text-sm font-semibold text-text-primary">
                      {formatNumber(row.quantity, row.quantity < 1 ? 6 : 4)}
                    </p>
                    <p className="text-[11px] text-text-tertiary">
                      {formatCurrency(row.value)} · ${formatNumber(row.price, row.price < 10 ? 4 : 2)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => onDepositAsset(row.depositKey)}>
                      Deposit
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        const pair = pairs.find((p) => p.symbol === row.pairSymbol);
                        if (pair) onSelectAsset(pair);
                      }}
                    >
                      Trade
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
