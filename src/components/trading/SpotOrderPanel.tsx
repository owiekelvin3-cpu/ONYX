"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader2 } from "@/components/icons";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

type SpotOrderPanelProps = {
  symbol: string;
  side: "buy" | "sell";
  onSideChange: (side: "buy" | "sell") => void;
  amount: string;
  onAmountChange: (value: string) => void;
  total: number;
  balance: number | null;
  userId: string | null;
  loading: boolean;
  error: string;
  success: string;
  onSubmit: () => void;
};

export function SpotOrderPanel({
  symbol,
  side,
  onSideChange,
  amount,
  onAmountChange,
  total,
  balance,
  userId,
  loading,
  error,
  success,
  onSubmit,
}: SpotOrderPanelProps) {
  const base = symbol.split("/")[0];

  return (
    <div className="flex flex-col h-full">
      <div className="flex mb-4">
        <button
          type="button"
          onClick={() => onSideChange("buy")}
          className={cn(
            "flex-1 h-10 text-sm font-semibold rounded-l cursor-pointer touch-target transition-colors",
            side === "buy"
              ? "bg-green text-white"
              : "bg-bg-primary text-text-tertiary border border-border"
          )}
        >
          Buy
        </button>
        <button
          type="button"
          onClick={() => onSideChange("sell")}
          className={cn(
            "flex-1 h-10 text-sm font-semibold rounded-r cursor-pointer touch-target transition-colors",
            side === "sell"
              ? "bg-red text-white"
              : "bg-bg-primary text-text-tertiary border border-border"
          )}
        >
          Sell
        </button>
      </div>

      {userId && balance !== null && (
        <p className="text-[12px] text-text-tertiary mb-3">
          Available:{" "}
          <span className="font-mono text-text-secondary">
            {formatCurrency(balance)}
          </span>
        </p>
      )}

      <div className="space-y-3 flex-1">
        <Input
          id="amount"
          label={`Amount (${base})`}
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
        />
        <div className="flex justify-between text-[12px]">
          <span className="text-text-tertiary">Total (USD)</span>
          <span className="font-mono">${formatNumber(total, 2)}</span>
        </div>

        {error && (
          <p role="alert" className="text-[12px] text-red">
            {error}
          </p>
        )}
        {success && <p className="text-[12px] text-green">{success}</p>}

        <Button
          type="button"
          onClick={onSubmit}
          disabled={loading}
          className={cn(
            "w-full touch-target",
            side === "sell" ? "!bg-red !text-white" : "!bg-green !text-white"
          )}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </span>
          ) : (
            `${side === "buy" ? "Buy" : "Sell"} ${base}`
          )}
        </Button>
      </div>
    </div>
  );
}
