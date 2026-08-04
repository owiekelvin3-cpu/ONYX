import type { SupabaseClient } from "@supabase/supabase-js";
import type { TradeRow, HoldingRow, BalanceRow } from "@/lib/supabase/types";

export async function getUsdBalance(
  supabase: SupabaseClient,
  userId: string
): Promise<number> {
  const { data } = await supabase
    .from("balances")
    .select("amount")
    .eq("user_id", userId)
    .eq("currency", "USD")
    .maybeSingle();
  return data?.amount ?? 0;
}

export async function getRecentTrades(
  supabase: SupabaseClient,
  userId: string,
  limit = 10
): Promise<TradeRow[]> {
  const { data, error } = await supabase
    .from("trades")
    .select("id, user_id, asset, type, amount, price, status, profit, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return (data ?? []) as TradeRow[];
}

export async function getHoldings(
  supabase: SupabaseClient,
  userId: string
): Promise<HoldingRow[]> {
  const { data, error } = await supabase
    .from("holdings")
    .select("id, user_id, asset, quantity, updated_at")
    .eq("user_id", userId)
    .order("asset");

  if (error) throw new Error(error.message);
  return (data ?? []) as HoldingRow[];
}

export async function executeTrade(
  supabase: SupabaseClient,
  params: {
    userId: string;
    asset: string;
    type: "buy" | "sell";
    amount: number;
    price: number;
  }
): Promise<TradeRow> {
  const { data, error } = await supabase
    .from("trades")
    .insert({
      user_id: params.userId,
      asset: params.asset,
      type: params.type,
      amount: params.amount,
      price: params.price,
      status: "pending",
    })
    .select("id, user_id, asset, type, amount, price, status, created_at")
    .single();

  if (error) throw new Error(error.message);
  return data as TradeRow;
}

export function tradeNotional(trade: Pick<TradeRow, "amount" | "price">): number {
  return trade.amount * trade.price;
}

export type { BalanceRow };
