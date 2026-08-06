"use client";

import Link from "next/link";
import { useState } from "react";
import { BRAND, NAV } from "@/lib/constants";
import { siteRoute } from "@/lib/routes";
import { Button } from "@/components/ui/Button";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { ChevronDown, Globe, Menu, X } from "@/components/icons";

const NAV_ITEMS = [
  { label: "Buy Crypto", key: "BuyCrypto" as const },
  { label: "Markets", key: "Markets" as const },
  { label: "Trade", key: "Trade" as const },
  { label: "Earn", key: "Earn" as const },
  { label: "More", key: "More" as const },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  useBodyScrollLock(mobileOpen);

  return (
    <>
      <header className="sticky top-0 z-50 bg-bg-primary/95 backdrop-blur-md border-b border-border safe-area-top safe-area-x">
        <div className="container-app">
          <div className="flex items-center h-14 sm:h-16 gap-3 sm:gap-6">
            <Link href="/" className="flex items-center gap-2 shrink-0 min-w-0">
              <svg width="26" height="26" viewBox="0 0 28 28" fill="none" className="sm:w-7 sm:h-7 shrink-0" aria-hidden>
                <rect width="28" height="28" rx="6" fill="#F0B90B" />
                <path d="M8 18L14 8L20 18H16.5L14 14.5L11.5 18H8Z" fill="#0B0E11" />
              </svg>
              <span className="text-base sm:text-lg font-bold tracking-tight text-text-primary truncate">
                {BRAND.name}
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1 flex-1 min-w-0">
              {NAV_ITEMS.map((item) => (
                <div key={item.key} className="nav-item relative">
                  <button className="flex items-center gap-1 px-3 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors cursor-pointer whitespace-nowrap">
                    {item.label}
                    <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                  </button>
                  <div className="nav-dropdown absolute top-full left-0 w-52 bg-bg-secondary border border-border rounded-lg shadow-2xl py-2 z-50">
                    {NAV[item.key].map((link) => (
                      <Link
                        key={link}
                        href={siteRoute(link)}
                        className="block px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors"
                      >
                        {link}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-2 ml-auto shrink-0">
              <Link
                href="/help"
                className="p-2 text-text-tertiary hover:text-text-primary transition-colors flex items-center justify-center rounded-lg"
                aria-label="Help"
              >
                <Globe className="w-[18px] h-[18px]" />
              </Link>
              <Link href="/login">
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>

            <div className="flex items-center gap-1.5 ml-auto lg:hidden shrink-0">
              <Link href="/login" className="hidden xs:block">
                <Button variant="ghost" size="sm" className="!px-3 !text-xs">
                  Log In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="!px-3 sm:!px-5 !text-xs sm:!text-sm">
                  Sign Up
                </Button>
              </Link>
              <button
                type="button"
                className="p-2 text-text-secondary hover:text-text-primary cursor-pointer rounded-lg active:bg-bg-hover"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                aria-expanded={mobileOpen}
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Site menu">
          <button
            type="button"
            className="absolute inset-0 bg-black/60 mobile-nav-backdrop"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          />
          <div className="absolute right-0 top-0 h-full w-[min(320px,88vw)] bg-bg-secondary border-l border-border flex flex-col safe-area-top safe-area-bottom safe-area-x mobile-nav-drawer mobile-nav-drawer-right">
            <div className="flex items-center justify-between h-14 px-4 border-b border-border shrink-0">
              <span className="font-bold truncate">{BRAND.name}</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-2 -mr-1 text-text-tertiary hover:text-text-primary cursor-pointer rounded-lg active:bg-bg-hover"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto overscroll-contain">
              {NAV_ITEMS.map((item) => (
                <div key={item.key} className="mb-1">
                  <p className="px-3 py-2 text-[11px] text-text-tertiary uppercase tracking-wider">
                    {item.label}
                  </p>
                  {NAV[item.key].map((link) => (
                    <Link
                      key={link}
                      href={siteRoute(link)}
                      onClick={() => setMobileOpen(false)}
                      className="block px-3 py-3 text-[15px] text-text-secondary hover:text-text-primary active:bg-bg-hover rounded-lg"
                    >
                      {link}
                    </Link>
                  ))}
                </div>
              ))}
            </nav>
            <div className="p-4 border-t border-border space-y-2 shrink-0">
              <Link href="/login" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" className="w-full" size="md">Log In</Button>
              </Link>
              <Link href="/register" onClick={() => setMobileOpen(false)}>
                <Button className="w-full" size="md">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
