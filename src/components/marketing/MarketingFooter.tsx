"use client";

import Link from "next/link";
import { BRAND } from "@/lib/constants";
import { MARKETING_PAGES } from "@/lib/marketing-nav";
import { siteRoute } from "@/lib/routes";
import { FOOTER } from "@/lib/constants";
import { OnyxLogo } from "@/components/brand/OnyxLogo";

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-bg-secondary tv-footer">
      <div className="container-app py-12 sm:py-14 pb-[max(2rem,var(--safe-bottom))]">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <OnyxLogo size={24} />
              <span className="font-bold text-text-primary">{BRAND.fullName}</span>
            </Link>
            <p className="mt-3 text-[13px] text-text-tertiary leading-relaxed max-w-sm">
              {BRAND.description}
            </p>
            <p className="mt-4 text-[11px] uppercase tracking-wider text-text-tertiary font-semibold">
              Look First
            </p>
          </div>

          <div>
            <h4 className="text-[13px] font-semibold text-text-primary mb-3">Platform</h4>
            <ul className="space-y-2">
              {MARKETING_PAGES.filter((p) => p.href !== "/").slice(0, 5).map((page) => (
                <li key={page.href}>
                  <Link href={page.href} className="text-[13px] text-text-tertiary hover:text-brand transition-colors">
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {Object.entries(FOOTER)
            .slice(0, 3)
            .map(([title, links]) => (
              <div key={title}>
                <h4 className="text-[13px] font-semibold text-text-primary mb-3">{title}</h4>
                <ul className="space-y-2">
                  {links.slice(0, 5).map((link) => (
                    <li key={link}>
                      <Link
                        href={siteRoute(link)}
                        className="text-[13px] text-text-tertiary hover:text-brand transition-colors"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-text-tertiary">
          <p>
            &copy; {new Date().getFullYear()} {BRAND.fullName}. All rights reserved.
          </p>
          <p>Markets move fast. Your exchange shouldn&apos;t slow you down.</p>
        </div>
      </div>
    </footer>
  );
}
