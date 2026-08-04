"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function SettingsPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        setLoading(false);
        return;
      }
      setEmail(user.email ?? "");
      supabase
        .from("profiles")
        .select("full_name, phone, country")
        .eq("id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data) {
            setFullName(data.full_name ?? "");
            setPhone(data.phone ?? "");
            setCountry(data.country ?? "");
          }
          setLoading(false);
        });
    });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("profiles")
      .update({ full_name: fullName, phone, country })
      .eq("id", user.id);

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (loading) {
    return (
      <div className="text-[13px] text-text-tertiary">Loading settings...</div>
    );
  }

  if (!email) {
    return (
      <div className="space-y-4 max-w-2xl">
        <div>
          <h1 className="text-lg font-bold text-text-primary">Settings</h1>
          <p className="text-[13px] text-text-tertiary mt-1">
            Manage your account preferences
          </p>
        </div>
        <Card>
          <p className="text-[13px] text-text-secondary">
            Sign in to view and edit your account settings.
          </p>
          <div className="flex gap-2 mt-4">
            <Link href="/login">
              <Button size="sm">Log In</Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="sm">
                Create Account
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <div>
        <h1 className="text-lg font-bold text-text-primary">Settings</h1>
        <p className="text-[13px] text-text-tertiary mt-1">
          Manage your account preferences
        </p>
      </div>

      <Card>
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            id="fullName"
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <Input id="email" label="Email" value={email} disabled />
          <Input
            id="phone"
            label="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Input
            id="country"
            label="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          <Button type="submit">{saved ? "Saved!" : "Save Changes"}</Button>
        </form>
      </Card>

      <Card>
        <h3 className="text-[13px] font-semibold text-text-primary mb-2">
          Security
        </h3>
        <p className="text-[13px] text-text-tertiary mb-4">
          Enable two-factor authentication for enhanced account security.
        </p>
        <Link href="/help">
          <Button variant="outline" size="sm">
            Enable 2FA
          </Button>
        </Link>
      </Card>
    </div>
  );
}
