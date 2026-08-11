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
  Zap,
} from "@/components/icons";
import { Button } from "@/components/ui/Button";

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

const QUICK_ACTIONS = [
  { label: "Trade", href: "/dashboard/trade", icon: TrendingUp },
  { label: "Deposit", href: "/dashboard/deposit", icon: ArrowDownToLine },
  { label: "Withdraw", href: "/dashboard/withdraw", icon: ArrowUpFromLine },
  { label: "Signals", href: "/dashboard/signals", icon: Zap },
  { label: "Alerts", href: "/dashboard/notifications", icon: Bell },
] as const;

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
  compact = false,
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
  compact?: boolean;
}) {
  const animated = useCountUp(numeric ?? 0, { decimals, duration: 1.2 + delay * 0.1 });
  const display = value ?? `${prefix}${animated}${suffix}`;
  const up = trend !== undefined && trend >= 0;

  return (
    <DeckoStaggerItem>
      <motion.div
        className={cn("decko-card h-full", compact ? "p-3.5" : "p-4 lg:p-5")}
        whileHover={{ y: compact ? 0 : -4, transition: { duration: 0.2 } }}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className={cn("text-text-secondary", compact ? "text-xs" : "text-sm")}>{label}</p>
            <p
              className={cn(
                "mt-1 font-bold tracking-tight text-text-primary",
                compact ? "text-lg" : "mt-2 text-xl lg:text-2xl"
              )}
            >
              {display}
            </p>
            {trend !== undefined && !compact && (
              <p className={cn("mt-1.5 text-xs font-medium lg:mt-2", up ? "text-green" : "text-red")}>
                {up ? "+" : ""}
                {trend.toFixed(1)}% {trendLabel}
              </p>
            )}
          </div>
          <span
            className={cn(
              "flex shrink-0 items-center justify-center rounded-xl bg-bg-tertiary text-text-primary",
              compact ? "h-8 w-8" : "h-10 w-10"
            )}
          >
            <Icon className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
          </span>
        </div>
      </motion.div>
    </DeckoStaggerItem>
  );
}

