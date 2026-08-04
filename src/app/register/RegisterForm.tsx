"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BRAND } from "@/lib/constants";
import { COUNTRIES } from "@/lib/countries";
import { AuthShell, AuthCardHeader } from "@/components/auth/AuthLayout";
import { AuthInput, AuthSelect } from "@/components/auth/AuthInput";
import {
  AuthSteps,
  PasswordStrength,
} from "@/components/auth/AuthSteps";
import { Button } from "@/components/ui/Button";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";

const REGISTER_STEPS = [
  { label: "Account" },
  { label: "Profile" },
  { label: "Security" },
];

/** Latest date allowed — user must be at least 18 */
function maxBirthDate(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 18);
  return d.toISOString().slice(0, 10);
}

function minBirthDate(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 100);
  return d.toISOString().slice(0, 10);
}

function parseDateOfBirth(value: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return value;
}

function isAtLeast18(isoDate: string): boolean {
  const dob = new Date(isoDate);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age -= 1;
  }
  return age >= 18;
}

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("United States");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function validateStep(current: number) {
    const errors: Record<string, string> = {};

    if (current === 1) {
      if (!firstName.trim()) errors.firstName = "Required";
      if (!lastName.trim()) errors.lastName = "Required";
      if (!email.trim()) errors.email = "Required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
        errors.email = "Enter a valid email";

      const parsedDob = parseDateOfBirth(dateOfBirth);
      if (!dateOfBirth) errors.dateOfBirth = "Select your date of birth";
      else if (!parsedDob) errors.dateOfBirth = "Enter a valid date";
      else if (!isAtLeast18(parsedDob))
        errors.dateOfBirth = "You must be at least 18 years old";
    }

    if (current === 3) {
      if (password.length < 8) errors.password = "Min. 8 characters";
      if (password !== confirmPassword) errors.confirmPassword = "Passwords must match";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleNext() {
    if (validateStep(step)) setStep((s) => Math.min(s + 1, 3));
  }

  function handleBack() {
    setFieldErrors({});
    setStep((s) => Math.max(s - 1, 1));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep(3)) return;

    const parsedDob = parseDateOfBirth(dateOfBirth);
    if (!parsedDob) return;

    setError("");
    setLoading(true);

    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          full_name: `${firstName.trim()} ${lastName.trim()}`,
          date_of_birth: parsedDob,
          phone: phone.trim() || null,
          country: country.trim() || null,
          address: address.trim() || null,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await supabase
        .from("profiles")
        .update({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          full_name: `${firstName.trim()} ${lastName.trim()}`,
          date_of_birth: parsedDob,
          phone: phone.trim() || null,
          country: country.trim() || null,
          address: address.trim() || null,
        })
        .eq("id", data.user.id);
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <AuthShell
      wide
      panelTitle="Create your ONYX account"
      panelSubtitle="Open your account in minutes. Trade crypto, stocks, and forex with deep liquidity and low fees."
    >
      <AuthCardHeader
        title="Create account"
        subtitle={`Start trading on ${BRAND.fullName}`}
        alternate={{
          prompt: "Already have an account?",
          href: "/login",
          label: "Sign in",
        }}
      />

      <AuthSteps steps={REGISTER_STEPS} current={step} />

      <form onSubmit={handleSubmit} className="space-y-4">
        {step === 1 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AuthInput
                id="firstName"
                label="First name"
                type="text"
                placeholder="John"
                autoComplete="given-name"
                icon={<User />}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                error={fieldErrors.firstName}
                required
              />
              <AuthInput
                id="lastName"
                label="Last name"
                type="text"
                placeholder="Doe"
                autoComplete="family-name"
                icon={<User />}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                error={fieldErrors.lastName}
                required
              />
            </div>
            <AuthInput
              id="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              icon={<Mail />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={fieldErrors.email}
              required
            />
            <AuthInput
              id="dateOfBirth"
              label="Date of birth"
              type="date"
              autoComplete="bday"
              icon={<Calendar />}
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              min={minBirthDate()}
              max={maxBirthDate()}
              error={fieldErrors.dateOfBirth}
              required
            />
            <p className="text-[12px] text-text-tertiary -mt-2">
              Tap to open the calendar — you must be 18 or older.
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-[13px] text-text-secondary -mt-2 mb-1">
              Optional — helps us personalize your experience and comply with regulations.
            </p>
            <AuthInput
              id="phone"
              label="Phone"
              type="tel"
              placeholder="+1 234 567 8900"
              autoComplete="tel"
              icon={<Phone />}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <AuthSelect
              id="country"
              label="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </AuthSelect>
            <AuthInput
              id="address"
              label="Address"
              type="text"
              placeholder="123 Main Street"
              autoComplete="street-address"
              icon={<MapPin />}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </>
        )}

        {step === 3 && (
          <>
            <AuthInput
              id="password"
              label="Password"
              type="password"
              placeholder="Create a strong password"
              autoComplete="new-password"
              icon={<Lock />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={fieldErrors.password}
              required
            />
            <PasswordStrength password={password} />
            <AuthInput
              id="confirmPassword"
              label="Confirm password"
              type="password"
              placeholder="Re-enter your password"
              autoComplete="new-password"
              icon={<Lock />}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={fieldErrors.confirmPassword}
              required
            />
            <p className="text-[12px] text-text-tertiary leading-relaxed">
              By creating an account, I agree to the{" "}
              <Link href="/terms" className="text-brand hover:underline">
                Terms of Use
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-brand hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </>
        )}

        {error && (
          <div
            role="alert"
            className="text-[13px] text-red bg-red/[0.08] border border-red/30 rounded-lg px-4 py-3"
          >
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              className="!h-[50px] flex-1 !rounded-lg"
              onClick={handleBack}
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
          )}

          {step < 3 ? (
            <Button
              type="button"
              className="!h-[50px] flex-1 !rounded-lg !text-[15px]"
              onClick={handleNext}
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              className="!h-[50px] flex-1 !rounded-lg !text-[15px] !font-semibold"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </Button>
          )}
        </div>
      </form>
    </AuthShell>
  );
}
