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
            <h3 className="text-base font-semibold text-text-primary">Your Assets, Protected</h3>
            <p className="text-sm text-text-tertiary mt-2 leading-relaxed">
              Industry-leading security with cold storage for 95% of assets, multi-signature wallets, and real-time monitoring.
            </p>
            <div className="mt-5 sm:mt-6 grid grid-cols-2 gap-3 sm:gap-4">
              {[
                { label: "Cold Storage", value: "95%" },
                { label: "Insurance Fund", value: "$500M" },
                { label: "Security Audits", value: "Quarterly" },
                { label: "Compliance", value: "SOC 2" },
              ].map((item) => (
                <div key={item.label} className="bg-bg-secondary border border-border rounded p-3 sm:p-4">
                  <p className="text-base sm:text-lg font-bold text-text-primary">{item.value}</p>
                  <p className="text-[11px] text-text-tertiary mt-0.5">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
