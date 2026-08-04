"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BRAND } from "@/lib/constants";
import { COUNTRIES } from "@/lib/countries";
import { AuthShell } from "@/components/auth/AuthLayout";
import { AuthInput, AuthSelect } from "@/components/auth/AuthInput";
import { Button } from "@/components/ui/Button";
import {
  Calendar,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";

function parseDateOfBirth(value: string): string | null {
  const match = value.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;

  const month = Number(match[1]);
  const day = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
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

  const strengthScore =
    password.length === 0
      ? 0
      : password.length < 8
        ? 1
        : password.length < 12
          ? 2
          : 3;

  function validateForm() {
    const errors: Record<string, string> = {};

    if (!firstName.trim()) errors.firstName = "First name is required";
    if (!lastName.trim()) errors.lastName = "Last name is required";
    if (!email.trim()) errors.email = "Email is required";

    const parsedDob = parseDateOfBirth(dateOfBirth);
    if (!dateOfBirth.trim()) {
      errors.dateOfBirth = "Date of birth is required";
    } else if (!parsedDob) {
      errors.dateOfBirth = "Use mm/dd/yyyy format";
    } else if (!isAtLeast18(parsedDob)) {
      errors.dateOfBirth = "You must be at least 18 years old";
    }

    if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFieldErrors(errors);
    return { valid: Object.keys(errors).length === 0, parsedDob };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const { valid, parsedDob } = validateForm();
    if (!valid || !parsedDob) return;

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
    <AuthShell wide>
      <h1 className="text-[28px] sm:text-[32px] font-bold text-text-primary tracking-tight mb-2">
        Create Account
      </h1>
      <p className="text-[14px] text-text-tertiary mb-8">
        Start trading on {BRAND.fullName}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
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
          type="text"
          placeholder="mm/dd/yyyy"
          autoComplete="bday"
          icon={<Calendar />}
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          inputMode="numeric"
          error={fieldErrors.dateOfBirth}
          required
        />

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

        <div>
          <AuthInput
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            icon={<Lock />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={fieldErrors.password}
            required
          />
          {strengthScore > 0 && (
            <div className="flex gap-1.5 mt-2.5">
              {[1, 2, 3].map((level) => (
                <div
                  key={level}
                  className={`h-[3px] flex-1 rounded-full transition-all duration-300 ${
                    strengthScore >= level
                      ? strengthScore === 1
                        ? "bg-red"
                        : strengthScore === 2
                          ? "bg-brand"
                          : "bg-green"
                      : "bg-border"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <AuthInput
          id="confirmPassword"
          label="Confirm password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          icon={<Lock />}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={fieldErrors.confirmPassword}
          required
        />

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
          className="w-full !h-[48px] !text-[15px] !font-semibold !rounded-md mt-1"
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

        <p className="text-[12px] text-text-tertiary text-center leading-relaxed pt-1">
          By registering, I agree to the{" "}
          <Link href="/terms" className="text-brand hover:underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-brand hover:underline">
            Privacy Policy
          </Link>
        </p>
      </form>

      <div className="mt-8 pt-8 border-t border-border">
        <p className="text-center text-[14px] text-text-tertiary">
          Already registered?{" "}
          <Link
            href="/login"
            className="text-brand font-semibold hover:text-brand-hover transition-colors"
          >
            Log in
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
