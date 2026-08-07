"use client";

import Link from "next/link";
import { BRAND } from "@/lib/constants";
import { MARKETING_PAGES } from "@/lib/marketing-nav";
import { siteRoute } from "@/lib/routes";
import { FOOTER } from "@/lib/constants";
import { OnyxLogo } from "@/components/brand/OnyxLogo";

const FOOTER_SECTIONS = Object.entries(FOOTER).slice(0, 3);

export function MarketingFooter() {
  return (
    <footer className="fin-footer mt-auto">
      <div className="container-app py-8 sm:py-12 pb-[max(1.5rem,var(--safe-bottom))]">
        <div className="fin-footer-brand mb-8 rounded-[1.5rem] border border-border bg-bg-primary p-5 sm:p-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-bg-secondary">
              <OnyxLogo size={22} />
            </span>
            <div>
              <span className="block font-bold text-text-primary">{BRAND.fullName}</span>
              <span className="text-xs text-text-tertiary">{BRAND.tagline}</span>
            </div>
          </Link>
          <p className="mt-4 max-w-md text-[13px] leading-relaxed text-text-secondary">
            {BRAND.description}
          </p>
          <Link
            href="/register"
            className="fin-btn-primary mt-4 inline-flex h-10 items-center rounded-full px-5 text-sm font-semibold lg:hidden"
          >
            Open free account
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="col-span-2 sm:col-span-1 lg:col-span-1">
            <h4 className="mb-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-text-tertiary">
              Platform
            </h4>
            <ul className="space-y-2.5">
              {MARKETING_PAGES.filter((p) => p.href !== "/").slice(0, 6).map((page) => (
                <li key={page.href}>
                  <Link
                    href={page.href}
                    className="block text-[13px] text-text-secondary transition-colors hover:text-text-primary"
                  >
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {FOOTER_SECTIONS.map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-text-tertiary">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.slice(0, 5).map((link) => (
                  <li key={link}>
                    <Link
                      href={siteRoute(link)}
                      className="block text-[13px] text-text-secondary transition-colors hover:text-text-primary"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="fin-footer-bottom mt-8 flex flex-col gap-3 border-t border-border pt-6 text-center text-[12px] text-text-tertiary sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p>&copy; {new Date().getFullYear()} {BRAND.fullName}. All rights reserved.</p>
          <p className="text-balance">Markets move fast. Your exchange shouldn&apos;t slow you down.</p>
        </div>
      </div>
    </footer>
  );
}
