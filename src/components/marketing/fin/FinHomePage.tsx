"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { MarketPair } from "@/lib/market-data";
import { FIN_CHART_COLORS } from "@/lib/theme";
import { formatCompact, formatNumber, formatPercent } from "@/lib/utils";
import {
  FinBar,
  FinColorBars,
  FinHoverLift,
  FinProgressSegments,
  FinPulseDot,
  FinReveal,
  FinScrollStagger,
  FinStagger,
  FinStaggerItem,
  useFinCountUp,
} from "@/components/marketing/fin/fin-motion";
import { FinPageActions } from "@/components/marketing/fin/FinMarketingShell";
import {
  FinBrokerStats,
  FinCtaBanner,
  FinFeaturesGrid,
  FinHero,
  FinHowItWorks,
  FinLiveTicker,
  FinProductsGrid,
  FinSecurityBlock,
  FinTestimonials,
} from "@/components/marketing/fin/FinBrokerSections";

const MONTHS = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb"];

function MetricCard({
  label,
  value,
  suffix = "%",
  delay = 0,
}: {
  label: string;
  value: number;
  suffix?: string;
  delay?: number;
}) {
  const animated = useFinCountUp(value, { duration: 1.2 + delay * 0.1 });
  return (
    <FinStaggerItem variant="scale">
      <FinHoverLift className="fin-card p-5 sm:p-6">
        <p className="text-sm text-text-secondary">{label}</p>
        <p className="mt-3 text-3xl font-bold text-text-primary">
          <span ref={animated.ref}>{animated.text}</span>
          {suffix}
        </p>
        <motion.span
          className="fin-badge mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 + delay, type: "spring", stiffness: 400, damping: 20 }}
        >
          Live
        </motion.span>
      </FinHoverLift>
    </FinStaggerItem>
  );
}

