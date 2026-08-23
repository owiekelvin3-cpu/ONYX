import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { utcToday } from "@/lib/meme-coins/sync";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date") ?? utcToday();
  const limit = Math.min(Number(searchParams.get("limit") ?? "40"), 100);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("daily_meme_coins")
    .select("*")
    .eq("list_date", date)
    .eq("status", "active")
    .in("source", ["trending", "onyx_generated"])
    .order("featured", { ascending: false })
    .order("sort_order", { ascending: true })
    .limit(limit);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    { date, coins: data ?? [], updatedAt: new Date().toISOString() },
    {
      headers: {
        "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300",
      },
    }
  );
}
