"use client";

import { DEPOSIT_CRYPTO_KEYS, DEPOSIT_CRYPTO_LABELS, GIFT_CARD_BRANDS } from "@/lib/deposit-options";
import { CryptoIcon } from "@/components/crypto/CryptoIcon";
import { cn } from "@/lib/utils";

export function CryptoDepositPreview({ size = "md" }: { size?: "md" | "lg" }) {
  const keys = DEPOSIT_CRYPTO_KEYS.slice(0, 6);
  const iconSize = size === "lg" ? "md" : "sm";

  return (
    <div className={cn("grid shrink-0 gap-1.5", size === "lg" ? "grid-cols-3 w-[88px]" : "grid-cols-3 w-[72px]")}>
      {keys.map((key) => (
        <CryptoIcon key={key} symbol={key} label={DEPOSIT_CRYPTO_LABELS[key]} size={iconSize} />
      ))}
    </div>
  );
}

export function GiftCardDepositPreview({ size = "md" }: { size?: "md" | "lg" }) {
  const brands = GIFT_CARD_BRANDS.slice(0, 6);
  const tile = size === "lg" ? "h-7 w-7" : "h-6 w-6";

  return (
    <div className={cn("grid shrink-0 grid-cols-3 gap-1.5", size === "lg" ? "w-[88px]" : "w-[72px]")}>
      {brands.map((brand) => (
        <span
          key={brand.id}
          className={cn("flex items-center justify-center rounded-lg", tile)}
          style={{ backgroundColor: brand.color }}
        >
          <img src={brand.iconUrl} alt="" className="h-3.5 w-3.5 object-contain" loading="lazy" />
        </span>
      ))}
    </div>
  );
}

export function GiftCardBrandTile({ brand }: { brand: (typeof GIFT_CARD_BRANDS)[number] }) {
  return (
    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: brand.color }}>
      <img src={brand.iconUrl} alt="" className="h-6 w-6 object-contain" loading="lazy" />
    </div>
  );
}
