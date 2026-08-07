import { createClient } from "@/lib/supabase/client";
import type {
  AdminBalanceDirection,
  AdminModerationUiAction,
  AdminUserDetails,
  TransactionStatus,
} from "@/lib/admin-types";

function rpcError(error: { message?: string; details?: string; hint?: string } | null, fallback: string) {
  if (!error) return fallback;
  return [error.message, error.details, error.hint].filter(Boolean).join(" — ") || fallback;
}

export async function fetchAdminUserDetails(userId: string): Promise<AdminUserDetails> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("admin_get_user_details", { p_user_id: userId });
  if (error) throw new Error(rpcError(error, "Could not load user details."));
  return data as AdminUserDetails;
}

export async function moderateAdminUser(params: {
  userId: string;
  action: AdminModerationUiAction;
  reason?: string;
}) {
  const supabase = createClient();
  const reason =
    params.action === "unsuspend" && (!params.reason || params.reason.trim().length < 3)
      ? "Suspension lifted by team"
      : (params.reason ?? "").trim();

  const { error } = await supabase.rpc("admin_moderate_user", {
    p_user_id: params.userId,
    p_action: params.action,
    p_reason: reason,
  });
  if (error) throw new Error(rpcError(error, "Could not complete that action."));
}

export async function adjustAdminUserBalance(params: {
  userId: string;
  direction: AdminBalanceDirection;
  amount: number;
  reason: string;
}) {
  const supabase = createClient();
  const { error } = await supabase.rpc("admin_adjust_user_balance", {
    p_user_id: params.userId,
    p_direction: params.direction,
    p_amount: params.amount,
    p_reason: params.reason.trim(),
  });
  if (error) throw new Error(rpcError(error, "Could not adjust balance."));
}

export async function adjustAdminUserProfit(params: {
  userId: string;
  amount: number;
  note?: string;
}) {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("admin_adjust_user_profit", {
    p_user_id: params.userId,
    p_amount: params.amount,
    p_note: params.note?.trim() || null,
  });
  if (error) throw new Error(rpcError(error, "Could not adjust profit."));
  return data as {
    profit_total?: number;
    balance_after?: number;
    amount?: number;
  };
}

export async function approveDeposit(depositId: string, userId: string, amount: number) {
  const supabase = createClient();
  const { error: depErr } = await supabase
    .from("deposits")
    .update({ status: "completed" as TransactionStatus })
    .eq("id", depositId);
  if (depErr) throw depErr;

  const [{ data: bal }, { data: profile }] = await Promise.all([
    supabase.from("balances").select("amount, currency").eq("user_id", userId).single(),
    supabase.from("profiles").select("preferred_currency").eq("id", userId).single(),
  ]);

  const currency = bal?.currency || profile?.preferred_currency || "USD";
  const newAmount = (bal?.amount ?? 0) + amount;
  const { error: balErr } = await supabase
    .from("balances")
    .upsert({ user_id: userId, amount: newAmount, currency }, { onConflict: "user_id" });
  if (balErr) throw balErr;

  const { error: settleErr } = await supabase.rpc("settle_pending_fees_from_deposit", {
    p_deposit_id: depositId,
  });
  if (settleErr) throw settleErr;
}

export async function rejectDeposit(depositId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("deposits")
    .update({ status: "rejected" as TransactionStatus })
    .eq("id", depositId);
  if (error) throw error;
}

export async function completeWithdrawal(withdrawalId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("withdrawals")
    .update({ status: "completed" as TransactionStatus })
    .eq("id", withdrawalId);
  if (error) throw error;
}

export async function rejectWithdrawal(withdrawalId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("withdrawals")
    .update({ status: "rejected" as TransactionStatus })
    .eq("id", withdrawalId);
  if (error) throw error;
}

export async function updateKycStatus(
  submissionId: string,
  userId: string,
  status: "approved" | "rejected",
  notes?: string
) {
  const supabase = createClient();
  const { error: kycErr } = await supabase
    .from("kyc_submissions")
    .update({ status, notes: notes ?? null })
    .eq("id", submissionId);
  if (kycErr) throw kycErr;

  const { error: profileErr } = await supabase
    .from("profiles")
    .update({ kyc_status: status })
    .eq("id", userId);
  if (profileErr) throw profileErr;
}

export async function fetchDepositConfig() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("platform_settings")
    .select("value")
    .eq("key", "deposit_config")
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data?.value as { cryptoWallets?: Record<string, string> } | null) ?? null;
}

export async function updateDepositWallets(cryptoWallets: Record<string, string>) {
  const supabase = createClient();
  const { data: existing, error: loadError } = await supabase
    .from("platform_settings")
    .select("value")
    .eq("key", "deposit_config")
    .maybeSingle();

  if (loadError) throw new Error(loadError.message);

  const current = (existing?.value as Record<string, unknown> | null) ?? {};
  const updated = {
    ...current,
    cryptoWallets,
  };

  const { error } = await supabase
    .from("platform_settings")
    .update({ value: updated, updated_at: new Date().toISOString() })
    .eq("key", "deposit_config");

  if (error) throw new Error(error.message);
}
