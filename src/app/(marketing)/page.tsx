import { PlatformTradingPreview } from "@/components/marketing/PlatformTradingPreview";
import { getCachedLiveMarketPairs } from "@/lib/live-prices";

export default async function HomePage() {
  const pairs = await getCachedLiveMarketPairs();

  return <PlatformTradingPreview pairs={pairs} />;
}