function LiveMarketsDashboard({ pairs }: { pairs: MarketPair[] }) {
  const [hoverMonth, setHoverMonth] = useState<number | null>(3);
  const featured = pairs.slice(0, 6);

  const bars = useMemo(
    () =>
      MONTHS.map((label, i) => ({
        label,
        height: 35 + ((pairs[i]?.change24h ?? 0) + 10) * 2.5 + i * 6,
      })),
    [pairs]
  );

  const trafficSegments = [
    { value: 28, color: FIN_CHART_COLORS[0] },
    { value: 22, color: FIN_CHART_COLORS[1] },
    { value: 18, color: FIN_CHART_COLORS[2] },
    { value: 16, color: FIN_CHART_COLORS[3] },
    { value: 16, color: FIN_CHART_COLORS[4] },
  ];

  return (
    <section className="mt-4">
      <FinScrollStagger>
        <div className="mb-4 flex items-end justify-between gap-4 px-1">
          <div>
            <FinReveal delay={0}>
              <p className="fin-section-label flex items-center gap-2">
                <FinPulseDot />
                Live overview
              </p>
            </FinReveal>
            <FinReveal delay={0.08}>
              <h2 className="mt-2 text-xl font-bold text-text-primary sm:text-2xl">
                Real-time market intelligence
              </h2>
            </FinReveal>
            <FinReveal delay={0.14}>
              <FinColorBars colors={FIN_CHART_COLORS} className="mt-3" />
            </FinReveal>
          </div>
          <FinReveal delay={0.12} y={12}>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
            >
              <FinPageActions />
            </motion.div>
          </FinReveal>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.5fr)_320px]">
          <FinStaggerItem variant="scale">
            <FinHoverLift className="fin-panel fin-card overflow-hidden p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-text-primary">Volume overview</h3>
                <motion.select
                  whileHover={{ scale: 1.02 }}
                  className="rounded-xl border border-border bg-bg-secondary px-3 py-1.5 text-sm text-text-primary"
                >
                  <option>Month</option>
                </motion.select>
              </div>
              <div className="relative flex h-[260px] items-end gap-2 sm:gap-3">
                {bars.map((bar, i) => (
                  <motion.div
                    key={bar.label}
                    className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.08 * i, duration: 0.4 }}
                  >
                    <FinBar
                      height={Math.min(92, bar.height)}
                      delay={0.06 * i}
                      className="w-full max-w-[36px] rounded-t-2xl bg-bg-secondary shadow-sm"
                    />
                    <motion.button
                      type="button"
                      onMouseEnter={() => setHoverMonth(i)}
                      whileHover={{ scale: 1.1, color: "var(--text-primary)" }}
                      className="text-[11px] text-text-tertiary"
                    >
                      {bar.label}
                    </motion.button>
                  </motion.div>
                ))}
                {hoverMonth !== null && (
                  <motion.span
                    key={hoverMonth}
                    initial={{ opacity: 0, scale: 0.85, y: 6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ type: "spring", stiffness: 500, damping: 26 }}
                    className="fin-badge absolute left-[42%] top-6 rounded-full px-3 py-1 text-xs font-bold shadow-md"
                  >
                    +{formatCompact((pairs[hoverMonth]?.price ?? 50000) / 100)}k
                  </motion.span>
                )}
              </div>
            </FinHoverLift>
          </FinStaggerItem>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <MetricCard label="Execution uptime" value={99} delay={0} />
            <MetricCard label="Fee transparency" value={100} delay={0.05} />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <FinStaggerItem variant="scale">
            <FinHoverLift className="fin-card p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-text-primary">Top movers</h3>
                <Link href="/markets" className="text-sm font-medium text-text-tertiary hover:text-text-primary">
                  View all
                </Link>
              </div>
              <FinProgressSegments segments={trafficSegments} />
              <FinScrollStagger className="mt-5 space-y-3">
                {featured.map((pair, i) => (
                  <FinStaggerItem key={pair.symbol} variant="slide">
                    <motion.div
                      whileHover={{ x: 4, scale: 1.01 }}
                      className="flex items-center justify-between rounded-2xl border border-border bg-bg-primary px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <motion.span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: FIN_CHART_COLORS[i % FIN_CHART_COLORS.length] }}
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                        />
                        <div>
                          <p className="font-semibold text-text-primary">{pair.symbol}</p>
                          <p className="text-xs text-text-tertiary">{pair.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-sm font-semibold text-text-primary">
                          ${formatNumber(pair.price, pair.price < 10 ? 4 : 2)}
                        </p>
                        <p className={pair.change24h >= 0 ? "text-xs text-green" : "text-xs text-red"}>
                          {formatPercent(pair.change24h)}
                        </p>
                      </div>
                    </motion.div>
                  </FinStaggerItem>
                ))}
              </FinScrollStagger>
            </FinHoverLift>
          </FinStaggerItem>

          <FinStaggerItem variant="scale">
            <FinHoverLift className="fin-card p-5 sm:p-6">
              <h3 className="text-lg font-bold text-text-primary">Trading activity</h3>
              <div className="mt-6 flex items-end justify-between gap-2">
                {MONTHS.map((m, i) => (
                  <motion.div
                    key={m}
                    className="flex flex-col items-center gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.05 * i }}
                  >
                    <motion.div
                      className="h-2 w-2 rounded-full bg-border-light"
                      animate={
                        hoverMonth === i
                          ? { scale: 1.8, backgroundColor: "var(--brand-accent)" }
                          : { scale: 1 }
                      }
                      whileHover={{ scale: 1.4, backgroundColor: "var(--brand-accent)" }}
                      onHoverStart={() => setHoverMonth(i)}
                    />
                    <span className="text-[11px] text-text-tertiary">{m}</span>
                  </motion.div>
                ))}
              </div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="fin-badge mt-6 rounded-2xl px-4 py-3 text-sm font-semibold"
              >
                Peak volume season — trade with zero hidden fees on every pair.
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="mt-4 inline-block"
              >
                <Link
                  href="/dashboard/trade"
                  className="fin-btn-primary inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-semibold"
                >
                  Open trade desk
                </Link>
              </motion.div>
            </FinHoverLift>
          </FinStaggerItem>
        </div>
      </FinScrollStagger>
    </section>
  );
}

export function FinHomePage({ pairs }: { pairs: MarketPair[] }) {
  return (
    <div className="mx-auto max-w-[1200px] pb-8">
      <FinStagger className="space-y-4">
        <FinStaggerItem variant="scale">
          <FinHero />
        </FinStaggerItem>
        <FinLiveTicker pairs={pairs} />
      </FinStagger>

      <LiveMarketsDashboard pairs={pairs} />
      <FinProductsGrid />
      <FinBrokerStats />
      <FinHowItWorks />
      <FinFeaturesGrid />
      <FinSecurityBlock />
      <FinTestimonials />
      <FinCtaBanner />
    </div>
  );
}
