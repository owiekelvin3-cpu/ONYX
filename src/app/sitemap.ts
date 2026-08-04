import type { MetadataRoute } from "next";
import { getAppUrl } from "@/lib/env";
import { SITE_PAGES } from "@/lib/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getAppUrl();
  const now = new Date();

  const staticRoutes = [
    "",
    "/login",
    "/register",
    "/dashboard",
    "/dashboard/trade",
    "/dashboard/portfolio",
    "/dashboard/deposit",
    "/dashboard/withdraw",
    "/dashboard/ai-trading",
    "/dashboard/copy-trading",
    "/dashboard/settings",
  ];

  return [
    ...staticRoutes.map((path) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency: path === "" ? ("daily" as const) : ("weekly" as const),
      priority: path === "" ? 1 : path.startsWith("/dashboard") ? 0.7 : 0.8,
    })),
    ...Object.keys(SITE_PAGES).map((slug) => ({
      url: `${base}/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
