import type { MemeCoinRow } from "@/lib/meme-coins/types";
import { utcToday } from "@/lib/meme-coins/sync";
import { createClient } from "@/lib/supabase/server";

export async function getMemeCoinsForDate(date?: string): Promise<MemeCoinRow[]> {
  const listDate = date ?? utcToday();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("daily_meme_coins")
    .select("*")
    .eq("list_date", listDate)
    .eq("status", "active")
    .in("source", ["trending", "onyx_generated"])
    .order("featured", { ascending: false })
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getMemeCoinsForDate:", error.message);
    return [];
  }

  return (data ?? []) as MemeCoinRow[];
}

export async function getRecentMemeCoinDates(limit = 7): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("daily_meme_coins")
    .select("list_date")
    .eq("status", "active")
    .order("list_date", { ascending: false })
    .limit(limit * 20);

  if (error || !data?.length) return [utcToday()];

  const unique = [...new Set(data.map((row) => row.list_date as string))];
  return unique.slice(0, limit);
}
