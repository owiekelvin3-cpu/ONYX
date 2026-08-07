"use client";

import Link from "next/link";
import { BRAND } from "@/lib/constants";
import { MARKETING_PAGES } from "@/lib/marketing-nav";
import { siteRoute } from "@/lib/routes";
import { FOOTER } from "@/lib/constants";
import { OnyxLogo } from "@/components/brand/OnyxLogo";

export function MarketingFooter() {
  return (
    <footer className="fin-footer mt-auto">
      <div className="container-app py-10 sm:py-12 pb-[max(2rem,var(--safe-bottom))]">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--nav-active-bg)]">
                <OnyxLogo size={20} />
              </span>
              <span className="font-bold text-text-primary">{BRAND.fullName}</span>
            </Link>
            <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-text-secondary">
              {BRAND.description}
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-[13px] font-semibold text-text-primary">Platform</h4>
            <ul className="space-y-2">
              {MARKETING_PAGES.filter((p) => p.href !== "/").slice(0, 5).map((page) => (
                <li key={page.href}>
                  <Link
                    href={page.href}
                    className="text-[13px] text-text-secondary transition-colors hover:text-text-primary"
                  >
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
                <h4 className="mb-3 text-[13px] font-semibold text-text-primary">{title}</h4>
                <ul className="space-y-2">
                  {links.slice(0, 5).map((link) => (
                    <li key={link}>
                      <Link
                        href={siteRoute(link)}
                        className="text-[13px] text-text-secondary transition-colors hover:text-text-primary"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-[12px] text-text-tertiary sm:flex-row">
          <p>&copy; {new Date().getFullYear()} {BRAND.fullName}. All rights reserved.</p>
          <p>Markets move fast. Your exchange shouldn&apos;t slow you down.</p>
        </div>
      </div>
    </footer>
  );
}
