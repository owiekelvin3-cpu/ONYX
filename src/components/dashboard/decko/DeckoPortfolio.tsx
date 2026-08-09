"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { PortfolioSummary } from "@/lib/api/trading";
import type { ChartPoint } from "@/lib/chart-data";
import type { TradeRow } from "@/lib/supabase/types";
import { FIN_CHART_COLORS } from "@/lib/theme";
import { cn, formatCurrency, formatNumber } from "@/lib/utils";
import { PortfolioChart } from "@/components/dashboard/PortfolioChartLoader";
import { CryptoIcon } from "@/components/crypto/CryptoIcon";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  DeckoProgressBar,
  DeckoStagger,
  DeckoStaggerItem,
  useCountUp,
} from "@/components/dashboard/decko/decko-motion";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  TrendingUp,
  Wallet,
} from "@/components/icons";

export type PortfolioHolding = {
  asset: string;
  quantity: number;
  price: number;
  value: number;
};

type Props = {
  summary: PortfolioSummary;
  profitTotal: number;
  holdings: PortfolioHolding[];
  chartData: ChartPoint[];
  recentTrades: TradeRow[];
};

const CHART_RANGES = ["7D", "30D", "90D"] as const;

function KpiCard({
  label,
  value,
  numeric,
  prefix = "$",
  suffix = "",
  trend,
  trendLabel,
  icon: Icon,
  delay = 0,
}: {
  label: string;
  value?: string;
  numeric?: number;
  prefix?: string;
  suffix?: string;
  trend?: number;
  trendLabel?: string;
  icon: typeof Wallet;
  delay?: number;
}) {
  const animated = useCountUp(numeric ?? 0, { decimals: 2, duration: 1.2 + delay * 0.1 });
  const display = value ?? `${prefix}${animated}${suffix}`;
  const up = trend !== undefined && trend >= 0;

  return (
    <DeckoStaggerItem>
      <motion.div
        className="decko-card h-full p-5"
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm text-text-secondary">{label}</p>
            <p className="mt-2 text-2xl font-bold tracking-tight text-text-primary">{display}</p>
            {trend !== undefined && (
              <p className={cn("mt-2 text-xs font-medium", up ? "text-green" : "text-red")}>
                {up ? "+" : ""}
                {trend.toFixed(1)}% {trendLabel}
              </p>
            )}
          </div>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-bg-tertiary text-text-primary">
            <Icon className="h-4 w-4" />
          </span>
        </div>
      </motion.div>
    </DeckoStaggerItem>
  );
}

