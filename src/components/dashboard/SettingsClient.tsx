"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LANGUAGES } from "@/components/i18n/LanguageSelector";
import i18n, { ensureLocaleLoaded, type SupportedLanguage } from "@/i18n";
import {
  ArrowRight,
  Bell,
  ChevronRight,
  Comments,
  FileCheck,
  Loader2,
  LogOut,
  Receipt,
  User,
} from "@/components/icons";
import { cn, formatDate } from "@/lib/utils";

const CURRENCY_CODES = ["USD", "EUR", "GBP", "AUD", "CAD", "CHF", "JPY", "AED", "SGD", "HKD"] as const;
const SOUND_PREF_KEY = "onyx-notification-sound";

type ProfileData = {
  full_name: string | null;
  phone: string | null;
  country: string | null;
  bio: string | null;
  kyc_status: string;
  preferred_currency: string;
  created_at: string;
};

function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <div className="mb-5">
        <h2 className="text-base font-semibold text-text-primary">{title}</h2>
        {description && <p className="mt-1 text-sm text-text-tertiary leading-relaxed">{description}</p>}
      </div>
      {children}
    </Card>
  );
}

function SettingsRow({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-b border-border py-4 first:pt-0 last:border-b-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-text-primary">{title}</p>
        {description && <p className="mt-0.5 text-xs text-text-tertiary leading-relaxed">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function KycBadge({ status }: { status: string }) {
  const { t } = useTranslation();
  const label =
    status === "approved"
      ? t("dashboard.verified")
      : status === "pending"
        ? t("dashboard.kycPending")
        : status === "rejected"
          ? t("dashboard.kycRejected")
          : t("dashboard.kycNone");

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
        status === "approved" && "bg-green/10 text-green",
        status === "pending" && "bg-amber-500/10 text-amber-600 dark:text-amber-300",
        status === "rejected" && "bg-red/10 text-red",
        status === "none" && "bg-bg-hover text-text-tertiary"
      )}
    >
      {label}
    </span>
  );
}

function AccountLinkCard({
  href,
  title,
  description,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-2xl border border-border bg-bg-primary/40 px-4 py-3.5 transition-all hover:border-brand/20 hover:bg-bg-hover/50"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-bg-secondary text-brand">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-text-primary group-hover:text-brand transition-colors">{title}</p>
        <p className="text-xs text-text-tertiary mt-0.5">{description}</p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-text-tertiary opacity-50 group-hover:opacity-100" />
    </Link>
  );
}

