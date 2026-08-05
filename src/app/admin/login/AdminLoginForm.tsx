"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BRAND } from "@/lib/constants";
import { AuthInput } from "@/components/auth/AuthInput";
import { Button } from "@/components/ui/Button";
import { Loader2, Lock, Mail, Shield } from "lucide-react";

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    const userId = authData.user?.id;
    if (!userId) {
      setError("Sign in failed. Please try again.");
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .maybeSingle();

    if (profile?.role !== "admin") {
      await supabase.auth.signOut();
      setError("This account does not have admin access.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-dvh bg-bg-primary auth-page flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-[420px] auth-form-card">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-10 h-10 rounded-lg bg-brand/15 border border-brand/25 flex items-center justify-center">
            <Shield className="w-5 h-5 text-brand" strokeWidth={1.75} />
          </span>
          <div>
            <p className="text-xs text-text-tertiary uppercase tracking-wider">Admin</p>
            <h1 className="text-xl font-bold text-text-primary">{BRAND.name} Console</h1>
          </div>
        </div>

        <p className="text-sm text-text-tertiary mb-6">
          Sign in with your admin email and password. Only authorized operators can access this area.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AuthInput
            id="admin-email"
            label="Admin email"
            type="email"
            placeholder="admin@example.com"
            autoComplete="email"
            icon={<Mail />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <AuthInput
            id="admin-password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            icon={<Lock />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <div
              role="alert"
              className="text-[13px] text-red bg-red/[0.08] border border-red/30 rounded-lg px-4 py-3"
            >
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full !h-[50px] !text-[15px] !font-semibold !rounded-lg"
            disabled={loading || !email.trim() || !password}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Signing in...
              </span>
            ) : (
              "Sign in to admin"
            )}
          </Button>
        </form>

        <p className="text-[12px] text-text-tertiary text-center mt-6">
          <Link href="/" className="text-brand hover:underline">
            Back to {BRAND.name}
          </Link>
          {" · "}
          <Link href="/login" className="text-text-tertiary hover:text-text-secondary">
            User login
          </Link>
        </p>
      </div>
    </div>
  );
}
