"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  getCopySubscriptions,
  subscribeToTrader,
} from "@/lib/api/subscriptions";
import type { CopySubscriptionRow } from "@/lib/supabase/types";
import { COPY_TRADER_SECTIONS, COPY_TRADERS } from "@/lib/copy-traders";
import { CopyTraderCard } from "@/components/dashboard/copy-trading/CopyTraderCard";
import { TraderAvatar } from "@/components/dashboard/copy-trading/TraderAvatar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight } from "@/components/icons";
import { formatCurrency, cn } from "@/lib/utils";

const DEFAULT_ALLOCATION = 1000;

function scrollToPageTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export default function CopyTradingPage() {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<CopySubscriptionRow[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loadingTrader, setLoadingTrader] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [sectionIndex, setSectionIndex] = useState(0);

  const section = COPY_TRADER_SECTIONS[sectionIndex];
  const sectionCount = COPY_TRADER_SECTIONS.length;
  const hasPrev = sectionIndex > 0;
  const hasNext = sectionIndex < sectionCount - 1;

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      setUserId(user.id);
      const rows = await getCopySubscriptions(supabase, user.id);
      setSubscriptions(rows);
    });
  }, []);

  function goToSection(index: number) {
    setSectionIndex(index);
    scrollToPageTop();
  }

  async function handleCopy(traderName: string) {
    setError("");

    if (!userId) {
      router.push("/register");
      return;
    }

    setLoadingTrader(traderName);
    try {
      const supabase = createClient();
      const row = await subscribeToTrader(supabase, {
        userId,
        traderName,
        allocation: DEFAULT_ALLOCATION,
      });
      setSubscriptions((prev) => [row, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Copy subscription failed");
    } finally {
      setLoadingTrader(null);
    }
  }

  const activeTraders = new Set(
    subscriptions.filter((s) => s.status === "active").map((s) => s.trader_name)
  );

  return (
    <div className="decko-dashboard mx-auto max-w-[1320px] space-y-6 pb-6 lg:space-y-8 lg:pb-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Copy Trading</h1>
        <p className="mt-1 max-w-2xl text-sm text-text-secondary">
          Follow top performers like a social feed — each trader has their own style, stats, and profile.
          Past performance is not indicative of future results.
        </p>
      </div>

      {error && (
        <p role="alert" className="rounded-xl border border-red/30 bg-red/10 px-4 py-3 text-sm text-red">
          {error}
        </p>
      )}

      {subscriptions.length > 0 && (
        <Card className="p-4 sm:p-5">
          <h2 className="text-sm font-semibold text-text-primary">Following</h2>
          <div className="mt-3 space-y-3">
            {subscriptions.map((sub) => {
              const profile = COPY_TRADERS.find((t) => t.name === sub.trader_name);
              return (
                <div
                  key={sub.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-2.5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {profile ? (
                      <TraderAvatar trader={profile} size="sm" />
                    ) : (
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-bg-tertiary text-xs font-bold">
                        {sub.trader_name.charAt(0)}
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-text-primary">{sub.trader_name}</p>
                      <p className="text-xs capitalize text-text-tertiary">
                        {sub.status} · {formatCurrency(sub.allocation)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {COPY_TRADER_SECTIONS.map((s, index) => (
          <button
            key={s.id}
            type="button"
            onClick={() => goToSection(index)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition-colors",
              index === sectionIndex
                ? "border-accent bg-accent/15 text-accent"
                : "border-border bg-bg-secondary text-text-secondary hover:border-accent/40 hover:text-text-primary"
            )}
          >
            {s.title}
          </button>
        ))}
      </div>

      <section className="space-y-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-accent">
              Section {sectionIndex + 1} of {sectionCount}
            </p>
            <h2 className="text-lg font-bold text-text-primary">{section.title}</h2>
            <p className="mt-0.5 max-w-2xl text-sm text-text-tertiary">{section.subtitle}</p>
          </div>
          <p className="shrink-0 text-xs text-text-tertiary">
            {section.traders.length} trader{section.traders.length === 1 ? "" : "s"}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {section.traders.map((trader, index) => (
            <CopyTraderCard
              key={trader.name}
              trader={trader}
              index={sectionIndex * 6 + index}
              isActive={activeTraders.has(trader.name)}
              userId={userId}
              loading={loadingTrader === trader.name}
              onCopy={() => handleCopy(trader.name)}
            />
          ))}
        </div>

        <Card className="space-y-4 p-4 sm:p-5">
          <div>
            <p className="text-sm font-semibold text-text-primary">Browse other sections</p>
            <p className="mt-0.5 text-xs text-text-tertiary">
              Jump to another category or use previous / next below.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {COPY_TRADER_SECTIONS.map((s, index) => (
              <button
                key={s.id}
                type="button"
                onClick={() => goToSection(index)}
                disabled={index === sectionIndex}
                className={cn(
                  "rounded-lg border px-3 py-2 text-left text-xs font-medium transition-colors",
                  index === sectionIndex
                    ? "cursor-default border-accent/50 bg-accent/10 text-accent"
                    : "border-border bg-bg-secondary text-text-secondary hover:border-accent/40 hover:text-text-primary"
                )}
              >
                {s.title}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={!hasPrev}
              onClick={() => goToSection(sectionIndex - 1)}
              className="gap-1.5"
            >
              <ChevronLeft className="h-4 w-4" />
              {hasPrev ? COPY_TRADER_SECTIONS[sectionIndex - 1].title : "Previous"}
            </Button>

            <p className="text-center text-xs text-text-tertiary">
              {sectionIndex + 1} / {sectionCount}
            </p>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={!hasNext}
              onClick={() => goToSection(sectionIndex + 1)}
              className="gap-1.5 sm:ml-auto"
            >
              {hasNext ? COPY_TRADER_SECTIONS[sectionIndex + 1].title : "Next"}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}
