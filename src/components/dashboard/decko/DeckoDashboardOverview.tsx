"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { PortfolioSummary } from "@/lib/api/trading";
import type { ChartPoint } from "@/lib/chart-data";
import type { MarketPair } from "@/lib/market-data";
import type { TradeRow } from "@/lib/supabase/types";
import { cn, formatCurrency, formatNumber } from "@/lib/utils";
import {
  DeckoAnimatedBar,
  DeckoProgressBar,
  DeckoStagger,
  DeckoStaggerItem,
  useCountUp,
} from "@/components/dashboard/decko/decko-motion";
import { SignalStrengthCard } from "@/components/dashboard/decko/SignalStrengthCard";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { NotificationBell } from "@/components/dashboard/NotificationBell";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Bell,
  TrendingUp,
  Users,
  Wallet,
} from "@/components/icons";

type Props = {
  displayName: string;
  userEmail?: string;
  avatarUrl?: string;
  summary: PortfolioSummary;
  profitTotal: number;
  openOrders: number;
  tradesCount: number;
  chartData: ChartPoint[];
  recentTrades: TradeRow[];
  marketPairs: MarketPair[];
  signalPct?: number;
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function buildMonthlyBars(summary: PortfolioSummary, trades: TradeRow[]) {
  const now = new Date();
  return MONTHS.map((label, index) => {
    const monthTrades = trades.filter((t) => {
      const d = new Date(t.created_at);
      return d.getMonth() === index && d.getFullYear() === now.getFullYear();
    });
    const volume = monthTrades.reduce((sum, t) => sum + t.amount * t.price, 0);
    const profit = monthTrades.reduce(
      (sum, t) => sum + (t.type === "sell" ? t.amount * t.price : -(t.amount * t.price * 0.15)),
      0
    );
    const base = summary.totalValue > 0 ? summary.totalValue / 12 : 1000;
    const profitVal = Math.max(0, volume * 0.08 + profit + base * 0.05);
    const expenseVal = Math.max(0, volume * 0.03 + base * 0.02);
    return {
      label,
      profit: profitVal,
      expense: expenseVal,
      height: Math.min(100, (profitVal / Math.max(base, 1)) * 55 + 18),
    };
  });
}

function KpiCard({
  label,
  value,
  numeric,
  decimals = 0,
  prefix = "",
  suffix = "",
  trend,
  trendLabel,
  icon: Icon,
  delay = 0,
}: {
  label: string;
  value?: string;
  numeric?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  trend?: number;
  trendLabel?: string;
  icon: typeof Users;
  delay?: number;
}) {
  const animated = useCountUp(numeric ?? 0, { decimals, duration: 1.2 + delay * 0.1 });
  const display = value ?? `${prefix}${animated}${suffix}`;
  const up = trend !== undefined && trend >= 0;

  return (
    <DeckoStaggerItem>
      <motion.div
        className="decko-card h-full p-4 sm:p-5"
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-text-secondary">{label}</p>
            <p className="mt-2 text-2xl font-bold tracking-tight text-text-primary">{display}</p>
            {trend !== undefined && (
              <p className={cn("mt-2 text-xs font-medium", up ? "text-green" : "text-red")}>
                {up ? "+" : ""}
                {trend.toFixed(1)}% {trendLabel}
              </p>
            )}
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-bg-tertiary text-text-primary">
            <Icon className="h-4 w-4" />
          </span>
        </div>
      </motion.div>
    </DeckoStaggerItem>
  );
}

export function DeckoDashboardOverview({
  displayName,
  userEmail,
  avatarUrl,
  summary,
  profitTotal,
  openOrders,
  tradesCount,
  chartData: _chartData,
  recentTrades,
  marketPairs: _marketPairs,
  signalPct = 0,
}: Props) {
  const [hoverBar, setHoverBar] = useState<number | null>(null);
  const firstName = displayName.split(" ")[0] || displayName || "Trader";
  const initial = (displayName || userEmail || "U").charAt(0).toUpperCase();
  const monthly = useMemo(() => buildMonthlyBars(summary, recentTrades), [summary, recentTrades]);

  const cashPct =
    summary.totalValue > 0 ? (summary.cashBalance / summary.totalValue) * 100 : 50;
  const holdingsPct =
    summary.totalValue > 0 ? (summary.holdingsValue / summary.totalValue) * 100 : 50;

  const profitTrend =
    summary.totalValue > 0 ? (profitTotal / summary.totalValue) * 100 : 0;
  const depositTrend =
    summary.totalDeposits > 0
      ? ((summary.totalValue - summary.totalWithdrawals) / summary.totalDeposits - 1) * 100
      : 15;

  const today = new Date();
  const calendarDays = useMemo(() => {
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: Array<number | null> = Array(firstDay).fill(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  }, [today]);

  return (
    <div className="decko-dashboard mx-auto max-w-[1320px]">
      <div className="mb-5 flex flex-col gap-4 lg:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary sm:text-2xl lg:text-3xl">
            Hello, {firstName}!
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Here&apos;s your overview of your trading business!
          </p>
        </div>
        <div className="hidden items-center gap-2 sm:gap-3 lg:flex">
          <ThemeToggle className="rounded-xl border border-border bg-bg-secondary" />
          <NotificationBell />
          <div className="flex items-center gap-2 rounded-2xl border border-border bg-bg-secondary py-1.5 pl-1.5 pr-3">
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="h-9 w-9 rounded-xl object-cover" />
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--fin-btn-bg)] text-sm font-bold text-[var(--fin-btn-fg)]">
                {initial}
              </span>
            )}
            <div className="hidden sm:block min-w-0">
              <p className="truncate text-sm font-semibold text-text-primary">{displayName || "Trader"}</p>
              <p className="truncate text-xs text-text-secondary">{userEmail}</p>
            </div>
          </div>
        </div>
      </div>

      <DeckoStagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard
          label="Total Portfolio"
          numeric={summary.totalValue}
          decimals={2}
          prefix="$"
          trend={depositTrend}
          trendLabel="from deposits"
          icon={Users}
        />
        <KpiCard
          label="Cash Balance"
          numeric={summary.cashBalance}
          decimals={2}
          prefix="$"
          trend={cashPct > 50 ? 8.4 : -4.2}
          trendLabel="from last month"
          icon={Wallet}
          delay={0.05}
        />
        <KpiCard
          label="Profit Total"
          value={formatCurrency(profitTotal, summary.currency)}
          trend={profitTrend}
          trendLabel="realized P&L"
          icon={TrendingUp}
          delay={0.1}
        />
      </DeckoStagger>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.4fr)_340px]">
        <DeckoStaggerItem className="min-w-0">
          <div className="decko-card p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3 sm:mb-6">
              <div>
                <h2 className="text-base font-bold text-text-primary sm:text-lg">Portfolio Overview</h2>
                <p className="text-sm text-text-secondary">Monthly profit performance</p>
              </div>
              <select className="rounded-xl border border-border bg-bg-secondary px-2.5 py-1.5 text-xs text-text-primary outline-none sm:px-3 sm:py-2 sm:text-sm">
                <option>Month</option>
                <option>Quarter</option>
              </select>
            </div>

            <div className="relative flex h-[180px] items-end gap-1.5 sm:h-[240px] sm:gap-3">
              {monthly.map((bar, index) => (
                <div key={bar.label} className="flex h-full flex-1 flex-col items-center gap-2">
                  <DeckoAnimatedBar
                    height={bar.height}
                    delay={0.08 * index}
                    active={hoverBar === index}
                    onHover={() => setHoverBar(index)}
                    onLeave={() => setHoverBar(null)}
                  />
                  <span className="text-[11px] text-text-tertiary">{bar.label}</span>
                </div>
              ))}

              {hoverBar !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pointer-events-none absolute left-1/2 top-2 z-10 -translate-x-1/2 rounded-xl bg-[var(--fin-btn-bg)] px-3 py-2 text-xs text-[var(--fin-btn-fg)] shadow-xl"
                >
                  <p>Profit: {formatNumber(monthly[hoverBar].profit / 1000, 1)}K</p>
                  <p className="text-text-tertiary">
                    Expense: {formatNumber(monthly[hoverBar].expense / 1000, 1)}K
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </DeckoStaggerItem>

        <DeckoStaggerItem className="space-y-4">
          <SignalStrengthCard signalPct={signalPct} />

          <div className="decko-card hidden p-4 sm:block sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-text-primary">
                {today.toLocaleString(undefined, { month: "long", year: "numeric" })}
              </h2>
              <div className="flex gap-1">
                <button type="button" className="rounded-lg px-2 py-1 text-text-tertiary hover:bg-bg-tertiary">
                  ‹
                </button>
                <button type="button" className="rounded-lg px-2 py-1 text-text-tertiary hover:bg-bg-tertiary">
                  ›
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-text-tertiary">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-7 gap-1 text-center text-sm">
              {calendarDays.map((day, i) =>
                day === null ? (
                  <span key={`e-${i}`} />
                ) : (
                  <span
                    key={day}
                    className={cn(
                      "mx-auto flex h-8 w-8 items-center justify-center rounded-full",
                      day === today.getDate()
                        ? "bg-[var(--decko-accent)] font-semibold text-[var(--decko-accent-text)]"
                        : "text-text-secondary"
                    )}
                  >
                    {day}
                  </span>
                )
              )}
            </div>
          </div>
        </DeckoStaggerItem>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <DeckoStaggerItem>
          <div className="decko-card p-5 sm:p-6">
            <h2 className="text-lg font-bold text-text-primary">Portfolio Allocation</h2>
            <div className="mt-6 space-y-5">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-text-secondary">Cash Balance</span>
                  <span className="font-semibold text-text-primary">{cashPct.toFixed(2)}%</span>
                </div>
                <DeckoProgressBar value={cashPct} delay={0.2} />
                <p className="mt-1 text-xs text-green">+{Math.max(1, cashPct * 0.08).toFixed(1)}%</p>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-text-secondary">Holdings Value</span>
                  <span className="font-semibold text-text-primary">{holdingsPct.toFixed(2)}%</span>
                </div>
                <DeckoProgressBar value={holdingsPct} delay={0.35} />
                <p className="mt-1 text-xs text-green">+{Math.max(1, holdingsPct * 0.05).toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </DeckoStaggerItem>

        <DeckoStaggerItem>
          <div className="decko-card p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-text-primary">Quick Actions</h2>
              <span className="rounded-full bg-bg-tertiary px-2.5 py-1 text-xs text-text-secondary">
                {openOrders} open · {tradesCount} trades
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Trade", href: "/dashboard/trade", icon: TrendingUp },
                { label: "Deposit", href: "/dashboard/deposit", icon: ArrowDownToLine },
                { label: "Withdraw", href: "/dashboard/withdraw", icon: ArrowUpFromLine },
                { label: "Alerts", href: "/dashboard/notifications", icon: Bell },
              ].map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.div
                    key={action.href}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.45 + index * 0.06 }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <Link
                      href={action.href}
                      className="flex flex-col items-start gap-3 rounded-2xl border border-border bg-bg-primary p-4 transition-colors hover:border-[var(--decko-accent)]"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-bg-secondary text-text-primary shadow-sm">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="font-semibold text-text-primary">{action.label}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </DeckoStaggerItem>
      </div>
    </div>
  );
}
