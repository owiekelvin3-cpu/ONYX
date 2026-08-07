import Link from "next/link";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { SITE_PAGES } from "@/lib/routes";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return Object.keys(SITE_PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = SITE_PAGES[slug];
  if (!page) return { title: "Not Found" };
  return { title: `${page.title} | ONYX`, description: page.description };
}

export default async function SitePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = SITE_PAGES[slug];
  if (!page) notFound();

  return (
    <>
      <MarketingHeader />
      <main className="min-h-[60vh] bg-bg-primary">
        <div className="container-app py-8 sm:py-10 lg:py-12 max-w-3xl safe-area-x">
          <Link
            href="/"
            className="text-[13px] text-brand hover:underline mb-6 inline-block"
          >
            ← Back to home
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
            {page.title}
          </h1>
          <p className="text-sm text-text-tertiary mt-2">{page.description}</p>
          <div className="mt-8 space-y-4">
            {page.content.map((paragraph, i) => (
              <p
                key={i}
                className="text-[14px] sm:text-[15px] text-text-secondary leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/register"
              className="inline-flex h-10 px-5 items-center bg-brand text-brand-text text-sm font-semibold rounded hover:bg-brand-hover transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/help"
              className="inline-flex h-10 px-5 items-center border border-border text-sm text-text-primary rounded hover:bg-bg-hover transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </main>
      <MarketingFooter />
    </>
  );
}
