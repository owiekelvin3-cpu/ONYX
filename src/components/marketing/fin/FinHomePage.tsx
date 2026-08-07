"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { MarketPair } from "@/lib/market-data";
import { FIN_CHART_COLORS } from "@/lib/theme";
import { formatCompact, formatNumber, formatPercent } from "@/lib/utils";
import {
  FinBar,
  FinProgressSegments,
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
    <FinStaggerItem>
      <motion.div className="fin-card p-5 sm:p-6" whileHover={{ y: -4 }}>
        <p className="text-sm text-text-secondary">{label}</p>
        <p className="mt-3 text-3xl font-bold text-text-primary">
          {animated}
          {suffix}
        </p>
        <span className="fin-badge mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold">
          Live
        </span>
      </motion.div>
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
      <FinStagger>
        <FinStaggerItem>
          <div className="mb-4 flex items-end justify-between gap-4 px-1">
            <div>
              <p className="fin-section-label">Live overview</p>
              <h2 className="mt-2 text-xl font-bold text-text-primary sm:text-2xl">
                Real-time market intelligence
              </h2>
            </div>
            <FinPageActions />
          </div>
        </FinStaggerItem>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.5fr)_320px]">
          <FinStaggerItem>
            <div className="fin-panel fin-card overflow-hidden p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-text-primary">Volume overview</h3>
                <select className="rounded-xl border border-border bg-bg-secondary px-3 py-1.5 text-sm text-text-primary">
                  <option>Month</option>
                </select>
              </div>
              <div className="relative flex h-[260px] items-end gap-2 sm:gap-3">
                {bars.map((bar, i) => (
                  <div key={bar.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                    <FinBar
                      height={Math.min(92, bar.height)}
                      delay={0.06 * i}
                      className="w-full max-w-[36px] rounded-t-2xl bg-bg-secondary shadow-sm"
                    />
                    <button
                      type="button"
                      onMouseEnter={() => setHoverMonth(i)}
                      className="text-[11px] text-text-tertiary"
                    >
                      {bar.label}
                    </button>
                  </div>
                ))}
                {hoverMonth !== null && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="fin-badge absolute left-[42%] top-6 rounded-full px-3 py-1 text-xs font-bold shadow-md"
                  >
                    +{formatCompact((pairs[hoverMonth]?.price ?? 50000) / 100)}k
                  </motion.span>
                )}
              </div>
            </div>
          </FinStaggerItem>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <MetricCard label="Execution uptime" value={99} delay={0} />
            <MetricCard label="Fee transparency" value={100} delay={0.05} />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <FinStaggerItem>
            <div className="fin-card p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-text-primary">Top movers</h3>
                <Link href="/markets" className="text-sm font-medium text-text-tertiary hover:text-text-primary">
                  View all
                </Link>
              </div>
              <FinProgressSegments segments={trafficSegments} />
              <div className="mt-5 space-y-3">
                {featured.map((pair, i) => (
                  <motion.div
                    key={pair.symbol}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.06 }}
                    className="flex items-center justify-between rounded-2xl border border-border bg-bg-primary px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: FIN_CHART_COLORS[i % FIN_CHART_COLORS.length] }}
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
                ))}
              </div>
            </div>
          </FinStaggerItem>

          <FinStaggerItem>
            <div className="fin-card p-5 sm:p-6">
              <h3 className="text-lg font-bold text-text-primary">Trading activity</h3>
              <div className="mt-6 flex items-end justify-between gap-2">
                {MONTHS.map((m, i) => (
                  <div key={m} className="flex flex-col items-center gap-2">
                    <motion.div
                      className="h-2 w-2 rounded-full bg-border-light"
                      animate={
                        hoverMonth === i
                          ? { scale: 1.8, backgroundColor: "var(--brand-accent)" }
                          : { scale: 1 }
                      }
                    />
                    <span className="text-[11px] text-text-tertiary">{m}</span>
                  </div>
                ))}
              </div>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="fin-badge mt-6 rounded-2xl px-4 py-3 text-sm font-semibold"
              >
                Peak volume season — trade with zero hidden fees on every pair.
              </motion.div>
              <Link
                href="/dashboard/trade"
                className="fin-btn-primary mt-4 inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-semibold transition-transform hover:scale-[1.02]"
              >
                Open trade desk
              </Link>
            </div>
          </FinStaggerItem>
        </div>
      </FinStagger>
    </section>
  );
}

export function FinHomePage({ pairs }: { pairs: MarketPair[] }) {
  return (
    <div className="mx-auto max-w-[1200px] pb-8">
      <FinStagger className="space-y-4">
        <FinHero />
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
