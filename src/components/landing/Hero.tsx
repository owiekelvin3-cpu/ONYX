"use client";

import Link from "next/link";
import { useState } from "react";
import { BRAND } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { MARKET_PAIRS } from "@/lib/market-data";
import { formatNumber, formatPercent } from "@/lib/utils";

export function Hero() {
  const [email, setEmail] = useState("");
  const featured = MARKET_PAIRS.slice(0, 5);

  return (
    <section className="bg-bg-primary">
      <div className="container-app pt-8 pb-12 sm:pt-12 sm:pb-16 lg:pt-16 lg:pb-20">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          <div className="min-w-0">
            <h1 className="text-[28px] xs:text-[32px] sm:text-[40px] lg:text-[48px] font-bold leading-[1.12] tracking-tight text-text-primary text-balance">
              {BRAND.tagline}
            </h1>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-text-secondary leading-relaxed max-w-md">
              Open an account on {BRAND.fullName} and trade crypto, stocks, and
              forex from one dashboard — with clear fees and live market data.
            </p>

            <div className="mt-6 sm:mt-8 flex flex-col xs:flex-row gap-2 max-w-md">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-11 sm:h-12 px-4 bg-bg-secondary border border-border rounded text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand transition-colors min-w-0"
              />
              <Link
                href={`/register${email ? `?email=${encodeURIComponent(email)}` : ""}`}
                className="w-full xs:w-auto shrink-0"
              >
                <Button size="lg" className="w-full xs:w-auto">
                  Sign Up
                </Button>
              </Link>
            </div>

            <div className="mt-8 sm:mt-10 grid grid-cols-2 xs:flex xs:flex-wrap gap-x-4 sm:gap-x-8 gap-y-3">
              {featured.map((p) => (
                <div
                  key={p.symbol}
                  className="flex items-baseline gap-1.5 sm:gap-2 min-w-0"
                >
                  <span className="text-[11px] sm:text-xs text-text-tertiary shrink-0">
                    {p.symbol.split("/")[0]}
                  </span>
                  <span className="text-xs sm:text-sm font-medium font-mono truncate">
                    ${formatNumber(p.price, p.price < 10 ? 4 : 2)}
                  </span>
                  <span
                    className={`text-[11px] sm:text-xs font-mono shrink-0 ${p.change24h >= 0 ? "text-green" : "text-red"}`}
                  >
                    {formatPercent(p.change24h)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Trading terminal — visible on all breakpoints */}
          <div className="relative min-w-0 w-full">
            <div className="bg-bg-secondary border border-border rounded-lg overflow-hidden">
              <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 px-3 sm:px-4 py-3 border-b border-border">
                <div className="flex flex-wrap items-center gap-x-2 sm:gap-3 gap-y-1 min-w-0">
                  <span className="text-xs sm:text-sm font-semibold">BTC/USDT</span>
                  <span className="text-base sm:text-lg font-bold font-mono text-green">
                    $97,234.50
                  </span>
                  <span className="text-[11px] sm:text-xs font-mono text-green">
                    +2.34%
                  </span>
                </div>
                <div className="flex gap-1 shrink-0">
                  {["1H", "4H", "1D", "1W"].map((t) => (
                    <span
                      key={t}
                      className={`px-2 py-1 text-[10px] rounded cursor-pointer touch-target flex items-center justify-center ${
                        t === "1D"
                          ? "bg-brand/15 text-brand"
                          : "text-text-tertiary"
                      }`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="h-[160px] sm:h-[200px] lg:h-[220px] relative px-2 pt-2">
                <svg
                  viewBox="0 0 600 200"
                  className="w-full h-full"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0ECB81" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#0ECB81" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,160 L30,155 L60,140 L90,145 L120,120 L150,110 L180,125 L210,90 L240,95 L270,70 L300,80 L330,55 L360,60 L390,40 L420,50 L450,30 L480,35 L510,20 L540,25 L570,10 L600,15 L600,200 L0,200 Z"
                    fill="url(#chartFill)"
                  />
                  <path
                    d="M0,160 L30,155 L60,140 L90,145 L120,120 L150,110 L180,125 L210,90 L240,95 L270,70 L300,80 L330,55 L360,60 L390,40 L420,50 L450,30 L480,35 L510,20 L540,25 L570,10 L600,15"
                    fill="none"
                    stroke="#0ECB81"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-border">
                <div className="p-3 sm:border-r border-border border-b sm:border-b-0">
                  <p className="text-[10px] text-text-tertiary mb-2 uppercase tracking-wider">
                    Order Book
                  </p>
                  {[
                    { price: "97,238", qty: "0.452", side: "sell" },
                    { price: "97,236", qty: "1.203", side: "sell" },
                    { price: "97,234", qty: "0.891", side: "sell" },
                    { price: "97,232", qty: "2.104", side: "buy" },
                    { price: "97,230", qty: "0.567", side: "buy" },
                  ].map((row, i) => (
                    <div
                      key={i}
                      className="flex justify-between text-[11px] font-mono py-0.5"
                    >
                      <span className={row.side === "sell" ? "text-red" : "text-green"}>
                        {row.price}
                      </span>
                      <span className="text-text-tertiary">{row.qty}</span>
                    </div>
                  ))}
                </div>
                <div className="p-3">
                  <div className="flex gap-1 mb-3">
                    <Link
                      href="/dashboard/trade"
                      className="flex-1 h-9 sm:h-7 text-xs font-semibold bg-green text-white rounded cursor-pointer touch-target flex items-center justify-center"
                    >
                      Buy
                    </Link>
                    <Link
                      href="/dashboard/trade"
                      className="flex-1 h-9 sm:h-7 text-xs font-semibold bg-bg-hover text-text-tertiary rounded cursor-pointer touch-target flex items-center justify-center"
                    >
                      Sell
                    </Link>
                  </div>
                  <div className="space-y-2">
                    <div className="h-9 sm:h-7 bg-bg-primary border border-border rounded px-2 flex items-center text-[11px] text-text-tertiary">
                      Market
                    </div>
                    <div className="h-9 sm:h-7 bg-bg-primary border border-border rounded px-2 flex items-center text-[11px] text-text-tertiary">
                      Amount (BTC)
                    </div>
                    <Link
                      href="/dashboard/trade"
                      className="w-full h-10 sm:h-8 bg-green text-white text-xs font-semibold rounded cursor-pointer touch-target flex items-center justify-center"
                    >
                      Buy BTC
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
