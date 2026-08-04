import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getHoldings, getUsdBalance } from "@/lib/api/trading";
import { priceForAsset } from "@/lib/market-prices";
import { Card } from "@/components/ui/Card";
import { PortfolioChart } from "@/components/dashboard/PortfolioChartLoader";
import { formatCurrency } from "@/lib/utils";

const DEMO_HOLDINGS = [
  { asset: "BTC", quantity: 0.52, price: 94200 },
  { asset: "ETH", quantity: 4.2, price: 3280 },
  { asset: "SOL", quantity: 38, price: 175 },
];

export default async function PortfolioPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let balance = 24891.5;
  let holdings = DEMO_HOLDINGS.map((h) => ({
    asset: h.asset,
    quantity: h.quantity,
    price: h.price,
    value: h.quantity * h.price,
  }));

  if (user) {
    balance = await getUsdBalance(supabase, user.id);
    const rows = await getHoldings(supabase, user.id);

    if (rows.length > 0) {
      holdings = rows.map((h) => {
        const price = priceForAsset(h.asset);
        return {
          asset: h.asset,
          quantity: h.quantity,
          price,
          value: h.quantity * price,
        };
      });
    } else if (balance === 0) {
      holdings = [];
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-text-primary">Portfolio</h1>

      <Card>
        <PortfolioChart balance={balance || 24891.5} />
      </Card>

      <Card>
        <h3 className="text-[13px] font-semibold mb-3 text-text-primary">Assets</h3>
        {holdings.length > 0 ? (
          <table className="w-full">
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
                  <td className="py-2.5 text-right font-mono">{h.quantity}</td>
                  <td className="py-2.5 text-right font-mono">
                    {formatCurrency(h.price)}
                  </td>
                  <td className="py-2.5 text-right font-mono">
                    {formatCurrency(h.value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
