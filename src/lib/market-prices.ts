import { MARKET_PAIRS } from "@/lib/market-data";

/** Resolve a live-ish price for a holding asset symbol (e.g. BTC, ETH). */
export function priceForAsset(asset: string): number {
  const upper = asset.toUpperCase();
  const pair = MARKET_PAIRS.find(
    (p) =>
      p.symbol.toUpperCase().startsWith(`${upper}/`) ||
      p.symbol.toUpperCase() === upper
  );
  return pair?.price ?? 0;
}
