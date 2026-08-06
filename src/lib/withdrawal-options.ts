import type { WithdrawalRow } from "@/lib/supabase/types";

export type WithdrawalMethodId = "crypto" | "bank_transfer" | "wire" | "paypal";

export type WithdrawalMethod = {
  id: WithdrawalMethodId;
  label: string;
  description: string;
  processingTime: string;
  feeLabel: string;
  minAmount: number;
};

export const WITHDRAWAL_METHODS: WithdrawalMethod[] = [
  {
    id: "crypto",
    label: "Crypto Wallet",
    description: "Send to your external blockchain wallet.",
    processingTime: "1–24 hours",
    feeLabel: "Network fee applies",
    minAmount: 50,
  },
  {
    id: "bank_transfer",
    label: "Bank Transfer",
    description: "ACH, SEPA, or local bank payout to your account.",
    processingTime: "1–3 business days",
    feeLabel: "No platform fee",
    minAmount: 100,
  },
  {
    id: "wire",
    label: "International Wire",
    description: "SWIFT wire to banks outside your region.",
    processingTime: "2–5 business days",
    feeLabel: "$25 wire fee",
    minAmount: 500,
  },
  {
    id: "paypal",
    label: "PayPal / E-Wallet",
    description: "Receive funds to PayPal or supported e-wallet.",
    processingTime: "24–48 hours",
    feeLabel: "1.5% processing fee",
    minAmount: 50,
  },
];

export const WITHDRAWAL_CRYPTO_ASSETS = ["USDT", "BTC", "ETH", "USDC", "SOL"] as const;

export type WithdrawalDetails = Record<string, string>;

export function getWithdrawalMethod(id: WithdrawalMethodId): WithdrawalMethod {
  return WITHDRAWAL_METHODS.find((m) => m.id === id) ?? WITHDRAWAL_METHODS[0];
}

export function formatWithdrawalMethodLabel(method: string): string {
  const found = WITHDRAWAL_METHODS.find((m) => m.id === method);
  if (found) return found.label;
  if (method === "crypto") return "Crypto Wallet";
  return method.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function parseWithdrawalNotes(notes: string | null | undefined): WithdrawalDetails | null {
  if (!notes?.trim()) return null;
  try {
    const parsed = JSON.parse(notes) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return Object.fromEntries(
        Object.entries(parsed as Record<string, unknown>).map(([key, value]) => [
          key,
          String(value ?? ""),
        ])
      );
    }
  } catch {
    return { details: notes };
  }
  return null;
}

export function formatWithdrawalDestination(row: WithdrawalRow): string {
  const details = parseWithdrawalNotes(row.notes);
  if (row.wallet_address?.trim()) return row.wallet_address.trim();

  if (!details) return "—";

  return (
    details.accountNumber ||
    details.iban ||
    details.paypalEmail ||
    details.email ||
    details.walletAddress ||
    details.details ||
    "—"
  );
}

export function formatWithdrawalSummary(row: {
  method: string;
  wallet_address?: string | null;
  notes?: string | null;
}): string[] {
  const details = parseWithdrawalNotes(row.notes);
  if (!details) {
    return row.wallet_address ? [`Destination: ${row.wallet_address}`] : [];
  }

  const lines: string[] = [];
  const push = (label: string, key: string) => {
    const value = details[key]?.trim();
    if (value) lines.push(`${label}: ${value}`);
  };

  push("Holder", "accountHolder");
  push("Bank", "bankName");
  push("Account", "accountNumber");
  push("Routing / Sort", "routingNumber");
  push("IBAN", "iban");
  push("SWIFT / BIC", "swiftCode");
  push("Country", "country");
  push("PayPal", "paypalEmail");
  push("Network", "network");
  push("Asset", "asset");

  if (row.wallet_address && !lines.some((l) => l.includes(row.wallet_address!))) {
    lines.unshift(`Destination: ${row.wallet_address}`);
  }

  return lines;
}
