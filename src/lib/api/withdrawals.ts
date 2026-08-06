import type { SupabaseClient } from "@supabase/supabase-js";
import type { WithdrawalRow, WithdrawalEligibility } from "@/lib/supabase/types";
import type { WithdrawalDetails, WithdrawalMethodId } from "@/lib/withdrawal-options";

export async function getWithdrawalEligibility(
  supabase: SupabaseClient
): Promise<WithdrawalEligibility> {
  const { data, error } = await supabase.rpc("get_withdrawal_eligibility");
  if (error) throw new Error(error.message);
  return data as WithdrawalEligibility;
}

export async function getUserWithdrawals(
  supabase: SupabaseClient,
  userId: string
): Promise<WithdrawalRow[]> {
  const { data, error } = await supabase
    .from("withdrawals")
    .select(
      "id, user_id, amount, currency, method, wallet_address, status, notes, created_at"
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) throw new Error(error.message);
  return (data ?? []) as WithdrawalRow[];
}

export async function submitWithdrawal(
  supabase: SupabaseClient,
  params: {
    userId: string;
    amount: number;
    currency: string;
    method: WithdrawalMethodId;
    destination: string;
    details: WithdrawalDetails;
  }
): Promise<WithdrawalRow> {
  const { data, error } = await supabase
    .from("withdrawals")
    .insert({
      user_id: params.userId,
      amount: params.amount,
      currency: params.currency,
      method: params.method,
      wallet_address: params.destination,
      notes: JSON.stringify(params.details),
      status: "pending",
    })
    .select(
      "id, user_id, amount, currency, method, wallet_address, status, notes, created_at"
    )
    .single();

  if (error) throw new Error(error.message);
  return data as WithdrawalRow;
}
