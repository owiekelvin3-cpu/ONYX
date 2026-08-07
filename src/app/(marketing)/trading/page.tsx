import { MarketingPageShell } from "@/components/marketing/MarketingPageShell";
import { SecuritySection } from "@/components/landing/SecuritySection";
import Link from "next/link";
import { PRODUCTS } from "@/lib/constants";

export const metadata = {
  title: "Trading",
  description: "Trade crypto, stocks, and forex on ONYX Exchange with transparent fees.",
};

export default function TradingPage() {
  return (
    <MarketingPageShell
      title="Trading and execution"
      subtitle="Fund your account, place orders, and manage risk — with the same clarity institutional desks expect."
      ctaHref="/dashboard/deposit"
      ctaLabel="Fund account"
    >
      <section className="py-12 sm:py-16 border-b border-border">
        <div className="container-app">
          <h2 className="text-[18px] font-bold text-text-primary mb-6">Trade directly on ONYX</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRODUCTS.map((product) => (
              <Link
                key={product.title}
                href={product.href}
                className="rounded-lg border border-border bg-bg-secondary p-5 hover:border-brand/40 transition-colors"
              >
                <p className="text-[11px] font-semibold uppercase tracking-wider text-brand">Featured</p>
                <h3 className="mt-2 text-[15px] font-semibold text-text-primary">{product.title}</h3>
                <p className="mt-2 text-[13px] text-text-tertiary leading-relaxed">{product.desc}</p>
                <span className="inline-block mt-4 text-[13px] font-medium text-brand">{product.cta} →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <SecuritySection />
    </MarketingPageShell>
  );
}
