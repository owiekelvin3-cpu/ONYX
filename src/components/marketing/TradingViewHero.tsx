"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "@/components/icons";
import { HeroEnter } from "@/components/landing/motion";

export function TradingViewHero() {
  return (
    <section className="relative overflow-hidden bg-bg-primary tv-hero">
      <div className="container-app relative py-16 sm:py-20 lg:py-28 text-center">
        <HeroEnter delay={0}>
          <h1 className="mx-auto max-w-4xl text-[32px] sm:text-[44px] lg:text-[56px] font-bold leading-[1.1] tracking-tight text-text-primary text-balance">
            The best trades require research, then commitment.
          </h1>
        </HeroEnter>

        <HeroEnter delay={0.1}>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register">
              <Button size="lg" className="h-12 px-8 text-[15px] font-semibold rounded-lg min-w-[200px]">
                Get started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <p className="mt-3 text-[14px] text-text-tertiary">
            $0 forever, no credit card needed
          </p>
        </HeroEnter>

        <HeroEnter delay={0.2}>
          <div className="mt-14 pt-14 border-t border-border/60">
            <h2 className="text-[22px] sm:text-[28px] lg:text-[32px] font-bold text-text-primary">
              Where the world does markets
            </h2>
            <p className="mt-3 text-[15px] sm:text-[16px] text-text-secondary max-w-xl mx-auto leading-relaxed">
              Join millions of traders and investors taking the future into their own hands on ONYX.
            </p>
            <Link
              href="/features"
              className="inline-block mt-5 text-[14px] font-semibold text-brand hover:underline"
            >
              Explore features
            </Link>
          </div>
        </HeroEnter>
      </div>
    </section>
  );
}
