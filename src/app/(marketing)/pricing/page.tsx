import { MarketingPageShell } from "@/components/marketing/MarketingPageShell";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "Everything you need to start trading.",
    features: ["Spot trading 0.10%", "Live market data", "Portfolio dashboard", "Mobile web access"],
    cta: "Get started",
    href: "/register",
    featured: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/ month",
    desc: "Advanced tools for active traders.",
    features: ["Reduced fees 0.08%", "AI trading bots", "Copy trading", "Priority support"],
    cta: "Start Pro trial",
    href: "/register",
    featured: true,
  },
  {
    name: "Institutional",
    price: "Custom",
    period: "",
    desc: "Dedicated infrastructure for desks and funds.",
    features: ["FIX / REST API", "Dedicated account manager", "Custom liquidity", "SLA & compliance"],
    cta: "Contact sales",
    href: "/help",
    featured: false,
  },
];

export const metadata = {
  title: "Pricing",
  description: "Transparent pricing and fees on ONYX Exchange.",
};

export default function PricingPage() {
  return (
    <MarketingPageShell
      title="Pricing"
      subtitle="Simple, transparent fees. What you see is what you pay — no hidden spreads."
      ctaHref="/fees"
      ctaLabel="View fee schedule"
    >
      <section className="py-12 sm:py-16">
        <div className="container-app">
          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-lg border p-6 flex flex-col ${
                  plan.featured
                    ? "border-brand bg-bg-secondary shadow-[var(--shadow-glow)]"
                    : "border-border bg-bg-secondary"
                }`}
              >
                {plan.featured && (
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-brand mb-2">
                    Most popular
                  </span>
                )}
                <h3 className="text-[18px] font-bold text-text-primary">{plan.name}</h3>
                <p className="mt-2 text-[13px] text-text-tertiary">{plan.desc}</p>
                <p className="mt-4 text-[32px] font-bold text-text-primary">
                  {plan.price}
                  <span className="text-[14px] font-normal text-text-tertiary">{plan.period}</span>
                </p>
                <ul className="mt-6 space-y-2 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="text-[13px] text-text-secondary flex items-start gap-2">
                      <span className="text-green mt-0.5">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} className="mt-6 block">
                  <Button
                    variant={plan.featured ? "brand" : "outline"}
                    className="w-full rounded-lg"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center mt-10 text-[13px] text-text-tertiary">
            Spot maker/taker fees from 0.10%.{" "}
            <Link href="/fees" className="text-brand hover:underline">
              Full fee details
            </Link>
          </p>
        </div>
      </section>
    </MarketingPageShell>
  );
}
