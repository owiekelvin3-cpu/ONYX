"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  getUserWithdrawals,
  getWithdrawalEligibility,
  submitWithdrawal,
} from "@/lib/api/withdrawals";
import { getUsdBalance } from "@/lib/api/trading";
import type { WithdrawalRow } from "@/lib/supabase/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatCurrency } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function WithdrawPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [canWithdraw, setCanWithdraw] = useState(true);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRow[]>([]);
  const [asset, setAsset] = useState("USDT");
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const supabase = createClient();
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
        const bal = await getUsdBalance(supabase, user.id);
        setBalance(bal);

        try {
          const eligibility = await getWithdrawalEligibility(supabase);
          setCanWithdraw(eligibility.can_withdraw);
        } catch {
          setCanWithdraw(true);
        }

        const rows = await getUserWithdrawals(supabase, user.id);
        setWithdrawals(rows);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleSubmit() {
    setError("");
    setSuccess("");

    if (!userId) {
      router.push("/login");
      return;
    }

    if (!canWithdraw) {
      setError("Withdrawals are currently blocked. Check pending fees or portfolio requirements.");
      return;
    }

    const value = parseFloat(amount);
    if (!value || value <= 0) {
      setError("Enter a valid amount");
      return;
    }

    if (balance !== null && value > balance) {
      setError("Insufficient balance");
      return;
    }

    if (!address.trim()) {
      setError("Enter a withdrawal address");
      return;
    }

    setSubmitting(true);
    try {
      const supabase = createClient();
      const row = await submitWithdrawal(supabase, {
        userId,
        amount: value,
        currency: asset,
        walletAddress: address.trim(),
      });
      setWithdrawals((prev) => [row, ...prev]);
      setAmount("");
      setAddress("");
      setSuccess("Withdrawal submitted. Processing within 24 hours.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Withdrawal failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <div>
        <h1 className="text-lg font-bold text-text-primary">Withdraw</h1>
        <p className="text-[13px] text-text-tertiary mt-1">
          Withdraw funds to your external wallet
        </p>
      </div>

      <Card>
        <div className="space-y-4">
          {userId && balance !== null && (
            <p className="text-[13px] text-text-secondary">
              Available balance:{" "}
              <span className="font-mono font-semibold">
                {formatCurrency(balance)}
              </span>
            </p>
          )}

          {!userId && !loading && (
            <p className="text-[13px] text-text-tertiary">
              <Link href="/login" className="text-brand hover:underline">
                Log in
              </Link>{" "}
              to withdraw funds.
            </p>
          )}

          <div>
            <label className="block text-xs text-text-tertiary mb-2">Asset</label>
            <div className="grid grid-cols-3 gap-2">
              {["USDT", "BTC", "ETH"].map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAsset(a)}
                  className={`px-3 py-2 rounded text-[13px] transition-colors cursor-pointer border ${
                    asset === a
                      ? "bg-brand/10 text-brand border-brand/40"
                      : "bg-bg-primary text-text-secondary border-border"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <Input
            id="address"
            label="Withdrawal Address"
            placeholder="Enter wallet address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <Input
            id="amount"
            label="Amount"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <div className="flex justify-between text-[13px]">
            <span className="text-text-tertiary">Network Fee</span>
            <span className="font-mono text-text-secondary">~$1.00</span>
          </div>

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
              "Submit Withdrawal"
            )}
          </Button>

          <p className="text-[11px] text-text-tertiary leading-relaxed">
            Withdrawals are processed within 24 hours. KYC may be required for
            amounts over $10,000.
          </p>
        </div>
      </Card>

      {withdrawals.length > 0 && (
        <Card>
          <h3 className="text-[13px] font-semibold text-text-primary mb-3">
            Withdrawal History
          </h3>
          <div className="space-y-2">
            {withdrawals.map((w) => (
              <div
                key={w.id}
                className="flex items-center justify-between py-2 border-b border-border last:border-0 text-[13px]"
              >
                <div>
                  <p className="font-medium">
                    {formatCurrency(w.amount)} {w.currency}
                  </p>
                  <p className="text-[11px] text-text-tertiary capitalize">
                    {w.status}
                  </p>
                </div>
                <p className="text-[11px] text-text-tertiary">
                  {new Date(w.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
