import { MarketingPageShell } from "@/components/marketing/MarketingPageShell";
import { ProductShowcase } from "@/components/landing/ProductShowcase";
import { GetStarted } from "@/components/landing/GetStarted";

export const metadata = {
  title: "Products",
  description: "Spot trading, futures, copy trading, and AI bots on ONYX Exchange.",
};

export default function ProductsPage() {
  return (
    <MarketingPageShell
      title="Products built for every trader"
      subtitle="From spot orders to automated strategies — ONYX gives you professional tools without the complexity."
      ctaHref="/register"
    >
      <ProductShowcase />
      <GetStarted />
    </MarketingPageShell>
  );
}
