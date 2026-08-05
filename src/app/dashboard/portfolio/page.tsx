import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getHoldings, getUsdBalance, getRecentTrades } from "@/lib/api/trading";
import { priceForAsset } from "@/lib/market-prices";
import { chartFromTrades } from "@/lib/chart-data";
import { Card } from "@/components/ui/Card";
import { PortfolioChart } from "@/components/dashboard/PortfolioChartLoader";
import { formatCurrency } from "@/lib/utils";

export default async function PortfolioPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let balance = 0;
  let holdings: { asset: string; quantity: number; price: number; value: number }[] = [];
  let chartData = chartFromTrades(0, []);

  if (user) {
    balance = await getUsdBalance(supabase, user.id);
    const [rows, trades] = await Promise.all([
      getHoldings(supabase, user.id),
      getRecentTrades(supabase, user.id, 50),
    ]);

    chartData = chartFromTrades(balance, trades);

    if (rows.length > 0) {
      holdings = await Promise.all(
        rows.map(async (h) => {
          const price = await priceForAsset(h.asset);
          return {
            asset: h.asset,
            quantity: h.quantity,
            price,
            value: h.quantity * price,
          };
        })
      );
    }
  }

  return (
    <div className="space-y-4 min-w-0">
      <h1 className="text-base sm:text-lg font-bold text-text-primary">Portfolio</h1>

      <Card className="min-w-0 overflow-hidden">
        <PortfolioChart balance={balance} chartData={chartData} />
      </Card>

      <Card className="min-w-0 overflow-hidden">
        <h3 className="text-[13px] font-semibold mb-3 text-text-primary">Assets</h3>
        {holdings.length > 0 ? (
          <>
            <div className="md:hidden space-y-2">
              {holdings.map((h) => (
                <div
                  key={h.asset}
                  className="flex items-center justify-between gap-3 p-3 rounded-lg bg-bg-primary border border-border"
                >
                  <div>
                    <p className="text-sm font-semibold">{h.asset}</p>
                    <p className="text-[11px] text-text-tertiary font-mono mt-0.5">
                      {h.quantity} units
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-mono font-medium">{formatCurrency(h.value)}</p>
                    <p className="text-[11px] text-text-tertiary font-mono">
                      @ {formatCurrency(h.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="hidden md:block table-scroll">
              <table className="w-full min-w-[420px]">
                <thead>
                  <tr className="text-[11px] text-text-tertiary border-b border-border">
                    <th className="text-left py-2 font-normal">Asset</th>
                    <th className="text-right py-2 font-normal">Quantity</th>
                    <th className="text-right py-2 font-normal">Price</th>
                    <th className="text-right py-2 font-normal">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {holdings.map((h) => (
                    <tr
                      key={h.asset}
                      className="border-b border-border/50 text-[13px]"
                    >
                      <td className="py-2.5 font-medium">{h.asset}</td>
                      <td className="py-2.5 text-right font-mono tabular-nums">{h.quantity}</td>
                      <td className="py-2.5 text-right font-mono tabular-nums">
                        {formatCurrency(h.price)}
                      </td>
                      <td className="py-2.5 text-right font-mono tabular-nums">
                        {formatCurrency(h.value)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="text-[13px] text-text-tertiary">
            No assets yet.{" "}
            <Link href="/dashboard/trade" className="text-brand hover:underline">
              Start trading
            </Link>
          </p>
        )}
      </Card>
    </div>
  );
}
