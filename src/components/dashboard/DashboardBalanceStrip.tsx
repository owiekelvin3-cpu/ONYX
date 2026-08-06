"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import type { PortfolioSummary } from "@/lib/api/trading";
import { cn, formatCurrency } from "@/lib/utils";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  TrendingUp,
  Wallet,
} from "@/components/icons";

export function DashboardBalanceStrip({
  displayName,
  summary,
  pnl24h,
}: {
  displayName: string;
  summary: PortfolioSummary;
  pnl24h: number | null;
}) {
  const { t } = useTranslation();
  const pnlTone = pnl24h === null ? null : pnl24h >= 0 ? "up" : "down";

  const metrics = [
    {
      label: t("trade.availableCash"),
      value: formatCurrency(summary.cashBalance, summary.currency),
      icon: Wallet,
    },
    {
      label: t("trade.positions"),
      value: formatCurrency(summary.holdingsValue, summary.currency),
      hint:
        summary.holdingsCount > 0
          ? `${summary.holdingsCount} asset${summary.holdingsCount === 1 ? "" : "s"}`
          : t("trade.noHoldings"),
      icon: TrendingUp,
    },
    {
      label: t("dashboard.totalDeposits"),
      value: formatCurrency(summary.totalDeposits, summary.currency),
      icon: ArrowDownToLine,
    },
    {
      label: t("dashboard.totalWithdrawals"),
      value: formatCurrency(summary.totalWithdrawals, summary.currency),
      icon: ArrowUpFromLine,
    },
  ];

  return (
    <div className="coinix-card relative overflow-hidden p-5 sm:p-6">
      <div className="pointer-events-none absolute inset-0 dashboard-hero-glow" aria-hidden />

      <div className="relative space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">
              {t("dashboard.portfolioBalance")}
            </p>
            <p className="mt-2 text-3xl sm:text-4xl lg:text-[2.75rem] font-bold font-mono text-text-primary tabular-nums tracking-tight">
              {formatCurrency(summary.totalValue, summary.currency)}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <h1 className="text-base sm:text-lg font-semibold text-text-primary">
                {t("dashboard.welcomeBack", {
                  name: displayName.split(" ")[0] || displayName,
                })}
              </h1>
              {pnl24h !== null && (
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold font-mono",
                    pnlTone === "up" && "bg-green/10 text-green",
                    pnlTone === "down" && "bg-red/10 text-red"
                  )}
                >
                  24h {pnl24h >= 0 ? "+" : ""}
                  {formatCurrency(pnl24h, summary.currency)}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-text-tertiary">{t("dashboard.portfolioOverview")}</p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <Link
              href="/dashboard/deposit"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-brand px-5 text-sm font-semibold text-brand-text transition-colors hover:bg-brand-hover"
            >
              {t("dashboard.navDeposit")}
            </Link>
            <Link
              href="/dashboard/withdraw"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-border px-5 text-sm font-medium text-text-primary transition-colors hover:bg-bg-hover"
            >
              {t("dashboard.navWithdraw")}
            </Link>
            <Link
              href="/dashboard/trade"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-border px-5 text-sm font-medium text-text-primary transition-colors hover:bg-bg-hover"
            >
              {t("dashboard.navTrade")}
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.label}
                className="rounded-2xl border border-border/80 bg-bg-primary/50 px-3 py-3 sm:px-4 sm:py-3.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-text-tertiary">
                      {metric.label}
                    </p>
                    <p className="mt-1.5 text-base sm:text-lg font-bold font-mono text-text-primary tabular-nums">
                      {metric.value}
                    </p>
                    {"hint" in metric && metric.hint && (
                      <p className="mt-1 text-[10px] text-text-tertiary line-clamp-1">{metric.hint}</p>
                    )}
                  </div>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/80 bg-bg-secondary text-brand">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