export function SettingsClient() {
  const { t, i18n: i18nInstance } = useTranslation();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingCurrency, setSavingCurrency] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [currencySaved, setCurrencySaved] = useState(false);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [bio, setBio] = useState("");
  const [kycStatus, setKycStatus] = useState("none");
  const [memberSince, setMemberSince] = useState("");
  const [preferredCurrency, setPreferredCurrency] = useState("USD");

  const [soundEnabled, setSoundEnabled] = useState(true);

  const locale = (i18nInstance.language?.split("-")[0] || "en") as SupportedLanguage;

  useEffect(() => {
    const storedSound = localStorage.getItem(SOUND_PREF_KEY);
    if (storedSound !== null) setSoundEnabled(storedSound === "true");

    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.replace("/login?redirect=/dashboard/settings");
        return;
      }

      setEmail(user.email ?? "");
      setMemberSince(user.created_at ?? "");

      supabase
        .from("profiles")
        .select("full_name, phone, country, bio, kyc_status, preferred_currency, created_at")
        .eq("id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data) {
            const profile = data as ProfileData;
            setFullName(profile.full_name ?? "");
            setPhone(profile.phone ?? "");
            setCountry(profile.country ?? "");
            setBio(profile.bio ?? "");
            setKycStatus(profile.kyc_status ?? "none");
            setPreferredCurrency(profile.preferred_currency ?? "USD");
            if (profile.created_at) setMemberSince(profile.created_at);
          }
          setLoading(false);
        });
    });
  }, [router]);

  const initials = useMemo(() => {
    const source = fullName.trim() || email;
    return source.charAt(0).toUpperCase() || "U";
  }, [email, fullName]);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    setError("");
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ full_name: fullName, phone, country, bio })
        .eq("id", user.id);

      if (updateError) throw updateError;
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch {
      setError(t("settingsPage.saveFailed"));
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleCurrencyChange(code: string) {
    setPreferredCurrency(code);
    setSavingCurrency(true);
    setError("");
    try {
      const supabase = createClient();
      const { error: rpcError } = await supabase.rpc("update_user_currency", { p_currency: code });
      if (rpcError) throw rpcError;
      setCurrencySaved(true);
      setTimeout(() => setCurrencySaved(false), 3000);
    } catch {
      setError(t("settingsPage.saveFailed"));
    } finally {
      setSavingCurrency(false);
    }
  }

  async function handleLanguageChange(code: SupportedLanguage) {
    await ensureLocaleLoaded(code);
    await i18n.changeLanguage(code);
  }

  function handleSoundToggle(enabled: boolean) {
    setSoundEnabled(enabled);
    localStorage.setItem(SOUND_PREF_KEY, String(enabled));
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-text-tertiary">
        <Loader2 className="h-4 w-4" />
        {t("common.loading")}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-brand">
          {t("dashboard.settings")}
        </p>
        <h1 className="mt-1 text-xl sm:text-2xl font-bold text-text-primary">{t("settingsPage.title")}</h1>
        <p className="mt-1.5 text-sm text-text-tertiary">{t("settingsPage.subtitle")}</p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red/20 bg-red/5 px-4 py-3 text-sm text-red">{error}</div>
      )}

      <SettingsSection title={t("settingsPage.profileTitle")} description={t("settingsPage.profileDesc")}>
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-brand/20 bg-brand/10 text-xl font-bold text-brand">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-base font-semibold text-text-primary">{fullName || email.split("@")[0]}</p>
              <KycBadge status={kycStatus} />
            </div>
            <p className="mt-1 text-sm text-text-tertiary">{email}</p>
            {memberSince && (
              <p className="mt-1 text-xs text-text-tertiary">
                {t("settingsPage.memberSince", {
                  date: formatDate(memberSince).split(",")[1]?.trim() || formatDate(memberSince),
                })}
              </p>
            )}
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              id="fullName"
              label={t("settingsPage.fullName")}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <Input id="email" label={t("settingsPage.email")} value={email} disabled />
            <Input
              id="phone"
              label={t("settingsPage.phone")}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Input
              id="country"
              label={t("auth.country")}
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder={t("auth.countryPlaceholder")}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="bio" className="block text-xs text-text-tertiary">
              {t("settingsPage.bio")}
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder={t("settingsPage.bioPlaceholder")}
              className="w-full resize-none rounded-xl border border-border bg-bg-primary px-3 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:border-brand focus:outline-none"
            />
          </div>

          {kycStatus !== "approved" && (
            <div className="rounded-2xl border border-border bg-bg-primary/50 px-4 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-text-primary">{t("settingsPage.identityTitle")}</p>
                <p className="text-xs text-text-tertiary mt-0.5">{t("settingsPage.identityDesc")}</p>
              </div>
              <Link href="/dashboard/support">
                <Button variant="outline" size="sm">
                  <FileCheck className="h-4 w-4" />
                  {t("settingsPage.completeKyc")}
                </Button>
              </Link>
            </div>
          )}

          <Button type="submit" disabled={savingProfile}>
            {savingProfile ? <Loader2 className="h-4 w-4" /> : null}
            {profileSaved ? t("settingsPage.profileSaved") : t("settingsPage.saveProfile")}
          </Button>
        </form>
      </SettingsSection>

      <SettingsSection title={t("settingsPage.preferencesTitle")} description={t("settingsPage.preferencesDesc")}>
        <SettingsRow title={t("settingsPage.theme")} description={t("settingsPage.themeDesc")}>
          <ThemeToggle variant="segmented" />
        </SettingsRow>

        <SettingsRow title={t("settingsPage.language")} description={t("settingsPage.languageDesc")}>
          <select
            value={locale}
            onChange={(e) => void handleLanguageChange(e.target.value as SupportedLanguage)}
            className="h-10 min-w-[160px] rounded-xl border border-border bg-bg-primary px-3 text-sm text-text-primary focus:border-brand focus:outline-none"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.native}
              </option>
            ))}
          </select>
        </SettingsRow>

        <SettingsRow title={t("settingsPage.currency")} description={t("settingsPage.currencyDesc")}>
          <div className="flex items-center gap-2">
            <select
              value={preferredCurrency}
              onChange={(e) => void handleCurrencyChange(e.target.value)}
              disabled={savingCurrency}
              className="h-10 min-w-[160px] rounded-xl border border-border bg-bg-primary px-3 text-sm text-text-primary focus:border-brand focus:outline-none"
            >
              {CURRENCY_CODES.map((code) => (
                <option key={code} value={code}>
                  {code} · {t(`currencies.${code}`, { defaultValue: code })}
                </option>
              ))}
            </select>
            {savingCurrency && <Loader2 className="h-4 w-4 text-text-tertiary" />}
          </div>
        </SettingsRow>

        {currencySaved && (
          <p className="text-xs text-green">{t("settingsPage.currencyUpdated")}</p>
        )}
      </SettingsSection>

      <SettingsSection
        title={t("settingsPage.notificationsTitle")}
        description={t("settingsPage.notificationsDesc")}
      >
        <SettingsRow
          title={t("settingsPage.notificationSound")}
          description={t("settingsPage.notificationSoundDesc")}
        >
          <div className="inline-flex rounded-xl border border-border bg-bg-tertiary p-1">
            <button
              type="button"
              onClick={() => handleSoundToggle(true)}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                soundEnabled ? "bg-bg-secondary text-text-primary shadow-sm" : "text-text-tertiary"
              )}
            >
              {t("settingsPage.prefOn")}
            </button>
            <button
              type="button"
              onClick={() => handleSoundToggle(false)}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                !soundEnabled ? "bg-bg-secondary text-text-primary shadow-sm" : "text-text-tertiary"
              )}
            >
              {t("settingsPage.prefOff")}
            </button>
          </div>
        </SettingsRow>

        <div className="mt-4 rounded-2xl border border-border bg-bg-primary/50 px-4 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-text-primary">{t("notifications.title")}</p>
            <p className="text-xs text-text-tertiary mt-0.5">{t("settingsPage.notifInboxHint")}</p>
          </div>
          <Link href="/dashboard/notifications">
            <Button variant="outline" size="sm">
              {t("settingsPage.openNotifications")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </SettingsSection>

      <SettingsSection title={t("dashboard.navGroupAccount")} description={t("dashboard.openTransactions")}>
        <div className="grid gap-3 sm:grid-cols-2">
          <AccountLinkCard
            href="/dashboard/transactions"
            title={t("dashboard.transactions")}
            description={t("transactions.subtitle")}
            icon={<Receipt className="h-4 w-4" />}
          />
          <AccountLinkCard
            href="/dashboard/notifications"
            title={t("dashboard.notifications")}
            description={t("notifications.pageSubtitle")}
            icon={<Bell className="h-4 w-4" />}
          />
          <AccountLinkCard
            href="/dashboard/support"
            title={t("dashboard.support")}
            description={t("settingsPage.notifInboxHint")}
            icon={<Comments className="h-4 w-4" />}
          />
          <AccountLinkCard
            href="/help"
            title="Help Center"
            description={t("common.learnMore")}
            icon={<User className="h-4 w-4" />}
          />
        </div>
      </SettingsSection>

      <div className="flex justify-end pt-2">
        <Button variant="ghost" onClick={() => void handleSignOut()} className="text-red hover:bg-red/5 hover:text-red">
          <LogOut className="h-4 w-4" />
          {t("common.signOut")}
        </Button>
      </div>
    </div>
  );
}
