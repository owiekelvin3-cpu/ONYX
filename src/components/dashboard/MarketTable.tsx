import Link from "next/link";
import type { MarketPair } from "@/lib/market-data";
import { MARKET_PAIRS } from "@/lib/market-data";
import { formatCompact, formatNumber, formatPercent } from "@/lib/utils";

export function MarketTable({
  pairs = MARKET_PAIRS,
  limit,
}: {
  pairs?: MarketPair[];
  limit?: number;
}) {
  const rows = limit ? pairs.slice(0, limit) : pairs;

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-[11px] text-text-tertiary border-b border-border">
            <th className="py-2.5 font-normal">Pair</th>
            <th className="py-2.5 font-normal text-right">Price</th>
            <th className="py-2.5 font-normal text-right">24h</th>
            <th className="py-2.5 font-normal text-right hidden sm:table-cell">Volume</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((pair) => (
            <tr key={pair.symbol} className="market-row">
              <td className="py-2.5">
                <Link href="/dashboard/trade" className="text-[13px] font-medium text-text-primary hover:text-brand">
                  {pair.symbol}
                </Link>
              </td>
              <td className="py-2.5 text-right">
                <Link href="/dashboard/trade" className="font-mono text-[13px] text-text-primary hover:text-brand tabular-nums">
                  ${formatNumber(pair.price, pair.price < 10 ? 4 : 2)}
                </Link>
              </td>
              <td className="py-2.5 text-right">
                <Link href="/dashboard/trade">
                  <span className={`text-[11px] font-mono tabular-nums ${pair.change24h >= 0 ? "text-green" : "text-red"}`}>
                    {formatPercent(pair.change24h)}
                  </span>
                </Link>
              </td>
              <td className="py-2.5 text-right hidden sm:table-cell">
                <Link href="/dashboard/trade" className="text-[11px] font-mono text-text-tertiary hover:text-text-primary">
                  ${formatCompact(pair.volume24h)}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
