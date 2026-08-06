"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { executeTrade, getUsdBalance } from "@/lib/api/trading";
import { useLivePrices } from "@/hooks/useLivePrices";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatNumber, formatPercent, formatCurrency } from "@/lib/utils";
import { Loader2 } from "@/components/icons";

export default function TradePage() {
  const router = useRouter();
  const { pairs, loading: pricesLoading } = useLivePrices();
  const [selectedPair, setSelectedPair] = useState(pairs[0]);
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");
  const [showPairs, setShowPairs] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      setUserId(user.id);
      const bal = await getUsdBalance(supabase, user.id);
      setBalance(bal);
    });
  }, []);

  useEffect(() => {
    if (pairs.length === 0) return;
    setSelectedPair((prev) => {
      const match = pairs.find((p) => p.symbol === prev?.symbol);
      return match ?? pairs[0];
    });
  }, [pairs]);

  const qty = amount ? parseFloat(amount) : 0;
  const total = qty * selectedPair.price;

  async function handleTrade() {
    setError("");
    setSuccess("");

    if (!userId) {
      router.push("/login");
      return;
    }

    if (!qty || qty <= 0) {
      setError("Enter a valid amount");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      await executeTrade(supabase, {
        userId,
        asset: selectedPair.symbol,
        type: side,
        amount: qty,
        price: selectedPair.price,
      });

      const bal = await getUsdBalance(supabase, userId);
      setBalance(bal);
      setAmount("");
      setSuccess(
        `${side === "buy" ? "Bought" : "Sold"} ${qty} ${selectedPair.symbol.split("/")[0]} for ${formatCurrency(total)}`
      );
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Trade failed");
    } finally {
      setLoading(false);
    }
  }

  const orderPanel = (
    <>
      <div className="flex mb-3 sm:mb-4">
        <button
          type="button"
          onClick={() => setSide("buy")}
          className={`flex-1 h-9 sm:h-10 text-sm font-semibold rounded-l cursor-pointer touch-target ${
            side === "buy"
              ? "bg-green text-white"
              : "bg-bg-primary text-text-tertiary border border-border"
          }`}
        >
          Buy
        </button>
        <button
          type="button"
          onClick={() => setSide("sell")}
          className={`flex-1 h-9 sm:h-10 text-sm font-semibold rounded-r cursor-pointer touch-target ${
            side === "sell"
              ? "bg-red text-white"
              : "bg-bg-primary text-text-tertiary border border-border"
          }`}
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


      <div className="space-y-2.5 sm:space-y-3">
        <Input
          id="amount"
          label="Amount"
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <div className="flex justify-between text-[12px]">
          <span className="text-text-tertiary">Total</span>
          <span className="font-mono">${formatNumber(total, 2)}</span>
        </div>

        {error && (
          <p role="alert" className="text-[12px] text-red">
            {error}
          </p>
        )}
        {success && (
          <p className="text-[12px] text-green">{success}</p>
        )}

        <Button
          type="button"
          onClick={handleTrade}
          disabled={loading}
          className={`w-full touch-target ${side === "sell" ? "!bg-red !text-white" : "!bg-green !text-white"}`}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </span>
          ) : (
            `${side === "buy" ? "Buy" : "Sell"} ${selectedPair.symbol.split("/")[0]}`
          )}
        </Button>
      </div>
    </>
  );

  return (
    <div className="space-y-3 sm:space-y-4 min-w-0">
      <h1 className="text-base sm:text-lg font-bold text-text-primary">
        Spot Trading
      </h1>

      <div className="lg:hidden">
        <Card className="!p-3 sm:!p-4">
          <div className="flex items-center justify-between mb-3 gap-2 min-w-0">
            <div className="min-w-0">
              <button
                type="button"
                onClick={() => setShowPairs(!showPairs)}
                className="text-sm font-semibold text-brand cursor-pointer touch-target"
              >
                {selectedPair.symbol} ▾
              </button>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <span className="text-lg font-bold font-mono">
                  ${formatNumber(selectedPair.price, selectedPair.price < 10 ? 4 : 2)}
                </span>
                <span
                  className={`text-xs font-mono ${selectedPair.change24h >= 0 ? "text-green" : "text-red"}`}
                >
                  {formatPercent(selectedPair.change24h)}
                </span>
              </div>
            </div>
          </div>
          {orderPanel}
          <div className="mt-4 h-32 border-t border-border pt-3">
            <svg viewBox="0 0 600 120" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="tradeFillMobile" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ECB81" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#0ECB81" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,90 L60,85 L120,75 L180,80 L240,60 L300,55 L360,40 L420,45 L480,30 L540,35 L600,25 L600,120 L0,120 Z"
                fill="url(#tradeFillMobile)"
              />
              <path
                d="M0,90 L60,85 L120,75 L180,80 L240,60 L300,55 L360,40 L420,45 L480,30 L540,35 L600,25"
                fill="none"
                stroke="#0ECB81"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        </Card>

        {showPairs && (
          <Card className="!p-0 mt-2 max-h-48 overflow-y-auto">
            {pairs.map((pair) => (
              <button
                key={pair.symbol}
                type="button"
                onClick={() => {
                  setSelectedPair(pair);
                  setShowPairs(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-[13px] border-b border-border last:border-0 cursor-pointer touch-target ${
                  selectedPair.symbol === pair.symbol ? "bg-bg-hover" : ""
                }`}
              >
                <span className="font-medium">{pair.symbol}</span>
                <span
                  className={`font-mono text-[11px] ${pair.change24h >= 0 ? "text-green" : "text-red"}`}
                >
                  {formatPercent(pair.change24h)}
                </span>
              </button>
            ))}
          </Card>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-3 sm:gap-4 hidden lg:grid">
        <Card className="lg:col-span-2 !p-0 overflow-hidden min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-3 sm:px-4 py-3 border-b border-border">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 min-w-0">
              <span className="text-sm font-semibold">{selectedPair.symbol}</span>
              <span className="text-base sm:text-lg font-bold font-mono">
                ${formatNumber(selectedPair.price, selectedPair.price < 10 ? 4 : 2)}
              </span>
              <span
                className={`text-xs font-mono ${selectedPair.change24h >= 0 ? "text-green" : "text-red"}`}
              >
                {formatPercent(selectedPair.change24h)}
              </span>
            </div>
          </div>

          <div className="h-40 sm:h-52 px-2">
            <svg
              viewBox="0 0 600 180"
              className="w-full h-full"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="tradeFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ECB81" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#0ECB81" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,140 L40,130 L80,120 L120,125 L160,100 L200,90 L240,100 L280,70 L320,75 L360,50 L400,55 L440,35 L480,40 L520,25 L560,30 L600,20 L600,180 L0,180 Z"
                fill="url(#tradeFill)"
              />
              <path
                d="M0,140 L40,130 L80,120 L120,125 L160,100 L200,90 L240,100 L280,70 L320,75 L360,50 L400,55 L440,35 L480,40 L520,25 L560,30 L600,20"
                fill="none"
                stroke="#0ECB81"
                strokeWidth="1.5"
              />
            </svg>
          </div>

          <div className="hidden sm:block max-h-40 lg:max-h-48 overflow-y-auto border-t border-border">
            <table className="w-full">
              <tbody>
                {pairs.map((pair) => (
                  <tr
                    key={pair.symbol}
                    onClick={() => setSelectedPair(pair)}
                    className={`market-row cursor-pointer text-[13px] ${selectedPair.symbol === pair.symbol ? "bg-bg-hover" : ""}`}
                  >
                    <td className="px-3 sm:px-4 py-2 font-medium">{pair.symbol}</td>
                    <td className="px-3 sm:px-4 py-2 text-right font-mono">
                      ${formatNumber(pair.price, pair.price < 10 ? 4 : 2)}
                    </td>
                    <td
                      className={`px-3 sm:px-4 py-2 text-right font-mono text-[11px] ${pair.change24h >= 0 ? "text-green" : "text-red"}`}
                    >
                      {formatPercent(pair.change24h)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="!p-3 sm:!p-4 hidden lg:block">
          {orderPanel}
        </Card>
      </div>
    </div>
  );
}
