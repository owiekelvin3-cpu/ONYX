import Link from "next/link";
import {
  TrendingUp,
  ArrowDownToLine,
  ArrowUpFromLine,
  Clock,
  Receipt,
  Comments,
} from "@/components/icons";
import {
  DashboardStatCard,
  DashboardQuickActions,
  DashboardPanel,
} from "@/components/dashboard/DashboardUi";
import { DashboardBalanceStrip } from "@/components/dashboard/DashboardBalanceStrip";
import { PortfolioChart } from "@/components/dashboard/PortfolioChartLoader";
import { MarketTable } from "@/components/dashboard/MarketTable";
import type { PortfolioSummary } from "@/lib/api/trading";
import type { ChartPoint } from "@/lib/chart-data";
import type { MarketPair } from "@/lib/market-data";
import type { TradeRow } from "@/lib/supabase/types";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Props = {
  displayName: string;
  summary: PortfolioSummary;
  pnl24h: number | null;
  openOrders: number;
  tradesCount: number;
  chartData: ChartPoint[];
  recentTrades: TradeRow[];
  marketPairs: MarketPair[];
};

export function DashboardOverview({
  displayName,
  summary,
  pnl24h,
  openOrders,
  tradesCount,
  chartData,
  recentTrades,
  marketPairs,
}: Props) {
  return (
    <div className="mx-auto max-w-6xl space-y-5 sm:space-y-6">
      <DashboardBalanceStrip displayName={displayName} summary={summary} pnl24h={pnl24h} />

      <div className="coinix-card p-4 sm:p-5">
        <PortfolioChart balance={summary.totalValue} chartData={chartData} compact />
      </div>

      <DashboardQuickActions
        icons={{
          Trade: <TrendingUp className="w-[18px] h-[18px]" />,
          Deposit: <ArrowDownToLine className="w-[18px] h-[18px]" />,
          Withdraw: <ArrowUpFromLine className="w-[18px] h-[18px]" />,
          Support: <Comments className="w-[18px] h-[18px]" />,
        }}
      />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
        <DashboardStatCard
          label="24h P&L"
          value={pnl24h === null ? "—" : formatCurrency(pnl24h, summary.currency)}
          tone={pnl24h === null ? "default" : pnl24h >= 0 ? "up" : "down"}
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <DashboardStatCard
          label="Open orders"
          value={openOrders.toString()}
          icon={<Clock className="w-4 h-4" />}
          hint="Pending execution"
        />
        <DashboardStatCard
          label="Total trades"
          value={tradesCount.toString()}
          icon={<Receipt className="w-4 h-4" />}
        />
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        <DashboardPanel
          title="Recent trades"
          className="lg:col-span-2"
          action={
            <Link href="/dashboard/transactions" className="text-xs font-medium text-brand hover:text-brand-hover">
              View all
            </Link>
          }
        >
          {recentTrades.length > 0 ? (
            <div className="space-y-1">
              {recentTrades.map((trade) => (
                <div
                  key={trade.id}
                  className="flex items-center justify-between gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-bg-hover/50"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-text-primary">{trade.asset}</p>
                    <p className="text-[11px] text-text-tertiary capitalize">{trade.type} · {trade.status}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-mono font-medium tabular-nums">
                      {formatCurrency(trade.amount * trade.price, summary.currency)}
                    </p>
                    <p
                      className={cn(
                        "text-[11px] font-mono tabular-nums",
                        trade.type === "buy" ? "text-green" : "text-red"
                      )}
                    >
                      {trade.type}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border px-4 py-8 text-center">
              <p className="text-sm text-text-tertiary">No trades yet.</p>
              <Link href="/dashboard/trade" className="inline-block mt-2 text-sm font-medium text-brand hover:text-brand-hover">
                Place your first order →
              </Link>
            </div>
          )}
        </DashboardPanel>

        <DashboardPanel
          title="Markets"
          className="lg:col-span-3"
          action={
            <Link href="/dashboard/trade" className="text-xs font-medium text-brand hover:text-brand-hover">
              View all
            </Link>
          }
        >
          <MarketTable pairs={marketPairs} limit={6} showIcons />
        </DashboardPanel>
      </div>
    </div>
  );
}
