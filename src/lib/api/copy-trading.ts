import type { SupabaseClient } from "@supabase/supabase-js";

export async function adminAdjustCopyTradingProfit(
  supabase: SupabaseClient,
  subscriptionId: string,
  amount: number,
  note?: string
) {
  const { data, error } = await supabase.rpc("admin_adjust_copy_trading_profit", {
    p_subscription_id: subscriptionId,
    p_amount: amount,
    p_note: note?.trim() || null,
  });
  if (error) throw new Error(error.message);
  return data as {
    profit_after?: number;
    balance_after?: number;
    amount?: number;
    trader_name?: string;
  };
}
