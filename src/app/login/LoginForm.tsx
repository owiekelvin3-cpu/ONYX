"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BRAND } from "@/lib/constants";
import { AuthShell } from "@/components/auth/AuthLayout";
import { AuthInput, AuthTabs } from "@/components/auth/AuthInput";
import { Button } from "@/components/ui/Button";
import { Loader2, Lock, Mail } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState("email");
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (tab !== "email") return;
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <AuthShell>
      <AuthTabs
        tabs={[
          { id: "email", label: "Email" },
          { id: "qr", label: "QR Code" },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === "email" ? (
        <>
          <h1 className="text-[28px] sm:text-[32px] font-bold text-text-primary tracking-tight mb-2">
            Log in
          </h1>
          <p className="text-[14px] text-text-tertiary mb-8">
            Access your {BRAND.name} account
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AuthInput
              id="email"
              label="Email"
              type="email"
              placeholder="Enter email"
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
                placeholder="Enter password"
                autoComplete="current-password"
                icon={<Lock />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="flex justify-end mt-2">
              <Link
                href="/help"
                className="text-[13px] text-brand hover:text-brand-hover transition-colors"
              >
                Forgot password?
              </Link>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="text-[13px] text-red bg-red/[0.08] border border-red/30 rounded-md px-4 py-3"
              >
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full !h-[48px] !text-[15px] !font-semibold !rounded-md mt-2"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Logging in...
                </span>
              ) : (
                "Log In"
              )}
            </Button>
          </form>

          <p className="text-center text-[14px] text-text-tertiary mt-8">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-brand font-semibold hover:text-brand-hover transition-colors"
            >
              Register
            </Link>
          </p>
        </>
      ) : (
        <div className="text-center py-4">
          <h1 className="text-[28px] font-bold text-text-primary mb-2">QR Code Login</h1>
          <p className="text-[14px] text-text-tertiary mb-8">
            Scan with the {BRAND.name} app to log in instantly
          </p>
          <div className="mx-auto w-[180px] h-[180px] bg-white rounded-lg p-3 mb-6">
            <div className="w-full h-full bg-[repeating-linear-gradient(0deg,#0B0E11_0px,#0B0E11_8px,#fff_8px,#fff_16px),repeating-linear-gradient(90deg,#0B0E11_0px,#0B0E11_8px,#fff_8px,#fff_16px)] rounded-sm" />
          </div>
          <p className="text-[13px] text-text-tertiary">
            Open the app and tap the scan icon
          </p>
          <button
            type="button"
            onClick={() => setTab("email")}
            className="mt-6 text-[14px] text-brand font-medium hover:underline cursor-pointer"
          >
            Log in with email instead
          </button>
        </div>
      )}
    </AuthShell>
  );
}
