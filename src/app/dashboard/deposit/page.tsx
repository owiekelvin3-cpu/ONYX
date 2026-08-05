"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  getDepositConfig,
  getUserDeposits,
  submitDeposit,
  type DepositConfig,
} from "@/lib/api/deposits";
import type { DepositRow } from "@/lib/supabase/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatCurrency } from "@/lib/utils";
import { Copy, Check, Loader2 } from "lucide-react";

const CRYPTO_LABELS: Record<string, string> = {
  bitcoin: "Bitcoin (BTC)",
  ethereum: "Ethereum (ETH)",
  usdt: "Tether (USDT)",
  bnb: "BNB",
  solana: "Solana (SOL)",
  xrp: "XRP",
  dogecoin: "Dogecoin (DOGE)",
  litecoin: "Litecoin (LTC)",
};

export default function DepositPage() {
  const router = useRouter();
  const [config, setConfig] = useState<DepositConfig | null>(null);
  const [deposits, setDeposits] = useState<DepositRow[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [selected, setSelected] = useState("bitcoin");
  const [amount, setAmount] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const supabase = createClient();
    async function load() {
      const cfg = await getDepositConfig(supabase);
      setConfig(cfg);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const rows = await getUserDeposits(supabase, user.id);
        setDeposits(rows);
      }
      setLoading(false);
    }
    load();
  }, []);

  const walletAddress = config?.cryptoWallets?.[selected] ?? "";

  function copyAddress() {
    if (!walletAddress) return;
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSubmit() {
    setError("");
    setSuccess("");

    if (!userId) {
      router.push("/login");
      return;
    }

    const value = parseFloat(amount);
    if (!value || value < 50) {
      setError("Minimum deposit is $50");
      return;
    }

    setSubmitting(true);
    try {
      const supabase = createClient();
      const row = await submitDeposit(supabase, {
        userId,
        amount: value,
        method: `crypto_${selected}`,
        notes: `Deposit via ${CRYPTO_LABELS[selected] ?? selected}`,
      });
      setDeposits((prev) => [row, ...prev]);
      setAmount("");
      setSuccess("Deposit request submitted. Pending admin review.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Deposit failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <div>
        <h1 className="text-lg font-bold text-text-primary">Deposit</h1>
        <p className="text-[13px] text-text-tertiary mt-1">
          Fund your account with crypto
        </p>
      </div>

      <Card>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-text-tertiary mb-2">
              Select Asset
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.keys(CRYPTO_LABELS).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelected(key)}
                  className={`px-3 py-2 rounded text-[13px] transition-colors cursor-pointer border ${
                    selected === key
                      ? "bg-brand/10 text-brand border-brand/40"
                      : "bg-bg-primary text-text-secondary border-border hover:text-text-primary"
                  }`}
                >
                  {CRYPTO_LABELS[key].split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          <Input
            id="amount"
            label="Amount (USD equivalent)"
            type="number"
            placeholder="1000.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          {loading ? (
            <p className="text-[13px] text-text-tertiary">Loading wallet...</p>
          ) : walletAddress && walletAddress.trim() !== "Unavailable" ? (
            <div>
              <label className="block text-xs text-text-tertiary mb-2">
                Deposit Address — {CRYPTO_LABELS[selected]}
              </label>
              <div className="flex items-center gap-2 bg-bg-primary border border-border rounded p-3">
                <code className="flex-1 text-[11px] font-mono break-all text-text-secondary">
                  {walletAddress}
                </code>
                <button
                  type="button"
                  onClick={copyAddress}
                  className="p-2 text-text-tertiary hover:text-brand transition-colors cursor-pointer shrink-0"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-[13px] text-text-tertiary">
              Wallet address unavailable for this asset. Contact support.
            </p>
          )}


          {error && (
            <p role="alert" className="text-[13px] text-red">
              {error}
            </p>
          )}
          {success && <p className="text-[13px] text-green">{success}</p>}

          <Button
            type="button"
            className="w-full"
            disabled={submitting || !userId}
            onClick={handleSubmit}
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </span>
            ) : (
              "Submit Deposit Request"
            )}
          </Button>

          <p className="text-[11px] text-text-tertiary leading-relaxed">
            Deposits are typically confirmed within 10–30 minutes after admin
            approval. Minimum deposit: $50.
          </p>
        </div>
      </Card>

      {deposits.length > 0 && (
        <Card>
          <h3 className="text-[13px] font-semibold text-text-primary mb-3">
            Deposit History
          </h3>
          <div className="space-y-2">
            {deposits.map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between py-2 border-b border-border last:border-0 text-[13px]"
              >
                <div>
                  <p className="font-medium">{formatCurrency(d.amount)}</p>
                  <p className="text-[11px] text-text-tertiary capitalize">
                    {d.method.replace("crypto_", "")} · {d.status}
                  </p>
                </div>
                <p className="text-[11px] text-text-tertiary">
                  {new Date(d.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
