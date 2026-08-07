import { createClient } from "@/lib/supabase/server";
import {
  getHoldings,
  getPortfolioSummary,
  getProfitTotal,
  getRecentTrades,
} from "@/lib/api/trading";
import { priceForAsset } from "@/lib/market-prices";
import { chartFromTrades } from "@/lib/chart-data";
import { DeckoPortfolio } from "@/components/dashboard/decko/DeckoPortfolio";

export default async function PortfolioPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const emptySummary = {
    cashBalance: 0,
    holdingsValue: 0,
    totalValue: 0,
    holdingsCount: 0,
    currency: "USD",
    totalDeposits: 0,
    totalWithdrawals: 0,
  };

  if (!user) {
    return (
      <DeckoPortfolio
        summary={emptySummary}
        profitTotal={0}
        holdings={[]}
        chartData={chartFromTrades(0, [])}
        recentTrades={[]}
      />
    );
  }

  const [summary, rows, trades, profitTotal] = await Promise.all([
    getPortfolioSummary(supabase, user.id),
    getHoldings(supabase, user.id),
    getRecentTrades(supabase, user.id, 50),
    getProfitTotal(supabase, user.id),
  ]);

  const chartData = chartFromTrades(summary.totalValue, trades);
  const recentTrades = trades.slice(0, 5);

  const holdings =
    rows.length > 0
      ? await Promise.all(
          rows.map(async (h) => {
            const price = await priceForAsset(h.asset);
            return {
              asset: h.asset,
              quantity: h.quantity,
              price,
              value: h.quantity * price,
            };
          })
        )
      : [];

  return (
    <DeckoPortfolio
      summary={summary}
      profitTotal={profitTotal}
      holdings={holdings}
      chartData={chartData}
      recentTrades={recentTrades}
    />
  );
}
