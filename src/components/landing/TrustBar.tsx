import { Clock, Layers, Receipt, Shield } from "lucide-react";
import { PLATFORM_HIGHLIGHTS } from "@/lib/constants";

const ICONS = [Shield, Receipt, Layers, Clock] as const;

export function TrustBar() {
  return (
    <section className="bg-bg-secondary border-y border-border">
      <div className="container-app py-8 sm:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-x-8 sm:gap-y-6">
          {PLATFORM_HIGHLIGHTS.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <div key={item.title} className="flex gap-3.5 min-w-0">
                <span className="w-9 h-9 rounded-lg bg-bg-primary border border-border flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-brand" strokeWidth={1.75} />
                </span>
                <div className="min-w-0 pt-0.5">
                  <p className="text-sm font-medium text-text-primary">{item.title}</p>
                  <p className="text-xs text-text-tertiary mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
