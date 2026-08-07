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
  FinColorBars,
  FinGlow,
  FinHoverLift,
  FinPulseDot,
  FinScrollStagger,
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
    <div className="fin-card relative overflow-hidden p-6 sm:p-8 lg:p-10">
      <FinGlow className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full" />
      <FinStagger className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div>
          <FinStaggerItem>
            <p className="fin-section-label mb-3">Licensed global broker</p>
          </FinStaggerItem>
          <FinStaggerItem>
            <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-[46px] lg:leading-[1.08]">
              Trade crypto, stocks &amp; forex on one{" "}
              <motion.span
                className="text-brand"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                institutional platform
              </motion.span>
            </h1>
          </FinStaggerItem>
          <FinStaggerItem>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-text-secondary sm:text-base">
              {BRAND.tagline} Deep liquidity, transparent 0.10% fees, and sub-10ms execution —
              built for active traders and professional desks.
            </p>
          </FinStaggerItem>
          <FinStaggerItem>
            <div className="mt-6 flex flex-wrap gap-3">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/register"
                  className="fin-btn-primary inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold"
                >
                  Open free account
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/markets"
                  className="inline-flex h-11 items-center rounded-full border border-border px-6 text-sm font-semibold text-text-primary transition-colors hover:bg-bg-hover"
                >
                  Explore markets
                </Link>
              </motion.div>
            </div>
          </FinStaggerItem>
          <FinStagger>
            <div className="mt-6 flex flex-wrap gap-2">
              {["0.10% spot fees", "500+ pairs", "24/7 support"].map((tag) => (
                <FinStaggerItem key={tag} variant="scale">
                  <motion.span
                    whileHover={{ y: -2 }}
                    className="inline-block rounded-full border border-border bg-bg-primary px-3 py-1 text-xs font-medium text-text-secondary"
                  >
                    {tag}
                  </motion.span>
                </FinStaggerItem>
              ))}
            </div>
          </FinStagger>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {PLATFORM_HIGHLIGHTS.slice(0, 4).map((item) => (
            <FinStaggerItem key={item.title} variant="scale">
              <FinHoverLift className="rounded-2xl border border-border bg-bg-primary p-4">
                <p className="text-xs font-semibold text-text-primary">{item.title}</p>
                <p className="mt-1 text-[11px] leading-snug text-text-tertiary">{item.desc}</p>
              </FinHoverLift>
            </FinStaggerItem>
          ))}
        </div>
      </FinStagger>
    </div>
  );
}

