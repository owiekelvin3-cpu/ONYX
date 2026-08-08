import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ADMIN_AUTH_COOKIE } from "@/lib/auth-guards";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

async function verifyAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { ok: false as const, status: 401, error: "Not authenticated" };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    return { ok: false as const, status: 500, error: "Could not verify team access" };
  }

  if (profile?.role !== "admin") {
    return { ok: false as const, status: 403, error: "This account does not have team access" };
  }

  return { ok: true as const };
}

export async function POST() {
  const result = await verifyAdmin();
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_AUTH_COOKIE, "1", {
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_AUTH_COOKIE, "", {
    path: "/",
    maxAge: 0,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });
  return response;
}
