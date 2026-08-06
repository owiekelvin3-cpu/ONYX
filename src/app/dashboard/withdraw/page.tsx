"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  getUserWithdrawals,
  getWithdrawalEligibility,
  submitWithdrawal,
} from "@/lib/api/withdrawals";
import { getUsdBalance } from "@/lib/api/trading";
import type { WithdrawalRow } from "@/lib/supabase/types";
import {
  WITHDRAWAL_METHODS,
  WITHDRAWAL_CRYPTO_ASSETS,
  getWithdrawalMethod,
  formatWithdrawalMethodLabel,
  type WithdrawalMethodId,
} from "@/lib/withdrawal-options";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  Loader2,
  Wallet,
  BuildingColumns,
  MoneyBillTransfer,
  Mail,
  Clock,
  Shield,
} from "@/components/icons";

const METHOD_ICONS: Record<WithdrawalMethodId, typeof Wallet> = {
  crypto: Wallet,
  bank_transfer: BuildingColumns,
  wire: MoneyBillTransfer,
  paypal: Mail,
};

const EMPTY_BANK = {
  accountHolder: "",
  bankName: "",
  accountNumber: "",
  routingNumber: "",
  iban: "",
  swiftCode: "",
  country: "",
};

export default function WithdrawPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [canWithdraw, setCanWithdraw] = useState(true);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRow[]>([]);
  const [method, setMethod] = useState<WithdrawalMethodId>("crypto");
  const [amount, setAmount] = useState("");
  const [asset, setAsset] = useState<string>("USDT");
  const [network, setNetwork] = useState("TRC20");
  const [walletAddress, setWalletAddress] = useState("");
  const [bank, setBank] = useState(EMPTY_BANK);
  const [paypalEmail, setPaypalEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const selectedMethod = useMemo(() => getWithdrawalMethod(method), [method]);

  useEffect(() => {
    const supabase = createClient();
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
        setBalance(await getUsdBalance(supabase, user.id));

        try {
          const eligibility = await getWithdrawalEligibility(supabase);
          setCanWithdraw(eligibility.can_withdraw);
        } catch {
          setCanWithdraw(false);
        }

        setWithdrawals(await getUserWithdrawals(supabase, user.id));
      }
      setLoading(false);
    }
    load();
  }, []);

  function updateBank(field: keyof typeof EMPTY_BANK, value: string) {
    setBank((prev) => ({ ...prev, [field]: value }));
  }

  function validateForm(): { destination: string; details: Record<string, string> } | null {
    const value = parseFloat(amount);
    if (!value || value <= 0) {
      setError("Enter a valid amount");
      return null;
    }
    if (value < selectedMethod.minAmount) {
      setError(`Minimum withdrawal for this method is ${formatCurrency(selectedMethod.minAmount)}`);
      return null;
    }
    if (balance !== null && value > balance) {
      setError("Insufficient balance");
      return null;
    }

    if (method === "crypto") {
      if (!walletAddress.trim()) {
        setError("Enter your wallet address");
        return null;
      }
      return {
        destination: walletAddress.trim(),
        details: { asset, network, walletAddress: walletAddress.trim() },
      };
    }

    if (method === "bank_transfer") {
      if (!bank.accountHolder.trim() || !bank.bankName.trim() || !bank.accountNumber.trim()) {
        setError("Complete all required bank fields");
        return null;
      }
      return {
        destination: bank.accountNumber.trim(),
        details: { ...bank, type: "bank_transfer" },
      };
    }

    if (method === "wire") {
      if (
        !bank.accountHolder.trim() ||
        !bank.bankName.trim() ||
        !bank.iban.trim() ||
        !bank.swiftCode.trim()
      ) {
        setError("Complete all required wire transfer fields");
        return null;
      }
      return {
        destination: bank.iban.trim(),
        details: { ...bank, type: "wire" },
      };
    }

    if (!paypalEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paypalEmail.trim())) {
      setError("Enter a valid PayPal or e-wallet email");
      return null;
    }
    return {
      destination: paypalEmail.trim(),
      details: { paypalEmail: paypalEmail.trim(), type: "paypal" },
    };
  }

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

    const payload = validateForm();
    if (!payload) return;

    setSubmitting(true);
    try {
      const supabase = createClient();
      const row = await submitWithdrawal(supabase, {
        userId,
        amount: parseFloat(amount),
        currency: method === "crypto" ? asset : "USD",
        method,
        destination: payload.destination,
        details: payload.details,
      });
      setWithdrawals((prev) => [row, ...prev]);
      setAmount("");
      setWalletAddress("");
      setBank(EMPTY_BANK);
      setPaypalEmail("");
      setSuccess(
        `Withdrawal request submitted via ${selectedMethod.label}. Our team will process it within ${selectedMethod.processingTime}.`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Withdrawal failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-text-primary">Withdraw Funds</h1>
        <p className="text-sm text-text-tertiary mt-1">
          Choose a payout method and submit your request for team review.
        </p>
      </div>

      {userId && balance !== null && (
        <Card className="bg-gradient-to-br from-bg-secondary to-bg-primary border-brand/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-text-tertiary">Available balance</p>
              <p className="text-2xl font-bold font-mono text-text-primary mt-1">
                {formatCurrency(balance)}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-text-tertiary">
              <Shield className="w-4 h-4 text-brand shrink-0" />
              Secured withdrawals · Team-reviewed payouts
            </div>
          </div>
        </Card>
      )}

      <Card>
        <div className="space-y-5">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">Withdrawal method</h2>
            <p className="text-xs text-text-tertiary mt-1">
              Select how you would like to receive your funds.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {WITHDRAWAL_METHODS.map((option) => {
              const Icon = METHOD_ICONS[option.id];
              const active = method === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setMethod(option.id)}
                  className={cn(
                    "text-left rounded-xl border p-4 transition-all cursor-pointer",
                    active
                      ? "border-brand/50 bg-brand/5 shadow-[0_0_0_1px_rgba(240,185,11,0.15)]"
                      : "border-border bg-bg-primary hover:border-border-light hover:bg-bg-hover/40"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                        active ? "bg-brand/15 text-brand" : "bg-bg-secondary text-text-tertiary"
                      )}
                    >
                      <Icon className="w-[18px] h-[18px]" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-text-primary">{option.label}</p>
                      <p className="text-xs text-text-tertiary mt-1 leading-relaxed">
                        {option.description}
                      </p>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[11px] text-text-tertiary">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {option.processingTime}
                        </span>
                        <span>Min {formatCurrency(option.minAmount)}</span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      <Card>
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">Payout details</h2>
            <p className="text-xs text-text-tertiary mt-1">
              Enter the destination for your {selectedMethod.label.toLowerCase()} withdrawal.
            </p>
          </div>

          <Input
            id="amount"
            label="Amount (USD)"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          {method === "crypto" && (
            <>
              <div>
                <label className="block text-xs text-text-tertiary mb-2">Asset</label>
                <div className="flex flex-wrap gap-2">
                  {WITHDRAWAL_CRYPTO_ASSETS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setAsset(a)}
                      className={cn(
                        "px-3 py-2 rounded-lg text-[13px] border transition-colors cursor-pointer",
                        asset === a
                          ? "bg-brand/10 text-brand border-brand/40"
                          : "bg-bg-primary text-text-secondary border-border"
                      )}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs text-text-tertiary mb-2">Network</label>
                <div className="flex flex-wrap gap-2">
                  {["TRC20", "ERC20", "BEP20", "Bitcoin"].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setNetwork(n)}
                      className={cn(
                        "px-3 py-2 rounded-lg text-[13px] border transition-colors cursor-pointer",
                        network === n
                          ? "bg-brand/10 text-brand border-brand/40"
                          : "bg-bg-primary text-text-secondary border-border"
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <Input
                id="wallet"
                label="Wallet address"
                placeholder="Paste your receiving address"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="font-mono text-xs"
              />
            </>
          )}

          {method === "bank_transfer" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                id="account-holder"
                label="Account holder name"
                placeholder="Full name on account"
                value={bank.accountHolder}
                onChange={(e) => updateBank("accountHolder", e.target.value)}
              />
              <Input
                id="bank-name"
                label="Bank name"
                placeholder="e.g. Chase, Barclays"
                value={bank.bankName}
                onChange={(e) => updateBank("bankName", e.target.value)}
              />
              <Input
                id="account-number"
                label="Account number"
                placeholder="Account / IBAN"
                value={bank.accountNumber}
                onChange={(e) => updateBank("accountNumber", e.target.value)}
              />
              <Input
                id="routing-number"
                label="Routing / Sort code"
                placeholder="Routing, sort, or BSB"
                value={bank.routingNumber}
                onChange={(e) => updateBank("routingNumber", e.target.value)}
              />
              <Input
                id="country"
                label="Country"
                placeholder="Country of bank"
                value={bank.country}
                onChange={(e) => updateBank("country", e.target.value)}
                className="sm:col-span-2"
              />
            </div>
          )}

          {method === "wire" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                id="wire-holder"
                label="Beneficiary name"
                placeholder="Full legal name"
                value={bank.accountHolder}
                onChange={(e) => updateBank("accountHolder", e.target.value)}
              />
              <Input
                id="wire-bank"
                label="Bank name"
                placeholder="Receiving bank"
                value={bank.bankName}
                onChange={(e) => updateBank("bankName", e.target.value)}
              />
              <Input
                id="wire-iban"
                label="IBAN / Account number"
                placeholder="International account number"
                value={bank.iban}
                onChange={(e) => updateBank("iban", e.target.value)}
              />
              <Input
                id="wire-swift"
                label="SWIFT / BIC code"
                placeholder="e.g. CHASUS33"
                value={bank.swiftCode}
                onChange={(e) => updateBank("swiftCode", e.target.value)}
              />
              <Input
                id="wire-country"
                label="Bank country"
                placeholder="Country"
                value={bank.country}
                onChange={(e) => updateBank("country", e.target.value)}
                className="sm:col-span-2"
              />
            </div>
          )}

          {method === "paypal" && (
            <Input
              id="paypal-email"
              label="PayPal or e-wallet email"
              type="email"
              placeholder="you@email.com"
              value={paypalEmail}
              onChange={(e) => setPaypalEmail(e.target.value)}
            />
          )}

          <div className="rounded-lg border border-border bg-bg-primary/60 p-4 space-y-2 text-[13px]">
            <div className="flex justify-between gap-4">
              <span className="text-text-tertiary">Processing time</span>
              <span className="text-text-secondary text-right">{selectedMethod.processingTime}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-text-tertiary">Fees</span>
              <span className="text-text-secondary text-right">{selectedMethod.feeLabel}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-text-tertiary">Minimum</span>
              <span className="font-mono text-text-secondary">{formatCurrency(selectedMethod.minAmount)}</span>
            </div>
          </div>

          {error && (
            <p role="alert" className="text-sm text-red bg-red/5 border border-red/20 rounded-lg px-4 py-3">
              {error}
            </p>
          )}
          {success && (
            <p className="text-sm text-green bg-green/5 border border-green/20 rounded-lg px-4 py-3">
              {success}
            </p>
          )}

          <Button
            type="button"
            className="w-full !h-12"
            disabled={submitting || !userId || loading}
            onClick={handleSubmit}
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting request...
              </span>
            ) : (
              `Submit ${selectedMethod.label} Withdrawal`
            )}
          </Button>

          <p className="text-[11px] text-text-tertiary leading-relaxed">
            All withdrawals are reviewed by our team for security. KYC verification may be required
            for amounts over $10,000 or for first-time bank and wire payouts.
          </p>
        </div>
      </Card>

      {withdrawals.length > 0 && (
        <Card>
          <h3 className="text-sm font-semibold text-text-primary mb-4">Withdrawal history</h3>
          <div className="space-y-3">
            {withdrawals.map((w) => (
              <div
                key={w.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-3 border-b border-border last:border-0"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-text-primary">
                      {formatCurrency(w.amount)} {w.currency}
                    </p>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-bg-hover text-text-tertiary capitalize">
                      {w.status}
                    </span>
                  </div>
                  <p className="text-xs text-text-tertiary mt-1">
                    {formatWithdrawalMethodLabel(w.method)} ·{" "}
                    {new Date(w.created_at).toLocaleDateString()}
                  </p>
                  {w.wallet_address && (
                    <p className="text-[11px] text-text-tertiary mt-1 font-mono truncate">
                      {w.wallet_address}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
