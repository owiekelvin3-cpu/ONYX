import type { SupabaseClient } from "@supabase/supabase-js";
import type { DepositRow } from "@/lib/supabase/types";

export type DepositConfig = {
  cryptoWallets: Record<string, string>;
};

export async function getDepositConfig(
  supabase: SupabaseClient
): Promise<DepositConfig | null> {
  const { data } = await supabase
    .from("platform_settings")
    .select("value")
    .eq("key", "deposit_config")
    .maybeSingle();

  return (data?.value as DepositConfig) ?? null;
}

export async function getUserDeposits(
  supabase: SupabaseClient,
  userId: string
): Promise<DepositRow[]> {
  const { data, error } = await supabase
    .from("deposits")
    .select("id, user_id, amount, currency, method, status, notes, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) throw new Error(error.message);
  return (data ?? []) as DepositRow[];
}

export async function submitDeposit(
  supabase: SupabaseClient,
  params: {
    userId: string;
    amount: number;
    method: string;
    notes?: string;
    relatedFeeId?: string;
  }
): Promise<DepositRow> {
  const { data, error } = await supabase
    .from("deposits")
    .insert({
      user_id: params.userId,
      amount: params.amount,
      currency: "USD",
      method: params.method,
      status: "pending",
      notes: params.notes ?? null,
      related_fee_id: params.relatedFeeId ?? null,
    })
    .select("id, user_id, amount, currency, method, status, notes, created_at")
    .single();

  if (error) throw new Error(error.message);
  return data as DepositRow;
}
