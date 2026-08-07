import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { MarketTicker } from "@/components/landing/MarketTicker";
import { StatsSection } from "@/components/landing/StatsSection";
import { TrustBar } from "@/components/landing/TrustBar";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { MarketsSection } from "@/components/landing/MarketsSection";
import { ProductShowcase } from "@/components/landing/ProductShowcase";
import { SecuritySection } from "@/components/landing/SecuritySection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { GetStarted } from "@/components/landing/GetStarted";
import { CTABanner } from "@/components/landing/CTABanner";
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
        <StatsSection />
        <TrustBar />
        <FeaturesSection />
        <MarketsSection pairs={pairs} />
        <ProductShowcase />
        <SecuritySection />
        <TestimonialsSection />
        <GetStarted />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