export function DeckoPortfolio({
  summary,
  profitTotal,
  holdings,
  chartData,
  recentTrades,
}: Props) {
  const [chartRange, setChartRange] = useState<(typeof CHART_RANGES)[number]>("30D");

  const filteredChart = useMemo(() => {
    const days = chartRange === "7D" ? 7 : chartRange === "30D" ? 30 : 90;
    if (chartData.length <= days + 1) return chartData;
    return chartData.slice(-(days + 1));
  }, [chartData, chartRange]);

  const cashPct =
    summary.totalValue > 0 ? (summary.cashBalance / summary.totalValue) * 100 : 100;
  const holdingsPct =
    summary.totalValue > 0 ? (summary.holdingsValue / summary.totalValue) * 100 : 0;

  const holdingsWithShare = useMemo(
    () =>
      holdings
        .map((h, i) => ({
          ...h,
          share: summary.totalValue > 0 ? (h.value / summary.totalValue) * 100 : 0,
          color: FIN_CHART_COLORS[i % FIN_CHART_COLORS.length],
        }))
        .sort((a, b) => b.value - a.value),
    [holdings, summary.totalValue]
  );

  const profitTrend =
    summary.totalValue > 0 ? (profitTotal / summary.totalValue) * 100 : 0;

  return (
    <div className="decko-dashboard mx-auto max-w-[1320px]">
      <div className="mb-5 flex flex-col gap-4 lg:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="hidden text-xl font-bold text-text-primary lg:block sm:text-2xl lg:text-3xl">Portfolio</h1>
          <p className="text-sm text-text-secondary lg:mt-1">
            Track your balance, holdings, and performance in one place.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
          <ThemeToggle className="hidden rounded-xl border border-border bg-bg-secondary lg:inline-flex" />
          <Link
            href="/dashboard/deposit"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-bg-secondary px-3 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:bg-bg-hover sm:px-4"
          >
            <ArrowDownToLine className="h-4 w-4" />
            Deposit
          </Link>
          <Link
            href="/dashboard/trade"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--fin-btn-bg)] px-3 py-2.5 text-sm font-semibold text-[var(--fin-btn-fg)] transition-transform hover:scale-[1.02] sm:px-4"
          >
            <TrendingUp className="h-4 w-4" />
            Trade
          </Link>
        </div>
      </div>

      <DeckoStagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Total Value"
          numeric={summary.totalValue}
          icon={Wallet}
        />
        <KpiCard
          label="Cash Balance"
          numeric={summary.cashBalance}
          trend={cashPct}
          trendLabel="of portfolio"
          icon={ArrowDownToLine}
          delay={0.05}
        />
        <KpiCard
          label="Holdings"
          numeric={summary.holdingsValue}
          trend={holdingsPct}
          trendLabel="allocated"
          icon={TrendingUp}
          delay={0.1}
        />
        <KpiCard
          label="Profit Total"
          value={formatCurrency(profitTotal, summary.currency)}
          trend={profitTrend}
          trendLabel="realized P&L"
          icon={ArrowUpFromLine}
          delay={0.15}
        />
      </DeckoStagger>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.35fr)_340px]">
        <DeckoStaggerItem className="min-w-0">
          <div className="decko-card p-5 sm:p-6">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-text-primary">Performance</h2>
                <p className="text-sm text-text-secondary">Portfolio value over time</p>
              </div>
              <div className="flex gap-1 rounded-xl border border-border bg-bg-primary p-1">
                {CHART_RANGES.map((range) => (
                  <button
                    key={range}
                    type="button"
                    onClick={() => setChartRange(range)}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                      chartRange === range
                        ? "bg-[var(--decko-accent)] text-[var(--decko-accent-text)]"
                        : "text-text-secondary hover:text-text-primary"
                    )}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
            <PortfolioChart
              balance={summary.totalValue}
              chartData={filteredChart}
            />
          </div>
        </DeckoStaggerItem>

        <DeckoStaggerItem className="space-y-4">
          <div className="decko-card p-5">
            <h2 className="text-lg font-bold text-text-primary">Allocation</h2>
            <p className="mt-1 text-sm text-text-secondary">Cash vs invested assets</p>
            <div className="mt-5 space-y-5">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-text-secondary">Cash</span>
                  <span className="font-semibold text-text-primary">{cashPct.toFixed(1)}%</span>
                </div>
                <DeckoProgressBar value={cashPct} delay={0.15} />
                <p className="mt-1 text-xs text-text-tertiary">
                  {formatCurrency(summary.cashBalance, summary.currency)}
                </p>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-text-secondary">Holdings</span>
                  <span className="font-semibold text-text-primary">{holdingsPct.toFixed(1)}%</span>
                </div>
                <DeckoProgressBar value={holdingsPct} delay={0.25} />
                <p className="mt-1 text-xs text-text-tertiary">
                  {summary.holdingsCount} asset{summary.holdingsCount === 1 ? "" : "s"} ·{" "}
                  {formatCurrency(summary.holdingsValue, summary.currency)}
                </p>
              </div>
            </div>
          </div>

          {holdingsWithShare.length > 0 && (
            <div className="decko-card p-5">
              <h2 className="text-lg font-bold text-text-primary">Asset Mix</h2>
              <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-bg-tertiary">
                {holdingsWithShare.map((h) => (
                  <div
                    key={h.asset}
                    className="h-full transition-all"
                    style={{
                      width: `${Math.max(h.share, 0.5)}%`,
                      backgroundColor: h.color,
                    }}
                    title={`${h.asset} ${h.share.toFixed(1)}%`}
                  />
                ))}
              </div>
              <ul className="mt-4 space-y-2">
                {holdingsWithShare.slice(0, 4).map((h) => (
                  <li key={h.asset} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-text-secondary">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: h.color }}
                      />
                      {h.asset}
                    </span>
                    <span className="font-medium tabular-nums text-text-primary">
                      {h.share.toFixed(1)}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </DeckoStaggerItem>
      </div>

      <DeckoStaggerItem className="mt-4">
        <div className="decko-card p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-text-primary">Holdings</h2>
              <p className="text-sm text-text-secondary">Your open positions</p>
            </div>
            <Link
              href="/dashboard/trade"
              className="text-xs font-medium text-text-secondary hover:text-text-primary"
            >
              Open trade desk →
            </Link>
          </div>

          {holdingsWithShare.length > 0 ? (
            <>
              <div className="space-y-2 md:hidden">
                {holdingsWithShare.map((h, index) => (
                  <motion.div
                    key={h.asset}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + index * 0.04 }}
                  >
                    <Link
                      href="/dashboard/trade"
                      className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-bg-primary p-4 transition-colors hover:border-[var(--decko-accent)]/40"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <CryptoIcon symbol={h.asset} label={h.asset} size="sm" />
                        <div className="min-w-0">
                          <p className="font-semibold text-text-primary">{h.asset}</p>
                          <p className="text-[11px] text-text-tertiary">
                            {formatNumber(h.quantity, h.quantity < 1 ? 4 : 2)} units ·{" "}
                            {h.share.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-mono text-sm font-semibold tabular-nums text-text-primary">
                          {formatCurrency(h.value, summary.currency)}
                        </p>
                        <p className="font-mono text-[11px] tabular-nums text-text-tertiary">
                          @ {formatCurrency(h.price, summary.currency)}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="hidden md:block overflow-x-auto">
                <table className="w-full min-w-[520px]">
                  <thead>
                    <tr className="border-b border-border text-[11px] text-text-tertiary">
                      <th className="py-2 text-left font-medium">Asset</th>
                      <th className="py-2 text-right font-medium">Quantity</th>
                      <th className="py-2 text-right font-medium">Price</th>
                      <th className="py-2 text-right font-medium">Value</th>
                      <th className="py-2 text-right font-medium">Share</th>
                    </tr>
                  </thead>
                  <tbody>
                    {holdingsWithShare.map((h) => (
                      <tr
                        key={h.asset}
                        className="border-b border-border/50 text-[13px] transition-colors hover:bg-bg-primary/50"
                      >
                        <td className="py-3">
                          <Link
                            href="/dashboard/trade"
                            className="flex items-center gap-2.5 font-medium text-text-primary hover:text-brand"
                          >
                            <CryptoIcon symbol={h.asset} label={h.asset} size="xs" tile={false} />
                            {h.asset}
                          </Link>
                        </td>
                        <td className="py-3 text-right font-mono tabular-nums">
                          {formatNumber(h.quantity, h.quantity < 1 ? 4 : 2)}
                        </td>
                        <td className="py-3 text-right font-mono tabular-nums">
                          {formatCurrency(h.price, summary.currency)}
                        </td>
                        <td className="py-3 text-right font-mono tabular-nums">
                          {formatCurrency(h.value, summary.currency)}
                        </td>
                        <td className="py-3 text-right tabular-nums text-text-secondary">
                          {h.share.toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-border px-6 py-10 text-center">
              <p className="text-sm text-text-secondary">No holdings yet.</p>
              <p className="mt-1 text-xs text-text-tertiary">
                Fund your account and place your first trade to build a portfolio.
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <Link
                  href="/dashboard/deposit"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-bg-primary px-4 py-2 text-sm font-semibold text-text-primary"
                >
                  <ArrowDownToLine className="h-4 w-4" />
                  Deposit
                </Link>
                <Link
                  href="/dashboard/trade"
                  className="inline-flex items-center gap-2 rounded-xl bg-[var(--fin-btn-bg)] px-4 py-2 text-sm font-semibold text-[var(--fin-btn-fg)]"
                >
                  <TrendingUp className="h-4 w-4" />
                  Start trading
                </Link>
              </div>
            </div>
          )}
        </div>
      </DeckoStaggerItem>

      {recentTrades.length > 0 && (
        <DeckoStaggerItem className="mt-4">
          <div className="decko-card p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-text-primary">Recent Activity</h2>
              <Link
                href="/dashboard/transactions"
                className="text-xs font-medium text-text-secondary hover:text-text-primary"
              >
                View all
              </Link>
            </div>
            <div className="space-y-2">
              {recentTrades.slice(0, 5).map((trade, index) => (
                <motion.div
                  key={trade.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + index * 0.04 }}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-text-primary">
                      {trade.type === "buy" ? "Buy" : "Sell"} {trade.asset}
                    </p>
                    <p className="text-[11px] text-text-tertiary">
                      {new Date(trade.created_at).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-mono text-sm tabular-nums text-text-primary">
                      {formatCurrency(trade.amount * trade.price, summary.currency)}
                    </p>
                    <p
                      className={cn(
                        "text-[11px] font-medium capitalize",
                        trade.type === "buy" ? "text-green" : "text-red"
                      )}
                    >
                      {trade.type}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </DeckoStaggerItem>
      )}
    </div>
  );
}
