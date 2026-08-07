"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { MarketPair } from "@/lib/market-data";
import {
  BRAND,
  PLATFORM_HIGHLIGHTS,
  PLATFORM_STATS,
  PREMIUM_FEATURES,
  PRODUCTS,
  SECURITY_FEATURES,
  STEPS,
  TESTIMONIALS,
} from "@/lib/constants";
import { FIN_CHART_COLORS } from "@/lib/theme";
import { formatNumber, formatPercent } from "@/lib/utils";
import {
  FinStagger,
  FinStaggerItem,
  useFinCountUp,
} from "@/components/marketing/fin/fin-motion";
import {
  ArrowRight,
  Bot,
  CircleCheck,
  Copy,
  LineChart,
  Shield,
  TrendingUp,
} from "@/components/icons";

const PRODUCT_ICONS = [LineChart, TrendingUp, Copy, Bot] as const;
const STEP_LINKS = ["/register", "/help", "/dashboard/deposit"];

export function FinHero() {
  return (
    <FinStaggerItem>
      <div className="fin-card relative overflow-hidden p-6 sm:p-8 lg:p-10">
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-40"
          style={{ background: "radial-gradient(circle, var(--brand-accent) 0%, transparent 70%)" }}
          aria-hidden
        />
        <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="fin-section-label mb-3">Licensed global broker</p>
            <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-[46px] lg:leading-[1.08]">
              Trade crypto, stocks &amp; forex on one{" "}
              <span className="text-brand">institutional platform</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-text-secondary sm:text-base">
              {BRAND.tagline} Deep liquidity, transparent 0.10% fees, and sub-10ms execution —
              built for active traders and professional desks.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/register"
                className="fin-btn-primary inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold transition-transform hover:scale-[1.02]"
              >
                Open free account
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/markets"
                className="inline-flex h-11 items-center rounded-full border border-border px-6 text-sm font-semibold text-text-primary transition-colors hover:bg-bg-hover"
              >
                Explore markets
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {["0.10% spot fees", "500+ pairs", "24/7 support"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border bg-bg-primary px-3 py-1 text-xs font-medium text-text-secondary"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {PLATFORM_HIGHLIGHTS.slice(0, 4).map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="rounded-2xl border border-border bg-bg-primary p-4"
              >
                <p className="text-xs font-semibold text-text-primary">{item.title}</p>
                <p className="mt-1 text-[11px] leading-snug text-text-tertiary">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </FinStaggerItem>
  );
}

export function FinLiveTicker({ pairs }: { pairs: MarketPair[] }) {
  const ticker = pairs.slice(0, 10);
  const items = [...ticker, ...ticker];

  return (
    <FinStaggerItem>
      <div className="fin-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <p className="text-sm font-semibold text-text-primary">Live market prices</p>
          <Link href="/markets" className="text-xs font-medium text-text-tertiary hover:text-text-primary">
            Full market view →
          </Link>
        </div>
        <div className="relative overflow-hidden py-2">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-bg-secondary to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-bg-secondary to-transparent" />
          <div className="flex marquee-track whitespace-nowrap">
            {items.map((pair, i) => (
              <div key={`${pair.symbol}-${i}`} className="inline-flex items-center gap-2 px-5 text-xs">
                <span className="font-semibold text-text-primary">{pair.symbol}</span>
                <span className="font-mono text-text-secondary tabular-nums">
                  ${formatNumber(pair.price, pair.price < 10 ? 4 : 2)}
                </span>
                <span className={`font-mono tabular-nums ${pair.change24h >= 0 ? "text-green" : "text-red"}`}>
                  {formatPercent(pair.change24h)}
                </span>
                <span className="text-border-light mx-1">·</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FinStaggerItem>
  );
}

function StatCard({ value, suffix, label, decimals = 0 }: { value: number; suffix: string; label: string; decimals?: number }) {
  const animated = useFinCountUp(value, { duration: 1.4, decimals });
  return (
    <FinStaggerItem>
      <motion.div className="fin-card p-5 text-center sm:p-6" whileHover={{ y: -4 }}>
        <p className="text-2xl font-bold tabular-nums text-text-primary sm:text-3xl">
          {animated}
          {suffix}
        </p>
        <p className="mt-2 text-xs text-text-tertiary sm:text-sm">{label}</p>
      </motion.div>
    </FinStaggerItem>
  );
}

export function FinBrokerStats() {
  return (
    <section className="mt-4">
      <FinStagger>
        <FinStaggerItem>
          <div className="mb-4 px-1">
            <p className="fin-section-label">Platform scale</p>
            <h2 className="mt-2 text-xl font-bold text-text-primary sm:text-2xl">
              Trusted by millions of traders worldwide
            </h2>
          </div>
        </FinStaggerItem>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {PLATFORM_STATS.map((stat) => (
            <StatCard
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              decimals={stat.value === 99.99 ? 2 : 0}
            />
          ))}
        </div>
      </FinStagger>
    </section>
  );
}

export function FinProductsGrid() {
  return (
    <section className="mt-4">
      <FinStagger>
        <FinStaggerItem>
          <div className="mb-4 flex items-end justify-between gap-4 px-1">
            <div>
              <p className="fin-section-label">Trading products</p>
              <h2 className="mt-2 text-xl font-bold text-text-primary sm:text-2xl">
                Every asset class, one broker account
              </h2>
            </div>
            <Link href="/products" className="hidden text-sm font-medium text-text-tertiary hover:text-text-primary sm:block">
              All products →
            </Link>
          </div>
        </FinStaggerItem>
        <div className="grid gap-3 sm:grid-cols-2">
          {PRODUCTS.map((product, i) => {
            const Icon = PRODUCT_ICONS[i];
            return (
              <FinStaggerItem key={product.title}>
                <Link href={product.href} className="group block">
                  <motion.div
                    className="fin-card h-full p-5 sm:p-6"
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  >
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-bg-primary text-brand">
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                    <h3 className="mt-4 text-base font-bold text-text-primary group-hover:text-brand">
                      {product.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">{product.desc}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand">
                      {product.cta}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </motion.div>
                </Link>
              </FinStaggerItem>
            );
          })}
        </div>
      </FinStagger>
    </section>
  );
}

export function FinHowItWorks() {
  return (
    <section className="mt-4">
      <FinStagger>
        <FinStaggerItem>
          <div className="mb-4 px-1">
            <p className="fin-section-label">Get started</p>
            <h2 className="mt-2 text-xl font-bold text-text-primary sm:text-2xl">
              From signup to first trade in minutes
            </h2>
          </div>
        </FinStaggerItem>
        <div className="grid gap-3 lg:grid-cols-3">
          {STEPS.map((step, i) => (
            <FinStaggerItem key={step.step}>
              <Link href={STEP_LINKS[i]}>
                <motion.div className="fin-card p-5 sm:p-6" whileHover={{ y: -4 }}>
                  <span className="fin-badge inline-flex rounded-full px-3 py-1 text-xs font-bold">
                    {step.step}
                  </span>
                  <h3 className="mt-4 text-base font-bold text-text-primary">{step.title}</h3>
                  <p className="mt-2 text-sm text-text-secondary">{step.desc}</p>
                </motion.div>
              </Link>
            </FinStaggerItem>
          ))}
        </div>
      </FinStagger>
    </section>
  );
}

export function FinFeaturesGrid() {
  return (
    <section className="mt-4">
      <FinStagger>
        <FinStaggerItem>
          <div className="mb-4 px-1">
            <p className="fin-section-label">Why ONYX</p>
            <h2 className="mt-2 text-xl font-bold text-text-primary sm:text-2xl">
              Professional infrastructure for every trader
            </h2>
          </div>
        </FinStaggerItem>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PREMIUM_FEATURES.map((feature) => (
            <FinStaggerItem key={feature.title}>
              <motion.div className="fin-card h-full p-5 sm:p-6" whileHover={{ y: -4 }}>
                <span className="rounded-full bg-brand-light px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-brand">
                  {feature.tag}
                </span>
                <h3 className="mt-3 text-base font-bold text-text-primary">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{feature.desc}</p>
              </motion.div>
            </FinStaggerItem>
          ))}
        </div>
      </FinStagger>
    </section>
  );
}

export function FinSecurityBlock() {
  return (
    <section className="mt-4">
      <FinStagger className="grid gap-4 lg:grid-cols-2">
        <FinStaggerItem>
          <div className="fin-card p-6 sm:p-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-brand-light px-3 py-1.5 text-xs font-medium text-brand">
              <Shield className="h-3.5 w-3.5" />
              Enterprise security
            </div>
            <h2 className="mt-4 text-xl font-bold text-text-primary sm:text-2xl">
              Your capital protected at every layer
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              Cold storage, multi-sig withdrawals, and real-time fraud monitoring — the same standards
              institutional desks expect from a prime broker.
            </p>
            <Link
              href="/register"
              className="fin-btn-primary mt-6 inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold"
            >
              Create secure account
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </FinStaggerItem>
        <FinStaggerItem>
          <div className="fin-card p-5 sm:p-6">
            <div className="grid gap-3 sm:grid-cols-2">
              {SECURITY_FEATURES.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3 rounded-2xl border border-border bg-bg-primary p-3"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-green/10 text-green">
                    <CircleCheck className="h-4 w-4" />
                  </span>
                  <p className="text-sm font-medium leading-snug text-text-primary">{item}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </FinStaggerItem>
      </FinStagger>
    </section>
  );
}

export function FinTestimonials() {
  return (
    <section className="mt-4">
      <FinStagger>
        <FinStaggerItem>
          <div className="mb-4 px-1">
            <p className="fin-section-label">Trader stories</p>
            <h2 className="mt-2 text-xl font-bold text-text-primary sm:text-2xl">
              Built for professionals, loved by teams
            </h2>
          </div>
        </FinStaggerItem>
        <div className="grid gap-3 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <FinStaggerItem key={t.name}>
              <motion.div className="fin-card h-full p-5 sm:p-6" whileHover={{ y: -4 }}>
                <div className="flex gap-1">
                  {FIN_CHART_COLORS.slice(0, 3).map((c) => (
                    <span key={c} className="h-1.5 w-6 rounded-full" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-text-secondary">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-5 border-t border-border pt-4">
                  <p className="text-sm font-semibold text-text-primary">{t.name}</p>
                  <p className="text-xs text-text-tertiary">{t.role}</p>
                </div>
              </motion.div>
            </FinStaggerItem>
          ))}
        </div>
      </FinStagger>
    </section>
  );
}

export function FinCtaBanner() {
  return (
    <section className="mt-4">
      <FinStaggerItem>
        <motion.div
          className="fin-card overflow-hidden p-6 sm:p-8 lg:p-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-text-primary sm:text-3xl">
                Ready to trade with ONYX?
              </h2>
              <p className="mt-2 max-w-lg text-sm text-text-secondary sm:text-base">
                Join millions of traders on a broker built for speed, transparency, and control.
                No minimum deposit. Start in under 60 seconds.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/register"
                className="fin-btn-primary inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold"
              >
                Open free account
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex h-11 items-center rounded-full border border-border px-6 text-sm font-semibold text-text-primary hover:bg-bg-hover"
              >
                View fees
              </Link>
            </div>
          </div>
        </motion.div>
      </FinStaggerItem>
    </section>
  );
}
