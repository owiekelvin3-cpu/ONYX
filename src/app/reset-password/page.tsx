"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AuthShell, AuthCardHeader } from "@/components/auth/AuthLayout";
import { AuthInput } from "@/components/auth/AuthInput";
import { Button } from "@/components/ui/Button";
import { Loader2, Lock } from "@/components/icons";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setReady(Boolean(session));
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords must match");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  if (!ready) {
    return (
      <AuthShell panelTitle="Reset password" panelSubtitle="Choose a new password for your account.">
        <div className="rounded-lg border border-border bg-bg-secondary/40 px-4 py-6 text-center text-sm text-text-secondary">
          <p>This reset link is invalid or has expired.</p>
          <Link href="/forgot-password" className="mt-3 inline-block text-brand hover:text-brand-hover">
            Request a new link
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell panelTitle="Reset password" panelSubtitle="Choose a new password for your account.">
      <AuthCardHeader
        title="New password"
        subtitle="Use at least 8 characters"
        alternate={{
          prompt: "Back to",
          href: "/login",
          label: "Sign in",
        }}
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          id="password"
          label="New password"
          type="password"
          placeholder="Min. 8 characters"
          autoComplete="new-password"
          icon={<Lock />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <AuthInput
          id="confirmPassword"
          label="Confirm password"
          type="password"
          placeholder="Repeat password"
          autoComplete="new-password"
          icon={<Lock />}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {error && (
          <p
            role="alert"
            className="text-[13px] text-red bg-red/[0.08] border border-red/30 rounded-lg px-4 py-3"
          >
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Updating...
            </span>
          ) : (
            "Update password"
          )}
        </Button>
      </form>
    </AuthShell>
  );
}
