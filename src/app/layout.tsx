import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@/lib/fontawesome";
import { BRAND } from "@/lib/constants";
import { getAppUrl } from "@/lib/env";
import { I18nProvider } from "@/components/i18n/I18nProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ThemeScript } from "@/components/theme/ThemeScript";

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
    default: `${BRAND.fullName} | Track All Markets`,
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
    title: `${BRAND.fullName} | Track All Markets`,
    description: BRAND.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.fullName} | Track All Markets`,
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
  themeColor: "#131722",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} dark h-full overflow-x-hidden`} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-dvh antialiased overflow-x-hidden tv-theme">
        <ThemeProvider>
          <I18nProvider>{children}</I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
