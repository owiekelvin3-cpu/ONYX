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
        <p className="text-sm text-[#6B7280]">{label}</p>
        <p className="mt-3 text-3xl font-bold text-[#111111]">
          {animated}
          {suffix}
        </p>
        <span className="mt-3 inline-flex rounded-full bg-[var(--brand-accent)] px-3 py-1 text-xs font-semibold text-[#111111]">
          Live
        </span>
      </motion.div>
    </FinStaggerItem>
  );
}

export function FinHomePage({ pairs }: { pairs: MarketPair[] }) {
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
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#111111] sm:text-4xl lg:text-[42px]">
            ONYX market report
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#6B7280] sm:text-base">
            Prevention measures — transparent fees, real-time risk controls, and institutional-grade
            execution across every asset class.
          </p>
        </div>
        <FinPageActions />
      </div>

      <FinStagger className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.5fr)_320px]">
        <FinStaggerItem>
          <div className="fin-panel fin-card overflow-hidden p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#111111]">Overview</h2>
              <select className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-1.5 text-sm">
                <option>Month</option>
              </select>
            </div>
            <div className="relative flex h-[260px] items-end gap-2 sm:gap-3">
              {bars.map((bar, i) => (
                <div key={bar.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                  <FinBar
                    height={Math.min(92, bar.height)}
                    delay={0.06 * i}
                    className="w-full max-w-[36px] rounded-t-2xl bg-white shadow-sm"
                  />
                  <button
                    type="button"
                    onMouseEnter={() => setHoverMonth(i)}
                    className="text-[11px] text-[#9CA3AF]"
                  >
                    {bar.label}
                  </button>
                </div>
              ))}
              {hoverMonth !== null && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute left-[42%] top-6 rounded-full bg-[var(--brand-accent)] px-3 py-1 text-xs font-bold text-[#111111] shadow-md"
                >
                  +{formatCompact((pairs[hoverMonth]?.price ?? 50000) / 100)}k
                </motion.span>
              )}
            </div>
          </div>
        </FinStaggerItem>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <MetricCard label="Performance" value={88} delay={0} />
          <MetricCard label="Prevention" value={99} delay={0.05} />
        </div>
      </FinStagger>

      <FinStagger className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <FinStaggerItem>
          <div className="fin-card p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#111111]">Market traffic</h2>
              <Link href="/markets" className="text-sm font-medium text-[#6B7280] hover:text-[#111111]">
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
                  className="flex items-center justify-between rounded-2xl border border-[#ECEEF2] px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: FIN_CHART_COLORS[i % FIN_CHART_COLORS.length] }}
                    />
                    <div>
                      <p className="font-semibold text-[#111111]">{pair.symbol}</p>
                      <p className="text-xs text-[#9CA3AF]">{pair.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm font-semibold">
                      ${formatNumber(pair.price, pair.price < 10 ? 4 : 2)}
                    </p>
                    <p className={pair.change24h >= 0 ? "text-xs text-[#34D399]" : "text-xs text-[#F87171]"}>
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
            <h2 className="text-lg font-bold text-[#111111]">Activity timeline</h2>
            <div className="mt-6 flex items-end justify-between gap-2">
              {MONTHS.map((m, i) => (
                <div key={m} className="flex flex-col items-center gap-2">
                  <motion.div
                    className="h-2 w-2 rounded-full bg-[#D1D5DB]"
                    animate={hoverMonth === i ? { scale: 1.8, backgroundColor: "#111111" } : { scale: 1 }}
                  />
                  <span className="text-[11px] text-[#9CA3AF]">{m}</span>
                </div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-6 rounded-2xl bg-[var(--brand-accent)] px-4 py-3 text-sm font-semibold text-[#111111]"
            >
              November peak volume — start trading with zero hidden fees.
            </motion.div>
            <Link
              href="/register"
              className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-[#111111] px-6 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
            >
              Get started free
            </Link>
          </div>
        </FinStaggerItem>
      </FinStagger>
    </div>
  );
}
