"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { MemeCoinRow } from "@/lib/meme-coins/types";
import { MemeCoinGrid } from "@/components/meme-coins/MemeCoinGrid";
import { cn } from "@/lib/utils";

type TabId = "all" | "trending" | "onyx" | "admin";

const TABS: { id: TabId; label: string }[] = [
  { id: "all", label: "Today" },
  { id: "trending", label: "Live Trending" },
  { id: "onyx", label: "ONYX Originals" },
  { id: "admin", label: "Admin Picks" },
];

export function MemeCoinDailyFeed({
  coins,
  listDate,
  recentDates,
}: {
  coins: MemeCoinRow[];
  listDate: string;
  recentDates: string[];
}) {
  const [tab, setTab] = useState<TabId>("all");

  const filtered = useMemo(() => {
    if (tab === "trending") return coins.filter((c) => c.source === "trending");
    if (tab === "onyx") return coins.filter((c) => c.source === "onyx_generated");
    if (tab === "admin") return coins.filter((c) => c.source === "admin_manual");
    return coins;
  }, [coins, tab]);

  const stats = useMemo(
    () => ({
      total: coins.length,
      trending: coins.filter((c) => c.source === "trending").length,
      onyx: coins.filter((c) => c.source === "onyx_generated").length,
      admin: coins.filter((c) => c.source === "admin_manual").length,
    }),
    [coins]
  );

  return (
    <div className="space-y-8">
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Today's list", value: stats.total },
          { label: "Live trending", value: stats.trending },
          { label: "ONYX originals", value: stats.onyx },
          { label: "Admin picks", value: stats.admin },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-border bg-bg-secondary p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-text-tertiary">
              {item.label}
            </p>
            <p className="mt-1 text-2xl font-bold text-text-primary">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-gold/20 bg-gold/5 p-4 text-sm leading-relaxed text-text-secondary">
        <strong className="text-text-primary">High risk disclosure:</strong> Meme coins are extremely
        volatile and may lose most or all value. Listings on this page are for discovery and
        entertainment only — not financial advice. ONYX Originals are showcase concepts and are not
        tradable spot assets unless explicitly listed elsewhere.
      </section>

      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-text-primary sm:text-xl">
              Daily meme coin picks
            </h2>
            <p className="text-sm text-text-secondary">
              Updated for {new Date(`${listDate}T12:00:00Z`).toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          {recentDates.length > 1 ? (
            <div className="flex flex-wrap gap-2">
              {recentDates.slice(0, 5).map((date) => (
                <Link
                  key={date}
                  href={date === listDate ? "/meme-coins" : `/meme-coins?date=${date}`}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    date === listDate
                      ? "border-brand bg-brand/10 text-brand"
                      : "border-border text-text-secondary hover:border-brand/30"
                  )}
                >
                  {date}
                </Link>
              ))}
            </div>
          ) : null}
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                tab === item.id
                  ? "bg-brand text-bg-primary"
                  : "border border-border bg-bg-secondary text-text-secondary hover:text-text-primary"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <MemeCoinGrid coins={filtered} />
      </section>
    </div>
  );
}
