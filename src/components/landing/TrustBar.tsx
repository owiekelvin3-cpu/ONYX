"use client";

import { Clock, Layers, Receipt, Shield } from "@/components/icons";
import { PLATFORM_HIGHLIGHTS } from "@/lib/constants";
import { Stagger, StaggerItem } from "@/components/landing/motion";

const ICONS = [Shield, Receipt, Layers, Clock] as const;

export function TrustBar() {
  return (
    <section className="bg-bg-secondary border-y border-border">
      <div className="container-app py-8 sm:py-10">
        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-x-8 sm:gap-y-6">
          {PLATFORM_HIGHLIGHTS.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <StaggerItem key={item.title}>
                <div className="group flex gap-3.5 min-w-0 h-full p-3 -m-3 rounded-lg transition-colors hover:bg-bg-primary/50">
                  <span className="w-9 h-9 rounded-lg bg-bg-primary border border-border flex items-center justify-center shrink-0 transition-all group-hover:border-brand/30 group-hover:shadow-[0_0_20px_rgba(240,185,11,0.08)]">
                    <Icon className="w-4 h-4 text-brand transition-transform group-hover:scale-110" strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-sm font-medium text-text-primary">{item.title}</p>
                    <p className="text-xs text-text-tertiary mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
