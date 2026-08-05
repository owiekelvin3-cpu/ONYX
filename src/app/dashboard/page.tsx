import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  getRecentTrades,
  getUsdBalance,
  getPendingTradesCount,
  get24hProfit,
  tradeNotional,
} from "@/lib/api/trading";
import { getCachedLiveMarketPairs } from "@/lib/live-prices";
import { chartFromTrades } from "@/lib/chart-data";
import { Card } from "@/components/ui/Card";
import { PortfolioChart } from "@/components/dashboard/PortfolioChartLoader";
import { MarketTable } from "@/components/dashboard/MarketTable";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [balance, recentTrades, openOrders, pnl24h, marketPairs, tradesCount] =
    await Promise.all([
      user ? getUsdBalance(supabase, user.id) : Promise.resolve(0),
      user ? getRecentTrades(supabase, user.id, 5) : Promise.resolve([]),
      user ? getPendingTradesCount(supabase, user.id) : Promise.resolve(0),
      user ? get24hProfit(supabase, user.id) : Promise.resolve(null),
      getCachedLiveMarketPairs(),
      user
        ? supabase
            .from("trades")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id)
            .then(({ count }) => count ?? 0)
        : Promise.resolve(0),
    ]);

  const chartData = chartFromTrades(balance, recentTrades);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-base sm:text-lg font-bold text-text-primary">Dashboard</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <Link href="/dashboard/deposit" className="flex-1 sm:flex-none">
            <Button size="sm" className="w-full sm:w-auto">
              Deposit
            </Button>
          </Link>
          <Link href="/dashboard/trade" className="flex-1 sm:flex-none">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              Trade
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {[
          { label: "Total Balance", value: formatCurrency(balance) },
          {
            label: "24h P&L",
            value: pnl24h === null ? "—" : formatCurrency(pnl24h),
            color:
              pnl24h === null
                ? undefined
                : pnl24h >= 0
                  ? "text-green"
                  : "text-red",
          },
          { label: "Open Orders", value: openOrders.toString() },
          { label: "Total Trades", value: tradesCount.toString() },
        ].map((stat) => (
          <Card key={stat.label} className="!p-4">
            <p className="text-[11px] text-text-tertiary">{stat.label}</p>
            <p
              className={`text-lg font-bold mt-1 ${stat.color ?? "text-text-primary"}`}
            >
              {stat.value}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <PortfolioChart balance={balance} chartData={chartData} />
        </Card>
        <Card>
          <h3 className="text-[13px] font-semibold text-text-primary mb-3">
            Recent Trades
          </h3>
          {recentTrades.length > 0 ? (
            <div className="space-y-2">
              {recentTrades.map((trade) => (
                <div
                  key={trade.id}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div>
                    <p className="text-[13px] font-medium">{trade.asset}</p>
                    <p className="text-[11px] text-text-tertiary capitalize">
                      {trade.type}
                    </p>
                  </div>
                  <p className="text-[13px] font-mono">
                    {formatCurrency(tradeNotional(trade))}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[13px] text-text-tertiary">
              No trades yet.{" "}
              <Link href="/dashboard/trade" className="text-brand hover:underline">
                Place your first order
              </Link>
            </p>
          )}
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[13px] font-semibold text-text-primary">
            Market Overview
          </h3>
          <Link
            href="/dashboard/trade"
            className="text-[12px] text-brand hover:underline"
          >
            View all
          </Link>
        </div>
        <MarketTable pairs={marketPairs} limit={6} />
      </Card>
    </div>
  );
}
