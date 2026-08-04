import type { SupabaseClient } from "@supabase/supabase-js";
import type { AiSubscriptionRow, CopySubscriptionRow } from "@/lib/supabase/types";

export async function getAiSubscriptions(
  supabase: SupabaseClient,
  userId: string
): Promise<AiSubscriptionRow[]> {
  const { data, error } = await supabase
    .from("ai_trading_subscriptions")
    .select(
      "id, user_id, bot_name, allocation, market, status, profit_earned, created_at, expires_at"
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as AiSubscriptionRow[];
}

export async function subscribeToAiBot(
  supabase: SupabaseClient,
  params: {
    userId: string;
    botName: string;
    price: number;
    market?: string;
  }
): Promise<AiSubscriptionRow> {
  const { data, error } = await supabase
    .from("ai_trading_subscriptions")
    .insert({
      user_id: params.userId,
      bot_name: params.botName,
      allocation: params.price,
      purchase_cost: params.price,
      market: params.market ?? "multi",
      status: "active",
    })
    .select(
      "id, user_id, bot_name, allocation, market, status, profit_earned, created_at, expires_at"
    )
    .single();

  if (error) throw new Error(error.message);
  return data as AiSubscriptionRow;
}

export async function getCopySubscriptions(
  supabase: SupabaseClient,
  userId: string
): Promise<CopySubscriptionRow[]> {
  const { data, error } = await supabase
    .from("copy_trading_subscriptions")
    .select("id, user_id, trader_name, allocation, status, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as CopySubscriptionRow[];
}

export async function subscribeToTrader(
  supabase: SupabaseClient,
  params: {
    userId: string;
    traderName: string;
    allocation: number;
  }
): Promise<CopySubscriptionRow> {
  const { data, error } = await supabase
    .from("copy_trading_subscriptions")
    .insert({
      user_id: params.userId,
      trader_name: params.traderName,
      allocation: params.allocation,
      status: "active",
    })
    .select("id, user_id, trader_name, allocation, status, created_at")
    .single();

  if (error) throw new Error(error.message);
  return data as CopySubscriptionRow;
}
