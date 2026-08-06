"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default function SettingsPage() {
  const router = useRouter();
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
        router.replace("/login?redirect=/dashboard/settings");
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
  }, [router]);

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
        <h3 className="text-[13px] font-semibold text-text-primary mb-2">Appearance</h3>
        <p className="text-[13px] text-text-tertiary mb-4">
          Choose light or dark mode for the platform interface.
        </p>
        <ThemeToggle variant="segmented" />
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