export function FinLiveTicker({ pairs }: { pairs: MarketPair[] }) {
  const ticker = pairs.slice(0, 10);
  const items = [...ticker, ...ticker];

  return (
    <FinStaggerItem>
      <FinHoverLift className="fin-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <p className="flex items-center gap-2 text-sm font-semibold text-text-primary">
            <FinPulseDot />
            Live market prices
          </p>
          <Link href="/markets" className="text-xs font-medium text-text-tertiary hover:text-text-primary">
            Full market view →
          </Link>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="relative overflow-hidden py-2"
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-bg-secondary to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-bg-secondary to-transparent" />
          <div className="flex marquee-track whitespace-nowrap">
            {items.map((pair, i) => (
              <motion.div
                key={`${pair.symbol}-${i}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + (i % 10) * 0.04 }}
                className="inline-flex items-center gap-2 px-5 text-xs"
              >
                <span className="font-semibold text-text-primary">{pair.symbol}</span>
                <span className="font-mono text-text-secondary tabular-nums">
                  ${formatNumber(pair.price, pair.price < 10 ? 4 : 2)}
                </span>
                <span className={`font-mono tabular-nums ${pair.change24h >= 0 ? "text-green" : "text-red"}`}>
                  {formatPercent(pair.change24h)}
                </span>
                <span className="text-border-light mx-1">·</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </FinHoverLift>
    </FinStaggerItem>
  );
}

function StatCard({
  value,
  suffix,
  label,
  decimals = 0,
}: {
  value: number;
  suffix: string;
  label: string;
  decimals?: number;
}) {
  const animated = useFinCountUp(value, { duration: 1.4, decimals });
  return (
    <FinStaggerItem variant="scale">
      <FinHoverLift className="fin-card p-5 text-center sm:p-6">
        <p className="text-2xl font-bold tabular-nums text-text-primary sm:text-3xl">
          <span ref={animated.ref}>{animated.text}</span>
          {suffix}
        </p>
        <p className="mt-2 text-xs text-text-tertiary sm:text-sm">{label}</p>
      </FinHoverLift>
    </FinStaggerItem>
  );
}

export function FinBrokerStats() {
  return (
    <section className="mt-4">
      <FinScrollStagger>
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
      </FinScrollStagger>
    </section>
  );
}

export function FinProductsGrid() {
  return (
    <section className="mt-4">
      <FinScrollStagger>
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
              <FinStaggerItem key={product.title} variant="scale">
                <Link href={product.href} className="group block">
                  <FinHoverLift className="fin-card h-full p-5 sm:p-6">
                    <motion.span
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-bg-primary text-brand"
                      whileHover={{ rotate: 8, scale: 1.08 }}
                      transition={{ type: "spring", stiffness: 400, damping: 18 }}
                    >
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </motion.span>
                    <h3 className="mt-4 text-base font-bold text-text-primary group-hover:text-brand">
                      {product.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">{product.desc}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand">
                      {product.cta}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </FinHoverLift>
                </Link>
              </FinStaggerItem>
            );
          })}
        </div>
      </FinScrollStagger>
    </section>
  );
}

export function FinHowItWorks() {
  return (
    <section className="mt-4">
      <FinScrollStagger>
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
            <FinStaggerItem key={step.step} variant="scale">
              <Link href={STEP_LINKS[i]}>
                <FinHoverLift className="fin-card p-5 sm:p-6">
                  <motion.span
                    className="fin-badge inline-flex rounded-full px-3 py-1 text-xs font-bold"
                    whileHover={{ scale: 1.06 }}
                  >
                    {step.step}
                  </motion.span>
                  <h3 className="mt-4 text-base font-bold text-text-primary">{step.title}</h3>
                  <p className="mt-2 text-sm text-text-secondary">{step.desc}</p>
                </FinHoverLift>
              </Link>
            </FinStaggerItem>
          ))}
        </div>
      </FinScrollStagger>
    </section>
  );
}

export function FinFeaturesGrid() {
  return (
    <section className="mt-4">
      <FinScrollStagger>
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
            <FinStaggerItem key={feature.title} variant="scale">
              <FinHoverLift className="fin-card h-full p-5 sm:p-6">
                <motion.span
                  className="rounded-full bg-brand-light px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-brand"
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                >
                  {feature.tag}
                </motion.span>
                <h3 className="mt-3 text-base font-bold text-text-primary">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{feature.desc}</p>
              </FinHoverLift>
            </FinStaggerItem>
          ))}
        </div>
      </FinScrollStagger>
    </section>
  );
}

export function FinSecurityBlock() {
  return (
    <section className="mt-4">
      <FinScrollStagger className="grid gap-4 lg:grid-cols-2">
        <FinStaggerItem>
          <FinHoverLift className="fin-card p-6 sm:p-8">
            <motion.div
              className="inline-flex items-center gap-2 rounded-full border border-border bg-brand-light px-3 py-1.5 text-xs font-medium text-brand"
              whileHover={{ scale: 1.03 }}
            >
              <Shield className="h-3.5 w-3.5" />
              Enterprise security
            </motion.div>
            <h2 className="mt-4 text-xl font-bold text-text-primary sm:text-2xl">
              Your capital protected at every layer
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              Cold storage, multi-sig withdrawals, and real-time fraud monitoring — the same standards
              institutional desks expect from a prime broker.
            </p>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="mt-6 inline-block">
              <Link
                href="/register"
                className="fin-btn-primary inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold"
              >
                Create secure account
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </FinHoverLift>
        </FinStaggerItem>
        <FinStaggerItem>
          <div className="fin-card p-5 sm:p-6">
            <FinScrollStagger className="grid gap-3 sm:grid-cols-2">
              {SECURITY_FEATURES.map((item) => (
                <FinStaggerItem key={item} variant="slide">
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="flex items-start gap-3 rounded-2xl border border-border bg-bg-primary p-3"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-green/10 text-green">
                      <CircleCheck className="h-4 w-4" />
                    </span>
                    <p className="text-sm font-medium leading-snug text-text-primary">{item}</p>
                  </motion.div>
                </FinStaggerItem>
              ))}
            </FinScrollStagger>
          </div>
        </FinStaggerItem>
      </FinScrollStagger>
    </section>
  );
}

export function FinTestimonials() {
  return (
    <section className="mt-4">
      <FinScrollStagger>
        <FinStaggerItem>
          <div className="mb-4 px-1">
            <p className="fin-section-label">Trader stories</p>
            <h2 className="mt-2 text-xl font-bold text-text-primary sm:text-2xl">
              Built for professionals, loved by teams
            </h2>
          </div>
        </FinStaggerItem>
        <div className="grid gap-3 lg:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <FinStaggerItem key={item.name} variant="scale">
              <FinHoverLift className="fin-card h-full p-5 sm:p-6">
                <FinColorBars colors={FIN_CHART_COLORS.slice(0, 3)} />
                <p className="mt-4 text-sm leading-relaxed text-text-secondary">&ldquo;{item.quote}&rdquo;</p>
                <div className="mt-5 border-t border-border pt-4">
                  <p className="text-sm font-semibold text-text-primary">{item.name}</p>
                  <p className="text-xs text-text-tertiary">{item.role}</p>
                </div>
              </FinHoverLift>
            </FinStaggerItem>
          ))}
        </div>
      </FinScrollStagger>
    </section>
  );
}

export function FinCtaBanner() {
  return (
    <section className="mt-4">
      <FinScrollStagger>
        <FinStaggerItem variant="scale">
          <FinHoverLift className="relative fin-card overflow-hidden p-6 sm:p-8 lg:p-10">
            <motion.div
              className="pointer-events-none absolute inset-0 opacity-30"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              style={{
                backgroundImage:
                  "linear-gradient(110deg, transparent 30%, rgba(226,255,76,0.15) 50%, transparent 70%)",
                backgroundSize: "200% 100%",
              }}
              aria-hidden
            />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
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
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/register"
                    className="fin-btn-primary inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold"
                  >
                    Open free account
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/pricing"
                    className="inline-flex h-11 items-center rounded-full border border-border px-6 text-sm font-semibold text-text-primary hover:bg-bg-hover"
                  >
                    View fees
                  </Link>
                </motion.div>
              </div>
            </div>
          </FinHoverLift>
        </FinStaggerItem>
      </FinScrollStagger>
    </section>
  );
}
