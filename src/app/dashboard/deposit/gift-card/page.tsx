"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { GIFT_CARD_BRANDS } from "@/lib/deposit-options";
import { Card } from "@/components/ui/Card";
import { GiftCardBrandTile } from "@/components/dashboard/deposit/DepositMethodIcons";
import { ArrowLeft } from "@/components/icons";
import { cn } from "@/lib/utils";

export default function GiftCardDepositPage() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div>
        <Link
          href="/dashboard/deposit"
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-text-tertiary hover:text-brand"
        >
          <ArrowLeft className="h-4 w-4" />
          All deposit methods
        </Link>
        <h1 className="text-lg font-bold text-text-primary">{t("deposits.giftCardTitle")}</h1>
        <p className="mt-1 text-[13px] text-text-tertiary">{t("deposits.giftCardPageDesc")}</p>
      </div>

      <Card>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {GIFT_CARD_BRANDS.map((brand) => (
            <Link
              key={brand.id}
              href={`/dashboard/deposit/gift-card/${brand.id}`}
              className={cn(
                "rounded-xl border border-border bg-bg-primary p-4 text-center transition-colors",
                "hover:border-brand/30 hover:bg-bg-hover/40"
              )}
            >
              <GiftCardBrandTile brand={brand} />
              <span className="text-xs font-semibold text-text-primary">{brand.label}</span>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
