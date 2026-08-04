"use client";

import Link from "next/link";
import { useState } from "react";
import { MARKET_PAIRS, type MarketPair } from "@/lib/market-data";
import { formatCompact, formatNumber, formatPercent } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

const TABS = ["Hot", "Gainers", "Losers", "New"] as const;

function MarketCard({ pair, rank }: { pair: MarketPair; rank: number }) {
  return (
    <Link
      href="/dashboard/trade"
      className="flex items-center justify-between p-3.5 bg-bg-secondary border border-border rounded-lg active:bg-bg-hover transition-colors"
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-[11px] text-text-tertiary w-4 shrink-0">{rank}</span>
        <div className="w-8 h-8 rounded-full bg-bg-hover flex items-center justify-center text-[10px] font-bold shrink-0">
          {pair.symbol.slice(0, 2)}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{pair.symbol}</p>
          <p className="text-[11px] text-text-tertiary truncate">{pair.name}</p>
        </div>
      </div>
      <div className="text-right shrink-0 ml-2">
        <p className="text-sm font-mono">
          ${formatNumber(pair.price, pair.price < 10 ? 4 : 2)}
        </p>
        <p
          className={`text-[11px] font-mono mt-0.5 ${pair.change24h >= 0 ? "text-green" : "text-red"}`}
        >
          {formatPercent(pair.change24h)}
        </p>
      </div>
    </Link>
  );
}

export function MarketsSection() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Hot");

  const sorted = [...MARKET_PAIRS].sort((a, b) => {
    if (tab === "Gainers") return b.change24h - a.change24h;
    if (tab === "Losers") return a.change24h - b.change24h;
    return b.volume24h - a.volume24h;
  });

  const displayed = sorted.slice(0, 10);

  return (
    <section id="markets" className="bg-bg-primary py-12 sm:py-16 lg:py-20">
      <div className="container-app">
        <div className="flex flex-col xs:flex-row xs:items-end xs:justify-between gap-3 mb-5 sm:mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
              Market Highlights
            </h2>
            <p className="text-xs sm:text-sm text-text-tertiary mt-1">
              Real-time prices across crypto, stocks, and forex
            </p>
          </div>
          <Link
            href="/dashboard/trade"
            className="flex items-center gap-1 text-sm text-brand hover:text-brand-hover transition-colors w-fit"
          >
            View All Markets
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="scroll-tabs flex gap-4 sm:gap-6 border-b border-border mb-4 sm:mb-0">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-3 text-sm font-medium transition-colors relative cursor-pointer whitespace-nowrap shrink-0 touch-target ${
                tab === t
                  ? "text-text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-brand"
                  : "text-text-tertiary hover:text-text-secondary"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="md:hidden space-y-2 mt-4">
          {displayed.map((pair, i) => (
            <MarketCard key={pair.symbol} pair={pair} rank={i + 1} />
          ))}
        </div>

        <div className="hidden md:block table-scroll mt-4 md:mt-0">
          <table className="w-full min-w-[560px]">
            <thead>
              <tr className="text-left text-xs text-text-tertiary border-b border-border">
                <th className="py-3 pr-4 font-normal w-8">#</th>
                <th className="py-3 pr-4 font-normal">Name</th>
                <th className="py-3 pr-4 font-normal text-right">Last Price</th>
                <th className="py-3 pr-4 font-normal text-right">24h Change</th>
                <th className="py-3 font-normal text-right">24h Volume</th>
              </tr>
            </thead>
            <tbody>
              {displayed.map((pair, i) => (
                <tr key={pair.symbol} className="market-row">
                  <td className="py-3.5 pr-4 text-xs text-text-tertiary">{i + 1}</td>
                  <td className="py-3.5 pr-4">
                    <Link href="/dashboard/trade" className="flex items-center gap-3 hover:opacity-80">
                      <div className="w-7 h-7 rounded-full bg-bg-hover flex items-center justify-center text-[10px] font-bold text-text-secondary">
                        {pair.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <span className="text-sm font-medium text-text-primary">{pair.symbol}</span>
                        <span className="text-xs text-text-tertiary ml-2">{pair.name}</span>
                      </div>
                    </Link>
                  </td>
                  <td className="py-3.5 pr-4 text-right">
                    <Link href="/dashboard/trade" className="text-sm font-mono text-text-primary hover:text-brand">
                      ${formatNumber(pair.price, pair.price < 10 ? 4 : 2)}
                    </Link>
                  </td>
                  <td className="py-3.5 pr-4 text-right">
                    <Link href="/dashboard/trade">
                      <span
                        className={`inline-block text-xs font-mono px-1.5 py-0.5 rounded ${
                          pair.change24h >= 0 ? "text-green bg-green/10" : "text-red bg-red/10"
                        }`}
                      >
                        {formatPercent(pair.change24h)}
                      </span>
                    </Link>
                  </td>
                  <td className="py-3.5 text-right">
                    <Link href="/dashboard/trade" className="text-sm font-mono text-text-tertiary hover:text-text-primary">
                      ${formatCompact(pair.volume24h)}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
