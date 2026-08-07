import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "@/components/icons";

export function MarketingPageShell({
  title,
  subtitle,
  children,
  ctaHref = "/register",
  ctaLabel = "Get started for free",
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <>
      <section className="border-b border-border bg-bg-primary tv-page-hero">
        <div className="container-app py-12 sm:py-16 lg:py-20">
          <h1 className="text-[28px] sm:text-[36px] lg:text-[42px] font-bold text-text-primary leading-tight max-w-3xl">
            {title}
          </h1>
          <p className="mt-4 text-[15px] sm:text-[16px] text-text-secondary leading-relaxed max-w-2xl">
            {subtitle}
          </p>
          <Link href={ctaHref} className="inline-block mt-8">
            <Button size="lg" className="h-11 px-6 rounded-lg">
              {ctaLabel}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
      <div className="bg-bg-primary">{children}</div>
    </>
  );
}