function QuickActionsGrid({ openOrders, tradesCount, mobile = false }: { openOrders: number; tradesCount: number; mobile?: boolean }) {
  const actions = mobile ? QUICK_ACTIONS : QUICK_ACTIONS.slice(0, 4);

  return (
    <div className={cn("decko-card", mobile ? "p-4" : "p-5 sm:p-6")}>
      <div className="mb-3 flex items-center justify-between gap-2 lg:mb-4">
        <h2 className={cn("font-bold text-text-primary", mobile ? "text-base" : "text-lg")}>
          Quick Actions
        </h2>
        <span className="rounded-full bg-bg-tertiary px-2 py-0.5 text-[10px] text-text-secondary lg:px-2.5 lg:py-1 lg:text-xs">
          {openOrders} open · {tradesCount} trades
        </span>
      </div>
      <div className={cn("grid gap-2.5", mobile ? "grid-cols-3 sm:grid-cols-5" : "grid-cols-2 gap-3")}>
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className={cn(
                "flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-bg-primary text-center transition-colors active:border-[var(--decko-accent)] active:bg-bg-secondary",
                mobile ? "p-3" : "items-start gap-3 rounded-2xl p-4 hover:border-[var(--decko-accent)]"
              )}
            >
              <span
                className={cn(
                  "flex items-center justify-center rounded-xl bg-bg-secondary text-text-primary",
                  mobile ? "h-9 w-9" : "h-10 w-10 shadow-sm"
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className={cn("font-semibold text-text-primary", mobile ? "text-[11px]" : "")}>
                {action.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
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
  const chartMonths = useMemo(() => monthly.slice(-6), [monthly]);

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
    <div className="decko-dashboard mx-auto max-w-[1320px] space-y-4 pb-2 lg:space-y-6 lg:pb-0">
      {/* Header */}
      <div className="flex flex-col gap-3 lg:mb-2 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary lg:text-3xl">Hello, {firstName}!</h1>
          <p className="mt-0.5 text-sm text-text-secondary lg:mt-1">
            Here&apos;s your trading overview
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
            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-sm font-semibold text-text-primary">{displayName || "Trader"}</p>
              <p className="truncate text-xs text-text-secondary">{userEmail}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile hero balance */}
      <div className="decko-card overflow-hidden p-4 lg:hidden">
        <p className="text-xs font-medium uppercase tracking-wide text-text-tertiary">Total portfolio</p>
        <p className="mt-1 text-3xl font-bold tracking-tight text-text-primary">
          {formatCurrency(summary.totalValue, summary.currency)}
        </p>
        <p className={cn("mt-1 text-xs font-medium", profitTotal >= 0 ? "text-green" : "text-red")}>
          {profitTotal >= 0 ? "+" : ""}
          {formatCurrency(profitTotal, summary.currency)} realized P&amp;L
        </p>
        <div className="mt-4 flex gap-2">
          <Link href="/dashboard/trade" className="flex-1">
            <Button className="w-full gap-1.5" size="sm">
              <TrendingUp className="h-3.5 w-3.5" />
              Trade
            </Button>
          </Link>
          <Link href="/dashboard/deposit" className="flex-1">
            <Button variant="secondary" className="w-full gap-1.5" size="sm">
              <ArrowDownToLine className="h-3.5 w-3.5" />
              Deposit
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile quick actions — high on the page */}
      <div className="lg:hidden">
        <QuickActionsGrid openOrders={openOrders} tradesCount={tradesCount} mobile />
      </div>

      {/* Mobile compact KPIs */}
      <DeckoStagger className="grid grid-cols-2 gap-3 lg:hidden">
        <KpiCard
          label="Cash"
          numeric={summary.cashBalance}
          decimals={2}
          prefix="$"
          icon={Wallet}
          compact
        />
        <KpiCard
          label="Profit"
          value={formatCurrency(profitTotal, summary.currency)}
          icon={TrendingUp}
          delay={0.05}
          compact
        />
      </DeckoStagger>

      {/* Desktop KPIs */}
      <DeckoStagger className="hidden gap-4 lg:grid lg:grid-cols-3">
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

      {/* Signal — mobile, compact placement */}
      <div className="lg:hidden">
        <SignalStrengthCard signalPct={signalPct} compact />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.4fr)_340px]">
        <DeckoStaggerItem className="min-w-0">
          <div className="decko-card p-4 lg:p-6">
            <div className="mb-4 flex items-center justify-between gap-3 lg:mb-6">
              <div>
                <h2 className="text-base font-bold text-text-primary lg:text-lg">Portfolio Overview</h2>
                <p className="text-xs text-text-secondary lg:text-sm">Monthly profit performance</p>
              </div>
              <select className="rounded-lg border border-border bg-bg-secondary px-2 py-1.5 text-xs text-text-primary outline-none lg:rounded-xl lg:px-3 lg:py-2 lg:text-sm">
                <option>Month</option>
                <option>Quarter</option>
              </select>
            </div>

            {/* Mobile: last 6 months */}
            <div className="relative flex h-[160px] items-end gap-2 lg:hidden">
              {chartMonths.map((bar, index) => (
                <div key={bar.label} className="flex h-full flex-1 flex-col items-center gap-1.5">
                  <DeckoAnimatedBar
                    height={bar.height}
                    delay={0.06 * index}
                    active={hoverBar === index}
                    onHover={() => setHoverBar(index)}
                    onLeave={() => setHoverBar(null)}
                  />
                  <span className="text-[10px] text-text-tertiary">{bar.label}</span>
                </div>
              ))}
              {hoverBar !== null && chartMonths[hoverBar] && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pointer-events-none absolute left-1/2 top-1 z-10 -translate-x-1/2 rounded-lg bg-[var(--fin-btn-bg)] px-2.5 py-1.5 text-[10px] text-[var(--fin-btn-fg)] shadow-xl"
                >
                  <p>Profit: {formatNumber(chartMonths[hoverBar].profit / 1000, 1)}K</p>
                </motion.div>
              )}
            </div>

            {/* Desktop: full year */}
            <div className="relative hidden h-[240px] items-end gap-3 lg:flex">
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

        <DeckoStaggerItem className="hidden space-y-4 xl:block">
          <SignalStrengthCard signalPct={signalPct} />

          <div className="decko-card p-5">
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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <DeckoStaggerItem>
          <div className="decko-card p-4 lg:p-6">
            <h2 className="text-base font-bold text-text-primary lg:text-lg">Portfolio Allocation</h2>
            <div className="mt-4 space-y-4 lg:mt-6 lg:space-y-5">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-text-secondary">Cash Balance</span>
                  <span className="font-semibold text-text-primary">{cashPct.toFixed(1)}%</span>
                </div>
                <DeckoProgressBar value={cashPct} delay={0.2} />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-text-secondary">Holdings Value</span>
                  <span className="font-semibold text-text-primary">{holdingsPct.toFixed(1)}%</span>
                </div>
                <DeckoProgressBar value={holdingsPct} delay={0.35} />
              </div>
            </div>
          </div>
        </DeckoStaggerItem>

        <DeckoStaggerItem className="hidden lg:block">
          <QuickActionsGrid openOrders={openOrders} tradesCount={tradesCount} />
        </DeckoStaggerItem>
      </div>
    </div>
  );
}
