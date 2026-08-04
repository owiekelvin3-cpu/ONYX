import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getRecentTrades, getUsdBalance, tradeNotional } from "@/lib/api/trading";
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

  let balance = 0;
  let recentTrades: Awaited<ReturnType<typeof getRecentTrades>> = [];
  let totalTrades = 0;

  if (user) {
    balance = await getUsdBalance(supabase, user.id);
    recentTrades = await getRecentTrades(supabase, user.id, 5);

    const { count } = await supabase
      .from("trades")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);
    totalTrades = count ?? recentTrades.length;
  } else {
    balance = 24891.5;
    totalTrades = 3;
    recentTrades = [
      {
        id: "1",
        user_id: "",
        asset: "BTC/USDT",
        type: "buy",
        amount: 0.05,
        price: 97234.5,
        status: "completed",
        created_at: "",
      },
      {
        id: "2",
        user_id: "",
        asset: "ETH/USDT",
        type: "sell",
        amount: 0.35,
        price: 3456.78,
        status: "completed",
        created_at: "",
      },
      {
        id: "3",
        user_id: "",
        asset: "SOL/USDT",
        type: "buy",
        amount: 4,
        price: 187.42,
        status: "completed",
        created_at: "",
      },
    ];
  }

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
            value: formatCurrency(user ? balance * 0.024 : balance * 0.0127),
            color: "text-green",
          },
          { label: "Open Orders", value: user ? "0" : "3" },
          { label: "Total Trades", value: totalTrades.toString() },
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
          <PortfolioChart balance={balance || 24891.5} />
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
            <p className="text-[13px] text-text-tertiary">No trades yet.</p>
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
        <MarketTable limit={6} />
      </Card>
    </div>
  );
}
