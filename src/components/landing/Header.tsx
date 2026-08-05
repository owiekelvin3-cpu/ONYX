"use client";

import Link from "next/link";
import { useState } from "react";
import { BRAND, NAV } from "@/lib/constants";
import { siteRoute } from "@/lib/routes";
import { Button } from "@/components/ui/Button";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { ChevronDown, Globe, Menu, X } from "lucide-react";

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
      <header className="sticky top-0 z-50 bg-bg-primary/95 backdrop-blur-md border-b border-border safe-area-top">
        <div className="container-app">
          <div className="flex items-center h-14 sm:h-16 gap-3 sm:gap-6">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <svg width="26" height="26" viewBox="0 0 28 28" fill="none" className="sm:w-7 sm:h-7">
                <rect width="28" height="28" rx="6" fill="#F0B90B" />
                <path d="M8 18L14 8L20 18H16.5L14 14.5L11.5 18H8Z" fill="#0B0E11" />
              </svg>
              <span className="text-base sm:text-lg font-bold tracking-tight text-text-primary">
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
                className="p-2 text-text-tertiary hover:text-text-primary transition-colors touch-target flex items-center justify-center"
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

            <div className="flex items-center gap-1 ml-auto lg:hidden shrink-0">
              <Link href="/register">
                <Button size="sm" className="!px-3 sm:!px-5 !text-xs sm:!text-sm">Sign Up</Button>
              </Link>
              <button
                className="p-2 text-text-secondary cursor-pointer touch-target"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-[min(320px,100vw)] bg-bg-secondary border-l border-border flex flex-col safe-area-top safe-area-bottom safe-area-x">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="font-bold">{BRAND.name}</span>
              <button onClick={() => setMobileOpen(false)} className="cursor-pointer touch-target p-1" aria-label="Close menu">
                <X className="w-5 h-5 text-text-tertiary" />
              </button>
            </div>
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto overscroll-contain">
              {NAV_ITEMS.map((item) => (
                <div key={item.key} className="mb-2">
                  <p className="px-3 py-2 text-[11px] text-text-tertiary uppercase tracking-wider">
                    {item.label}
                  </p>
                  {NAV[item.key].map((link) => (
                    <Link
                      key={link}
                      href={siteRoute(link)}
                      onClick={() => setMobileOpen(false)}
                      className="block px-3 py-3 text-sm text-text-secondary hover:text-text-primary active:bg-bg-hover rounded touch-target"
                    >
                      {link}
                    </Link>
                  ))}
                </div>
              ))}
            </nav>
            <div className="p-4 border-t border-border space-y-2">
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
