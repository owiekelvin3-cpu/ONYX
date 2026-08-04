"use client";

import { cn } from "@/lib/utils";

export function AuthSteps({
  steps,
  current,
}: {
  steps: { label: string }[];
  current: number;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between gap-2">
        {steps.map((step, i) => {
          const index = i + 1;
          const done = index < current;
          const active = index === current;

          return (
            <div key={step.label} className="flex flex-1 items-center gap-2 min-w-0">
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-colors",
                  done && "bg-green text-white",
                  active && "bg-brand text-brand-text",
                  !done && !active && "bg-bg-hover text-text-tertiary border border-border"
                )}
              >
                {done ? "✓" : index}
              </div>
              <span
                className={cn(
                  "text-[12px] font-medium truncate hidden sm:block",
                  active ? "text-text-primary" : "text-text-tertiary"
                )}
              >
                {step.label}
              </span>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-px mx-1 hidden sm:block",
                    done ? "bg-green/50" : "bg-border"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
      <p className="text-[13px] text-text-tertiary mt-3 sm:hidden">
        Step {current} of {steps.length}: {steps[current - 1]?.label}
      </p>
    </div>
  );
}

export function PasswordStrength({
  password,
}: {
  password: string;
}) {
  if (!password) return null;

  const checks = [
    { label: "8+ characters", ok: password.length >= 8 },
    { label: "Uppercase letter", ok: /[A-Z]/.test(password) },
    { label: "Number", ok: /\d/.test(password) },
  ];

  const score = checks.filter((c) => c.ok).length;
  const label =
    score === 0 ? "Too weak" : score === 1 ? "Weak" : score === 2 ? "Fair" : "Strong";
  const color =
    score <= 1 ? "bg-red" : score === 2 ? "bg-brand" : "bg-green";

  return (
    <div className="mt-2.5 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-1 flex-1">
          {[1, 2, 3].map((level) => (
            <div
              key={level}
              className={cn(
                "h-[3px] flex-1 rounded-full transition-all",
                score >= level ? color : "bg-border"
              )}
            />
          ))}
        </div>
        <span className="text-[11px] text-text-tertiary shrink-0">{label}</span>
      </div>
      <ul className="flex flex-wrap gap-x-3 gap-y-1">
        {checks.map((c) => (
          <li
            key={c.label}
            className={cn(
              "text-[11px]",
              c.ok ? "text-green" : "text-text-tertiary"
            )}
          >
            {c.ok ? "✓" : "○"} {c.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function formatDobInput(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}
