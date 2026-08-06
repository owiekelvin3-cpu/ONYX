import Link from "next/link";
import type { MarketPair } from "@/lib/market-data";
import { MARKET_PAIRS } from "@/lib/market-data";
import { formatCompact, formatNumber, formatPercent } from "@/lib/utils";
import { CryptoIcon } from "@/components/crypto/CryptoIcon";

function pairBaseSymbol(symbol: string) {
  return symbol.split("/")[0] ?? symbol;
}

export function MarketTable({
  pairs = MARKET_PAIRS,
  limit,
  showIcons,
}: {
  pairs?: MarketPair[];
  limit?: number;
  showIcons?: boolean;
}) {
  const rows = limit ? pairs.slice(0, limit) : pairs;

  return (
    <div className="overflow-x-auto -mx-1 px-1">
      <table className="w-full">
        <thead>
          <tr className="text-left text-[11px] text-text-tertiary border-b border-border/80">
            <th className="py-2.5 pl-1 font-medium">Pair</th>
            <th className="py-2.5 font-medium text-right">Price</th>
            <th className="py-2.5 font-medium text-right">24h</th>
            <th className="py-2.5 pr-1 font-medium text-right hidden sm:table-cell">Volume</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((pair) => {
            const base = pairBaseSymbol(pair.symbol);
            const isCrypto = pair.category === "crypto";

            return (
              <tr key={pair.symbol} className="market-row group">
                <td className="py-2.5 pl-1">
                  <Link
                    href="/dashboard/trade"
                    className="flex items-center gap-2.5 text-[13px] font-medium text-text-primary hover:text-brand"
                  >
                    {showIcons && isCrypto && (
                      <CryptoIcon symbol={base} label={base} size="xs" tile={false} />
                    )}
                    <span>{pair.symbol}</span>
                  </Link>
                </td>
                <td className="py-2.5 text-right">
                  <Link
                    href="/dashboard/trade"
                    className="font-mono text-[13px] text-text-primary hover:text-brand tabular-nums"
                  >
                    ${formatNumber(pair.price, pair.price < 10 ? 4 : 2)}
                  </Link>
                </td>
                <td className="py-2.5 text-right">
                  <Link href="/dashboard/trade">
                    <span
                      className={`inline-flex rounded-md px-1.5 py-0.5 text-[11px] font-mono tabular-nums ${
                        pair.change24h >= 0 ? "text-green bg-green/10" : "text-red bg-red/10"
                      }`}
                    >
                      {formatPercent(pair.change24h)}
                    </span>
                  </Link>
                </td>
                <td className="py-2.5 pr-1 text-right hidden sm:table-cell">
                  <Link
                    href="/dashboard/trade"
                    className="text-[11px] font-mono text-text-tertiary hover:text-text-primary tabular-nums"
                  >
                    ${formatCompact(pair.volume24h)}
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
