import { NextResponse } from "next/server";
import { getSupabaseEnv } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, string> = { app: "ok" };

  try {
    getSupabaseEnv();
    checks.supabase = "configured";
  } catch {
    checks.supabase = "missing_env";
    return NextResponse.json(
      { status: "degraded", checks, timestamp: new Date().toISOString() },
      { status: 503 }
    );
  }

  return NextResponse.json({
    status: "ok",
    checks,
    timestamp: new Date().toISOString(),
  });
}
