"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { createClient } from "@/lib/supabase/client";
import { getUserTransactions, transactionStatusTone } from "@/lib/api/transactions";
import type { TransactionItem, TransactionKind } from "@/lib/supabase/types";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Loader2,
  Receipt,
  TrendingUp,
  X,
} from "@/components/icons";
import { cn, formatCurrency, formatDate, formatNumber } from "@/lib/utils";

type Filter = "all" | TransactionKind;

const KIND_ICONS = {
  deposit: ArrowDownToLine,
  withdrawal: ArrowUpFromLine,
  trade: TrendingUp,
} as const;

export function StatusBadge({ status }: { status: string }) {
  const tone = transactionStatusTone(status);
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        tone === "up" && "bg-green/10 text-green",
        tone === "down" && "bg-red/10 text-red",
        tone === "pending" && "bg-amber-500/10 text-amber-600 dark:text-amber-300",
        tone === "default" && "bg-bg-hover text-text-tertiary"
      )}
    >
      {status}
    </span>
  );
}

export function TransactionReceiptModal({
  item,
  onClose,
}: {
  item: TransactionItem;
  onClose: () => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
        aria-label={t("transactions.receipt.close")}
      />
      <div className="relative w-full max-w-lg rounded-t-3xl sm:rounded-2xl border border-border bg-bg-secondary p-5 sm:p-6 shadow-[var(--shadow-card)] safe-area-bottom">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-brand">
              {t(`transactions.kind.${item.kind}`)}
            </p>
            <h2 className="text-lg font-bold text-text-primary mt-1">
              {t("transactions.receipt.title")}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-text-tertiary hover:bg-bg-hover hover:text-text-primary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-text-tertiary">{t("transactions.receipt.amount")}</dt>
            <dd className="font-mono font-semibold text-text-primary">
              {formatCurrency(item.amount)} {item.currency}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-text-tertiary">{t("transactions.receipt.type")}</dt>
            <dd className="font-medium capitalize text-text-primary">
              {t(`transactions.kind.${item.kind}`)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-text-tertiary">{t("common.status")}</dt>
            <dd>
              <StatusBadge status={item.status} />
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-text-tertiary">{t("transactions.receipt.date")}</dt>
            <dd className="text-text-primary">{formatDate(item.created_at)}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-text-tertiary">{t("transactions.receipt.updated")}</dt>
            <dd className="text-text-primary">{formatDate(item.updated_at)}</dd>
          </div>
          {item.method && (
            <div className="flex items-center justify-between gap-4">
              <dt className="text-text-tertiary">{t("transactions.receipt.method")}</dt>
              <dd className="capitalize text-text-primary">{item.method.replace(/_/g, " ")}</dd>
            </div>
          )}
          {item.asset && (
            <div className="flex items-center justify-between gap-4">
              <dt className="text-text-tertiary">{t("transactions.receipt.asset")}</dt>
              <dd className="font-medium text-text-primary">{item.asset}</dd>
            </div>
          )}
          {item.tradeType && (
            <div className="flex items-center justify-between gap-4">
              <dt className="text-text-tertiary">{t("transactions.receipt.tradeType")}</dt>
              <dd className="capitalize text-text-primary">{item.tradeType}</dd>
            </div>
          )}
          {item.quantity != null && (
            <div className="flex items-center justify-between gap-4">
              <dt className="text-text-tertiary">{t("transactions.receipt.quantity")}</dt>
              <dd className="font-mono text-text-primary">{formatNumber(item.quantity, 6)}</dd>
            </div>
          )}
          {item.unitPrice != null && (
            <div className="flex items-center justify-between gap-4">
              <dt className="text-text-tertiary">{t("transactions.receipt.unitPrice")}</dt>
              <dd className="font-mono text-text-primary">{formatCurrency(item.unitPrice)}</dd>
            </div>
          )}
          {item.destination && (
            <div className="flex items-start justify-between gap-4">
              <dt className="text-text-tertiary shrink-0">{t("transactions.receipt.destination")}</dt>
              <dd className="font-mono text-right text-text-primary break-all">{item.destination}</dd>
            </div>
          )}
          {item.notes && (
            <div className="flex items-start justify-between gap-4">
              <dt className="text-text-tertiary shrink-0">{t("transactions.receipt.notes")}</dt>
              <dd className="text-right text-text-primary break-words">{item.notes}</dd>
            </div>
          )}
          <div className="flex items-start justify-between gap-4">
            <dt className="text-text-tertiary shrink-0">{t("transactions.receipt.reference")}</dt>
            <dd className="font-mono text-[11px] text-text-secondary break-all">{item.id}</dd>
          </div>
        </dl>

        <p className="mt-5 border-t border-border pt-4 text-[11px] text-text-tertiary leading-relaxed">
          {t("transactions.receipt.footer")}
        </p>
      </div>
    </div>
  );
}

export function TransactionsClient({ userId }: { userId: string }) {
  const { t } = useTranslation();
  const [items, setItems] = useState<TransactionItem[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<TransactionItem | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      setItems(await getUserTransactions(supabase, userId));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void load();
  }, [load]);

  const visible = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((item) => item.kind === filter);
  }, [filter, items]);

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: t("transactions.filterAll") },
    { id: "deposit", label: t("transactions.filterDeposits") },
    { id: "withdrawal", label: t("transactions.filterWithdrawals") },
    { id: "trade", label: t("transactions.filterTrades") },
  ];

  return (
    <>
      <div className="mx-auto max-w-3xl space-y-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-brand">
            {t("dashboard.transactions")}
          </p>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary mt-1">
            {t("transactions.title")}
          </h1>
          <p className="text-sm text-text-tertiary mt-1.5">{t("transactions.subtitle")}</p>
          {!loading && (
            <p className="text-xs text-text-tertiary mt-2">
              {t("transactions.count", { count: visible.length })}
            </p>
          )}
        </div>

        <div className="scroll-tabs flex gap-2">
          {filters.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                filter === tab.id
                  ? "bg-nav-active text-nav-active-text"
                  : "bg-nav-pill text-text-secondary hover:bg-bg-hover"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <p className="text-xs text-text-tertiary">{t("transactions.receipt.viewHint")}</p>

        <div className="coinix-card overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center gap-2 px-4 py-16 text-sm text-text-tertiary">
              <Loader2 className="h-4 w-4" />
              {t("common.loading")}
            </div>
          ) : visible.length === 0 ? (
            <div className="px-4 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-bg-primary text-text-tertiary">
                <Receipt className="h-5 w-5" />
              </div>
              <p className="mt-4 text-sm font-medium text-text-primary">{t("transactions.empty")}</p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {visible.map((item) => {
                const Icon = KIND_ICONS[item.kind];
                return (
                  <li key={`${item.kind}-${item.id}`}>
                    <button
                      type="button"
                      onClick={() => setSelected(item)}
                      className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-bg-hover/60"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-bg-primary text-brand">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-text-primary">
                            {t(`transactions.kind.${item.kind}`)}
                            {item.asset ? ` · ${item.asset}` : ""}
                          </p>
                          <StatusBadge status={item.status} />
                        </div>
                        <p className="mt-1 text-xs text-text-tertiary">
                          {formatDate(item.created_at)}
                          {item.method ? ` · ${item.method.replace(/_/g, " ")}` : ""}
                          {item.tradeType ? ` · ${item.tradeType}` : ""}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-mono font-semibold tabular-nums text-text-primary">
                          {formatCurrency(item.amount)}
                        </p>
                        <p className="text-[11px] text-brand">{t("transactions.viewReceipt")}</p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {selected && (
        <TransactionReceiptModal item={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
