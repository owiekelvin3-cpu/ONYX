import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { MarketTicker } from "@/components/landing/MarketTicker";
import { TrustBar } from "@/components/landing/TrustBar";
import { MarketsSection } from "@/components/landing/MarketsSection";
import { ProductShowcase } from "@/components/landing/ProductShowcase";
import { GetStarted } from "@/components/landing/GetStarted";
import { Footer } from "@/components/landing/Footer";
import { getCachedLiveMarketPairs } from "@/lib/live-prices";

export default async function HomePage() {
  const pairs = await getCachedLiveMarketPairs();

  return (
    <>
      <Header />
      <main>
        <Hero pairs={pairs} />
        <MarketTicker pairs={pairs} />
        <TrustBar />
        <MarketsSection pairs={pairs} />
        <ProductShowcase />
        <GetStarted />
      </main>
      <Footer />
    </>
  );
}
