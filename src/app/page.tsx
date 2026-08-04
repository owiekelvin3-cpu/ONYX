import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { MarketTicker } from "@/components/landing/MarketTicker";
import { TrustBar } from "@/components/landing/TrustBar";
import { MarketsSection } from "@/components/landing/MarketsSection";
import { ProductShowcase } from "@/components/landing/ProductShowcase";
import { GetStarted } from "@/components/landing/GetStarted";
import { AppDownload } from "@/components/landing/AppDownload";
import { Footer } from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <MarketTicker />
        <TrustBar />
        <MarketsSection />
        <ProductShowcase />
        <GetStarted />
        <AppDownload />
      </main>
      <Footer />
    </>
  );
}
