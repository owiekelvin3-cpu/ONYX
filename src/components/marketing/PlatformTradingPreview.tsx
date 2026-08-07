"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import type { MarketPair } from "@/lib/market-data";
import {
  buildMarketTrades,
  buildOrderBook,
  formatPairVolume,
  pairHighLow,
} from "@/lib/terminal-mock-data";
import { formatNumber, formatPercent } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { TradingViewAdvancedChart } from "@/components/trading/TradingViewAdvancedChart";
import {
  Bell,
  Bot,
  Comments,
  LayoutDashboard,
  LogOut,
  Receipt,
  Settings,
  TrendingUp,
  Wallet,
} from "@/components/icons";
import { OnyxLogo } from "@/components/brand/OnyxLogo";

const SIDEBAR_ITEMS = [
  { icon: Bell, label: "Alerts", href: "/register" },
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: TrendingUp, label: "Trade", href: "/dashboard/trade", active: true },
  { icon: Wallet, label: "Portfolio", href: "/dashboard/portfolio" },
  { icon: Receipt, label: "Orders", href: "/dashboard/transactions" },
  { icon: Settings, label: "Account", href: "/dashboard/settings" },
  { icon: Comments, label: "Support", href: "/dashboard/support" },
  { icon: Bot, label: "AI Trading", href: "/dashboard/ai-trading" },
] as const;

const TIMEFRAMES = ["1M", "1W", "1D", "1H", "15m", "5m", "1m"] as const;

type PlatformTradingPreviewProps = {
  pairs: MarketPair[];
};

