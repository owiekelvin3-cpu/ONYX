import { TICKER_PAIRS } from "@/lib/market-data";
import { formatNumber, formatPercent } from "@/lib/utils";

export function MarketTicker() {
  const items = [...TICKER_PAIRS, ...TICKER_PAIRS];

  return (
    <div className="bg-bg-secondary border-y border-border overflow-hidden">
      <div className="flex marquee-track whitespace-nowrap py-2.5">
        {items.map((pair, i) => (
          <div
            key={`${pair.symbol}-${i}`}
            className="inline-flex items-center gap-2.5 px-5 text-xs"
          >
            <span className="font-medium text-text-primary">
              {pair.symbol}
            </span>
            <span className="font-mono text-text-secondary">
              ${formatNumber(pair.price, pair.price < 10 ? 4 : 2)}
            </span>
            <span
              className={`font-mono ${pair.change24h >= 0 ? "text-green" : "text-red"}`}
            >
              {formatPercent(pair.change24h)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
