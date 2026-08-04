import Link from "next/link";
import { STEPS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

const STEP_LINKS = ["/register", "/help", "/dashboard/deposit"];

export function GetStarted() {
  return (
    <section className="bg-bg-secondary py-12 sm:py-16 lg:py-20">
      <div className="container-app">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-start">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-text-primary text-balance">
              Start Trading in 3 Steps
            </h2>
            <p className="text-sm text-text-tertiary mt-2">
              Open your account and make your first trade in minutes.
            </p>
            <div className="mt-6 sm:mt-8 space-y-5 sm:space-y-6">
              {STEPS.map((s, i) => (
                <Link key={s.step} href={STEP_LINKS[i]} className="flex gap-3 sm:gap-4 group">
                  <span className="text-brand font-bold text-sm font-mono w-6 shrink-0">{s.step}</span>
                  <div>
                    <p className="text-sm font-semibold text-text-primary group-hover:text-brand transition-colors">{s.title}</p>
                    <p className="text-xs text-text-tertiary mt-0.5">{s.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
            <Link href="/register" className="inline-block mt-6 sm:mt-8 w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto">Create Free Account</Button>
            </Link>
          </div>
          <div className="bg-bg-primary border border-border rounded-lg p-5 sm:p-8">
            <h3 className="text-base font-semibold text-text-primary">Security that&apos;s built in</h3>
            <p className="text-sm text-text-tertiary mt-2 leading-relaxed">
              Your account is protected with encryption, optional 2FA, and session controls you can manage from settings.
            </p>
            <ul className="mt-5 sm:mt-6 space-y-3">
              {[
                "Passwords hashed and never stored in plain text",
                "Two-factor authentication available in settings",
                "Withdrawals reviewed before they leave the platform",
                "Support team reachable through the help center",
              ].map((item) => (
                <li key={item} className="flex gap-2.5 text-sm text-text-secondary">
                  <span className="text-brand shrink-0 mt-0.5">·</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