export function PlatformTradingPreview({ pairs }: PlatformTradingPreviewProps) {
  const [selectedSymbol, setSelectedSymbol] = useState(
    pairs.find((p) => p.symbol === "BTC/USDT")?.symbol ?? pairs[0]?.symbol ?? "BTC/USDT"
  );
  const [orderType, setOrderType] = useState<"limit" | "market" | "stop">("limit");
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [activeTab, setActiveTab] = useState<"trades" | "orders" | "history">("trades");

  const pair = pairs.find((p) => p.symbol === selectedSymbol) ?? pairs[0];
  const orderBook = useMemo(
    () => (pair ? buildOrderBook(pair.price, pair.symbol) : []),
    [pair]
  );
  const trades = useMemo(
    () => (pair ? buildMarketTrades(pair.price) : []),
    [pair]
  );
  const { high, low } = pair ? pairHighLow(pair) : { high: 0, low: 0 };
  const volume = pair ? formatPairVolume(pair) : { base: "—", quote: "—" };
  const sells = orderBook.filter((r) => r.side === "sell").reverse();
  const buys = orderBook.filter((r) => r.side === "buy");
  const priceDecimals = pair && pair.price < 10 ? 4 : pair && pair.price < 1000 ? 2 : 0;

  if (!pair) return null;

  return (
    <section className="terminal-showcase bg-[#0B1222] text-[#D1D4DC]">
      <div className="terminal-showcase-shell flex min-h-[calc(100dvh-54px)] flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-[58px] shrink-0 flex-col items-center border-r border-[#1A2332] bg-[#0A101C] py-3">
          <Link href="/" className="mb-4 flex h-9 w-9 items-center justify-center">
            <OnyxLogo size={28} />
          </Link>
          <nav className="flex flex-1 flex-col items-center gap-1">
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = item.href === "/dashboard/trade";
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  title={item.label}
                  className={cn(
                    "relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                    active
                      ? "bg-[#43D9D9]/15 text-[#43D9D9]"
                      : "text-[#787B86] hover:bg-[#151D2B] hover:text-[#D1D4DC]"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label === "Alerts" && (
                    <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#F05350]" />
                  )}
                </Link>
              );
            })}
          </nav>
          <Link
            href="/login"
            title="Sign out"
            className="mt-2 flex h-10 w-10 items-center justify-center rounded-lg text-[#787B86] hover:bg-[#151D2B] hover:text-[#D1D4DC]"
          >
            <LogOut className="h-4 w-4" />
          </Link>
        </aside>

        {/* Main workspace */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Stats bar */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-[#1A2332] bg-[#0B1222] px-3 py-2.5 sm:px-4">
            <div className="flex items-center gap-2 min-w-0">
              <select
                value={selectedSymbol}
                onChange={(e) => setSelectedSymbol(e.target.value)}
                className="bg-transparent text-sm sm:text-base font-semibold text-white outline-none cursor-pointer"
              >
                {pairs.slice(0, 8).map((p) => (
                  <option key={p.symbol} value={p.symbol} className="bg-[#131722]">
                    {p.symbol}
                  </option>
                ))}
              </select>
            </div>

            <Stat label="Last Price" value={`$${formatNumber(pair.price, priceDecimals)}`} accent />
            <Stat
              label="24h Change"
              value={formatPercent(pair.change24h)}
              className={pair.change24h >= 0 ? "text-[#43D9D9]" : "text-[#F05350]"}
            />
            <Stat label="24h High" value={`$${formatNumber(high, priceDecimals)}`} hideMobile />
            <Stat label="24h Low" value={`$${formatNumber(low, priceDecimals)}`} hideMobile />
            <Stat label="24h Volume" value={volume.base} sub={volume.quote} hideMobile />

            <div className="ml-auto hidden md:flex items-center gap-2 rounded-lg border border-[#1A2332] bg-[#111827] px-3 py-1.5 text-[12px]">
              <span className="text-[#787B86]">Balance</span>
              <span className="font-mono text-white">$96,200</span>
              <span className="text-[#787B86]">≈ EUR</span>
            </div>
          </div>

          {/* Workspace grid */}
          <div className="grid flex-1 min-h-0 grid-cols-1 xl:grid-cols-[minmax(0,1fr)_210px_270px]">
            {/* Chart column */}
            <div className="flex min-h-[320px] flex-col border-b xl:border-b-0 xl:border-r border-[#1A2332]">
              <div className="flex flex-wrap items-center gap-1 border-b border-[#1A2332] px-2 py-1.5 text-[11px]">
                <ToolbarPill active>Candles</ToolbarPill>
                <div className="flex items-center gap-0.5 rounded-md bg-[#111827] p-0.5">
                  {TIMEFRAMES.map((tf) => (
                    <button
                      key={tf}
                      type="button"
                      className={cn(
                        "rounded px-2 py-1 font-medium transition-colors",
                        tf === "1D"
                          ? "bg-[#43D9D9]/20 text-[#43D9D9]"
                          : "text-[#787B86] hover:text-[#D1D4DC]"
                      )}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
                <ToolbarPill>Indicators</ToolbarPill>
                <ToolbarPill hideMobile>Overlays</ToolbarPill>
              </div>

              <div className="relative min-h-[280px] flex-1 bg-[#0B1222]">
                <TradingViewAdvancedChart key={pair.symbol} symbol={pair.symbol} />
              </div>
            </div>

            {/* Order book */}
            <div className="hidden xl:flex flex-col border-r border-[#1A2332] bg-[#0A101C] min-h-0">
              <div className="grid grid-cols-3 gap-1 border-b border-[#1A2332] px-2 py-2 text-[10px] uppercase tracking-wide text-[#787B86]">
                <span>Price</span>
                <span className="text-right">Amount</span>
                <span className="text-right">Total</span>
              </div>
              <div className="flex-1 overflow-y-auto px-1 py-1 font-mono text-[11px]">
                {sells.map((row, i) => (
                  <OrderRow key={`s-${i}`} row={row} decimals={priceDecimals} maxTotal={sells[0]?.total ?? 1} />
                ))}
                <div className="my-1 rounded bg-[#111827] py-1.5 text-center text-[12px] font-semibold text-[#43D9D9]">
                  ${formatNumber(pair.price, priceDecimals)}
                </div>
                {buys.map((row, i) => (
                  <OrderRow key={`b-${i}`} row={row} decimals={priceDecimals} maxTotal={buys[0]?.total ?? 1} />
                ))}
              </div>
            </div>

            {/* Trade panel + market trades */}
            <div className="flex flex-col bg-[#0A101C] min-h-0">
              <div className="border-b border-[#1A2332] p-3">
                <div className="mb-3 flex gap-1 text-[11px]">
                  {(["limit", "market", "stop"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setOrderType(type)}
                      className={cn(
                        "rounded px-2.5 py-1 capitalize transition-colors",
                        orderType === type
                          ? "bg-[#111827] text-white"
                          : "text-[#787B86] hover:text-[#D1D4DC]"
                      )}
                    >
                      {type === "stop" ? "Stop-limit" : type}
                    </button>
                  ))}
                </div>

                <div className="mb-3 grid grid-cols-2 gap-1">
                  <button
                    type="button"
                    onClick={() => setSide("buy")}
                    className={cn(
                      "h-9 rounded text-[12px] font-semibold transition-colors",
                      side === "buy"
                        ? "bg-[#43D9D9] text-[#0B1222]"
                        : "bg-[#111827] text-[#787B86]"
                    )}
                  >
                    Buy
                  </button>
                  <button
                    type="button"
                    onClick={() => setSide("sell")}
                    className={cn(
                      "h-9 rounded text-[12px] font-semibold transition-colors",
                      side === "sell"
                        ? "bg-[#F05350] text-white"
                        : "bg-[#111827] text-[#787B86]"
                    )}
                  >
                    Sell
                  </button>
                </div>

                <p className="mb-2 text-[11px] text-[#787B86]">
                  Available: <span className="font-mono text-[#D1D4DC]">$96,200.00</span>
                </p>

                <div className="space-y-2">
                  <TerminalInput label="Price" value={formatNumber(pair.price, priceDecimals)} />
                  <TerminalInput label={`Amount (${pair.symbol.split("/")[0]})`} value="0.00" />
                </div>

                <Link
                  href="/register"
                  className={cn(
                    "mt-3 flex h-10 w-full items-center justify-center rounded text-[13px] font-bold transition-opacity hover:opacity-90",
                    side === "buy"
                      ? "bg-[#43D9D9] text-[#0B1222]"
                      : "bg-[#F05350] text-white"
                  )}
                >
                  {side === "buy" ? "Buy" : "Sell"} {pair.symbol.split("/")[0]}
                </Link>
              </div>

              <div className="flex min-h-0 flex-1 flex-col">
                <div className="flex border-b border-[#1A2332] text-[11px]">
                  {(
                    [
                      ["trades", "Market trades"],
                      ["orders", "Active orders"],
                      ["history", "Order history"],
                    ] as const
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setActiveTab(id)}
                      className={cn(
                        "flex-1 px-2 py-2 transition-colors",
                        activeTab === id
                          ? "border-b-2 border-[#43D9D9] text-white"
                          : "text-[#787B86] hover:text-[#D1D4DC]"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className="flex-1 overflow-y-auto p-2 font-mono text-[10px] sm:text-[11px]">
                  {activeTab === "trades" ? (
                    <>
                      <div className="mb-1 grid grid-cols-4 gap-1 text-[#787B86] uppercase">
                        <span>Price</span>
                        <span className="text-right">Amount</span>
                        <span className="text-right">Total</span>
                        <span className="text-right">Time</span>
                      </div>
                      {trades.map((t, i) => (
                        <div key={i} className="grid grid-cols-4 gap-1 py-0.5">
                          <span className={t.side === "buy" ? "text-[#43D9D9]" : "text-[#F05350]"}>
                            {formatNumber(t.price, priceDecimals)}
                          </span>
                          <span className="text-right text-[#787B86]">{t.amount}</span>
                          <span className="text-right text-[#787B86]">
                            {formatNumber(t.total, 2)}
                          </span>
                          <span className="text-right text-[#787B86]">{t.time}</span>
                        </div>
                      ))}
                    </>
                  ) : (
                    <p className="py-8 text-center text-[#787B86]">
                      <Link href="/register" className="text-[#43D9D9] hover:underline">
                        Sign up
                      </Link>{" "}
                      to view your {activeTab === "orders" ? "active orders" : "order history"}.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile order book strip */}
          <div className="xl:hidden border-t border-[#1A2332] bg-[#0A101C] p-3">
            <p className="mb-2 text-[11px] uppercase tracking-wide text-[#787B86]">Order book</p>
            <div className="grid grid-cols-2 gap-3 font-mono text-[11px]">
              <div>
                {sells.slice(-4).map((row, i) => (
                  <div key={i} className="flex justify-between text-[#F05350]">
                    <span>{formatNumber(row.price, priceDecimals)}</span>
                    <span className="text-[#787B86]">{row.amount}</span>
                  </div>
                ))}
              </div>
              <div>
                {buys.slice(0, 4).map((row, i) => (
                  <div key={i} className="flex justify-between text-[#43D9D9]">
                    <span>{formatNumber(row.price, priceDecimals)}</span>
                    <span className="text-[#787B86]">{row.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA strip */}
      <div className="border-t border-[#1A2332] bg-[#0A101C] px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-center text-[13px] text-[#787B86] sm:text-left">
            Professional spot trading with live charts, deep liquidity, and instant execution.
          </p>
          <div className="flex gap-2">
            <Link
              href="/register"
              className="rounded-lg bg-[#43D9D9] px-5 py-2 text-[13px] font-semibold text-[#0B1222] hover:opacity-90"
            >
              Get started free
            </Link>
            <Link
              href="/dashboard/trade"
              className="rounded-lg border border-[#1A2332] px-5 py-2 text-[13px] font-semibold text-[#D1D4DC] hover:bg-[#111827]"
            >
              Open terminal
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  sub,
  accent,
  className,
  hideMobile,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
  className?: string;
  hideMobile?: boolean;
}) {
  return (
    <div className={cn("min-w-0", hideMobile && "hidden lg:block")}>
      <p className="text-[10px] uppercase tracking-wide text-[#787B86]">{label}</p>
      <p
        className={cn(
          "font-mono text-[12px] sm:text-[13px]",
          accent ? "text-white font-semibold" : "text-[#D1D4DC]",
          className
        )}
      >
        {value}
        {sub && <span className="ml-1 text-[#787B86]">{sub}</span>}
      </p>
    </div>
  );
}

function ToolbarPill({
  children,
  active,
  hideMobile,
}: {
  children: ReactNode;
  active?: boolean;
  hideMobile?: boolean;
}) {
  return (
    <span
      className={cn(
        "rounded px-2 py-1 font-medium",
        hideMobile && "hidden sm:inline",
        active ? "bg-[#111827] text-white" : "text-[#787B86]"
      )}
    >
      {children}
    </span>
  );
}

function TerminalInput({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="mb-1 block text-[10px] text-[#787B86]">{label}</label>
      <div className="flex h-9 items-center rounded border border-[#1A2332] bg-[#111827] px-2.5 font-mono text-[12px] text-[#D1D4DC]">
        {value}
      </div>
    </div>
  );
}

function OrderRow({
  row,
  decimals,
  maxTotal,
}: {
  row: { price: number; amount: number; total: number; side: "buy" | "sell" };
  decimals: number;
  maxTotal: number;
}) {
  const width = `${Math.min(95, (row.total / maxTotal) * 100)}%`;
  const color = row.side === "sell" ? "bg-[#F05350]/10" : "bg-[#43D9D9]/10";
  const text = row.side === "sell" ? "text-[#F05350]" : "text-[#43D9D9]";

  return (
    <div className="relative grid grid-cols-3 gap-1 py-0.5">
      <span
        className={cn("absolute inset-y-0 right-0", color)}
        style={{ width }}
        aria-hidden
      />
      <span className={cn("relative z-10", text)}>{formatNumber(row.price, decimals)}</span>
      <span className="relative z-10 text-right text-[#787B86]">{row.amount}</span>
      <span className="relative z-10 text-right text-[#787B86]">
        {formatNumber(row.total, 2)}
      </span>
    </div>
  );
}
