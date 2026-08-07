import { TradingViewHero } from "@/components/marketing/TradingViewHero";
import { MarketSummaryPanel } from "@/components/marketing/MarketSummaryPanel";
import { ExplorePagesGrid } from "@/components/marketing/ExplorePagesGrid";
import { MarketTicker } from "@/components/landing/MarketTicker";
import { CTABanner } from "@/components/landing/CTABanner";
import { getCachedLiveMarketPairs } from "@/lib/live-prices";

export default async function HomePage() {
  const pairs = await getCachedLiveMarketPairs();

  return (
    <>
      <TradingViewHero />
      <MarketTicker pairs={pairs} />
      <MarketSummaryPanel pairs={pairs} />
      <ExplorePagesGrid />
      <CTABanner />
    </>
  );
}
