import Link from "next/link";
import { PRODUCTS } from "@/lib/constants";
import { ArrowRight } from "lucide-react";

export function ProductShowcase() {
  return (
    <section className="bg-bg-primary py-12 sm:py-16 lg:py-20">
      <div className="container-app">
        <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-2 text-balance">
          One Platform. Every Market.
        </h2>
        <p className="text-sm text-text-tertiary mb-8 sm:mb-10 max-w-lg">
          From spot trading to AI bots — everything you need to trade like the pros.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {PRODUCTS.map((product) => (
            <Link
              key={product.title}
              href={product.href}
              className="group bg-bg-secondary border border-border rounded-lg p-4 sm:p-6 hover:border-border-light active:bg-bg-hover transition-colors touch-target block"
            >
              <h3 className="text-base font-semibold text-text-primary group-hover:text-brand transition-colors">
                {product.title}
              </h3>
              <p className="text-sm text-text-tertiary mt-2 leading-relaxed">{product.desc}</p>
              <span className="inline-flex items-center gap-1 text-sm text-brand mt-3 sm:mt-4 font-medium">
                {product.cta}
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
