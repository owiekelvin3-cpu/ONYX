import { MarketingPageShell } from "@/components/marketing/MarketingPageShell";
import { MemeCoinDailyFeed } from "@/components/meme-coins/MemeCoinDailyFeed";
import { getMemeCoinsForDate, getRecentMemeCoinDates } from "@/lib/meme-coins/queries";
import { utcToday } from "@/lib/meme-coins/sync";

export const metadata = {
  title: "Meme Coin Daily",
  description: "Daily live trending meme coins — refreshed every day from market data.",
};

type PageProps = {
  searchParams: Promise<{ date?: string }>;
};

export default async function MemeCoinsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const listDate = params.date ?? utcToday();
  const [coins, recentDates] = await Promise.all([
    getMemeCoinsForDate(listDate),
    getRecentMemeCoinDates(),
  ]);

  return (
    <MarketingPageShell
      title="Meme Coin Daily"
      subtitle="Ten fresh live meme coin picks every day — trending imports from CoinGecko plus daily market listings."
      ctaHref="/register"
      ctaLabel="Join ONYX Exchange"
    >
      <MemeCoinDailyFeed coins={coins} listDate={listDate} recentDates={recentDates} />
    </MarketingPageShell>
  );
}
