import type { MetadataRoute } from "next";
import { getAppUrl } from "@/lib/env";
import { SITE_PAGES } from "@/lib/routes";

/** Public pages only — no auth or dashboard routes */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = getAppUrl();
  const now = new Date();

  return [
    {
      url: base,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    ...Object.keys(SITE_PAGES).map((slug) => ({
      url: `${base}/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
