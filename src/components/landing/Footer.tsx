import Link from "next/link";
import { BRAND, FOOTER } from "@/lib/constants";
import { siteRoute } from "@/lib/routes";

const MOBILE_FOOTER_LINKS = [
  "Help Center",
  "Fees",
  "Terms of Use",
  "Privacy",
] as const;

export function Footer() {
  return (
    <footer className="bg-bg-secondary border-t border-border">
      <div className="container-app pt-10 sm:pt-14 pb-[max(2rem,var(--safe-bottom))]">
        <div className="grid gap-8 sm:gap-10 sm:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden>
                <rect width="28" height="28" rx="6" fill="#F0B90B" />
                <path d="M8 18L14 8L20 18H16.5L14 14.5L11.5 18H8Z" fill="#0B0E11" />
              </svg>
              <span className="font-bold text-text-primary">{BRAND.name}</span>
            </Link>
            <p className="text-xs text-text-tertiary mt-3 leading-relaxed max-w-xs">
              {BRAND.description}
            </p>

            <nav
              className="mt-6 flex flex-wrap gap-x-4 gap-y-2 sm:hidden"
              aria-label="Legal and support"
            >
              {MOBILE_FOOTER_LINKS.map((link) => (
                <Link
                  key={link}
                  href={siteRoute(link)}
                  className="text-xs font-medium text-text-tertiary hover:text-text-primary transition-colors"
                >
                  {link}
                </Link>
              ))}
            </nav>
          </div>

          {Object.entries(FOOTER).map(([title, links]) => (
            <div key={title} className="hidden sm:block">
              <h4 className="text-xs font-semibold text-text-primary mb-2 sm:mb-3">
                {title}
              </h4>
              <ul className="space-y-1.5 sm:space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href={siteRoute(link)}
                      className="text-[11px] sm:text-xs text-text-tertiary hover:text-text-primary transition-colors block py-0.5"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border mt-8 sm:mt-10 pt-5 sm:pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-[11px] text-text-tertiary">
            &copy; {new Date().getFullYear()} {BRAND.fullName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
