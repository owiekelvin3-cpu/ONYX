import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@/lib/fontawesome";
import { BRAND } from "@/lib/constants";
import { getAppUrl } from "@/lib/env";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const appUrl = getAppUrl();

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: `${BRAND.fullName} | ${BRAND.tagline}`,
    template: `%s | ${BRAND.name}`,
  },
  description: BRAND.description,
  applicationName: BRAND.fullName,
  keywords: [
    "crypto exchange",
    "bitcoin trading",
    "spot trading",
    "copy trading",
    "AI trading",
    BRAND.name,
  ],
  authors: [{ name: BRAND.fullName }],
  creator: BRAND.fullName,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: appUrl,
    siteName: BRAND.fullName,
    title: `${BRAND.fullName} | ${BRAND.tagline}`,
    description: BRAND.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.fullName} | ${BRAND.tagline}`,
    description: BRAND.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: appUrl,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#0b0e11",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full overflow-x-hidden`}>
      <body className="min-h-dvh antialiased overflow-x-hidden">{children}</body>
    </html>
  );
}
