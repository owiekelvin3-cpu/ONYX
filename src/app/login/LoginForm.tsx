"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BRAND } from "@/lib/constants";
import { isAdminPanelPath } from "@/lib/auth-guards";
import { AuthShell, AuthCardHeader } from "@/components/auth/AuthLayout";
import { AuthInput } from "@/components/auth/AuthInput";
import { Button } from "@/components/ui/Button";
import { Loader2, Lock, Mail } from "lucide-react";

const REMEMBER_KEY = "onyx_remember_email";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(REMEMBER_KEY);
    if (saved && !searchParams.get("email")) {
      setEmail(saved);
      setRemember(true);
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (remember) {
      localStorage.setItem(REMEMBER_KEY, email.trim());
    } else {
      localStorage.removeItem(REMEMBER_KEY);
    }

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

    const rawRedirect = searchParams.get("redirect") ?? "/dashboard";
    let redirect = "/dashboard";

    if (isAdminPanelPath(rawRedirect)) {
      const userId = authData.user?.id;
      if (userId) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", userId)
          .maybeSingle();
        redirect = profile?.role === "admin" ? rawRedirect : "/dashboard";
      }
    } else if (rawRedirect.startsWith("/") && !rawRedirect.startsWith("//")) {
      redirect = rawRedirect;
    }

    router.push(redirect);
    router.refresh();
  }

  return (
    <AuthShell
      panelTitle="Welcome back"
      panelSubtitle="Sign in to view your portfolio, place trades, and manage your account."
    >
      <AuthCardHeader
        title="Log in"
        subtitle={`Access your ${BRAND.name} account`}
        alternate={{
          prompt: "New to ONYX?",
          href: "/register",
          label: "Create free account",
        }}
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          id="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          icon={<Mail />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div>
          <AuthInput
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            icon={<Lock />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="flex items-center justify-between mt-3 gap-3">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-border bg-bg-primary accent-brand cursor-pointer"
              />
              <span className="text-[13px] text-text-secondary">Remember email</span>
            </label>
            <Link
              href="/help"
              className="text-[13px] text-brand hover:text-brand-hover transition-colors shrink-0"
            >
              Forgot password?
            </Link>
          </div>
        </div>

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
          className="w-full !h-[50px] !text-[15px] !font-semibold !rounded-lg mt-1"
          disabled={loading || !email.trim() || !password}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Signing in...
            </span>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      <p className="text-[12px] text-text-tertiary text-center mt-6 leading-relaxed">
        Protected by encryption. By signing in you agree to our{" "}
        <Link href="/terms" className="text-brand hover:underline">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-brand hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
    </AuthShell>
  );
}
