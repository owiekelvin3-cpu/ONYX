import { TRUST_ITEMS } from "@/lib/constants";

export function TrustBar() {
  return (
    <section className="bg-bg-secondary border-y border-border">
      <div className="container-app py-8 sm:py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {TRUST_ITEMS.map((item) => (
            <div key={item.label} className="text-center lg:text-left min-w-0">
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-primary tracking-tight truncate">
                {item.value}
              </p>
              <p className="text-[11px] sm:text-xs text-text-tertiary mt-1 leading-snug">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
