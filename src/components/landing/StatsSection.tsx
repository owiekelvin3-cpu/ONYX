"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { PLATFORM_STATS } from "@/lib/constants";
import { FadeUp, Stagger, StaggerItem } from "@/components/landing/motion";

function AnimatedStat({
  value,
  suffix,
  label,
  decimals = 0,
}: {
  value: number;
  suffix: string;
  label: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!inView || reduce) {
      setDisplay(value);
      return;
    }

    const duration = 1800;
    const start = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [inView, reduce, value]);

  const formatted =
    decimals > 0 ? display.toFixed(decimals) : Math.floor(display).toLocaleString();

  return (
    <div ref={ref} className="text-center px-4 py-6">
      <p className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-gradient-brand tabular-nums">
        {formatted}
        {suffix}
      </p>
      <p className="mt-2 text-sm text-text-tertiary">{label}</p>
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="relative border-y border-border bg-bg-secondary/50 py-12 sm:py-16 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 landing-shimmer opacity-50" aria-hidden />
      <div className="container-app relative">
        <FadeUp>
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.25em] text-brand mb-2">
            Trusted globally
          </p>
          <h2 className="text-center font-display text-2xl sm:text-3xl font-bold text-text-primary mb-10">
            Built for scale. Proven in production.
          </h2>
        </FadeUp>

        <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {PLATFORM_STATS.map((stat) => (
            <StaggerItem key={stat.label}>
              <div className="rounded-2xl border border-border/80 bg-bg-primary/60 backdrop-blur-sm">
                <AnimatedStat
                  value={stat.value}
                  suffix={stat.suffix}
                  label={stat.label}
                  decimals={stat.value === 99.99 ? 2 : 0}
                />
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
