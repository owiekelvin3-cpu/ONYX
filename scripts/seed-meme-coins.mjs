/**
 * Seed today's meme coin market (run once or when empty).
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local
 *
 * Usage: npm run seed-meme-coins
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function loadEnvLocal() {
  const envPath = resolve(root, ".env.local");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const PREFIXES = ["Moon", "Pepe", "Doge", "Chad", "Bonk", "Turbo", "Mega", "Frog", "Neon", "Sigma"];
const SUFFIXES = ["Coin", "Inu", "Rocket", "Moon", "Pump", "Gem", "Ape", "Fi", "Max", "X"];
const MEME_KEYWORD =
  /meme|pepe|doge|shib|inu|bonk|wif|frog|cat|moon|ape|floki|trump|elon|wojak|chad|based|pump|degen/i;

function utcToday() {
  return new Date().toISOString().slice(0, 10);
}

function slugify(name, symbol) {
  return `${name}-${symbol}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function generateOnyx(listDate, sortOrder, usedSlugs) {
  let name = "";
  let symbol = "";
  let slug = "";
  for (let i = 0; i < 24; i++) {
    name = `${pick(PREFIXES)}${pick(SUFFIXES)}`;
    symbol = name.replace(/[^a-zA-Z]/g, "").slice(0, 5).toUpperCase() || "MEME";
    slug = slugify(name, symbol);
    if (!usedSlugs.has(slug)) break;
  }
  usedSlugs.add(slug);
  const price = randomBetween(0.000002, 0.42);
  const change = randomBetween(-35, 180);
  return {
    list_date: listDate,
    symbol,
    name,
    slug,
    source: "onyx_generated",
    coingecko_id: null,
    price_usd: Number(price.toFixed(8)),
    change_24h: Number(change.toFixed(2)),
    market_cap_usd: Number((price * randomBetween(8_000_000, 900_000_000)).toFixed(2)),
    image_url: `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(slug)}&backgroundColor=84cc16,22c55e,065f46`,
    description: "Daily ONYX-generated meme coin for the user meme wallet.",
    tags: ["meme", "onyx-generated"],
    featured: false,
    status: "active",
    sort_order: sortOrder,
  };
}

async function fetchTrending() {
  const headers = {};
  if (process.env.COINGECKO_API_KEY) headers["x-cg-demo-api-key"] = process.env.COINGECKO_API_KEY;
  const res = await fetch("https://api.coingecko.com/api/v3/search/trending", { headers });
  if (!res.ok) return [];
  const json = await res.json();
  return (json.coins ?? [])
    .map((row) => row.item)
    .filter(Boolean)
    .map((item) => ({
      id: item.id,
      name: item.name,
      symbol: item.symbol?.toUpperCase(),
      thumb: item.thumb,
      price: typeof item.data?.price === "number" ? item.data.price : Number(item.data?.price),
      change24h: Number(item.data?.price_change_percentage_24h?.usd),
      marketCap: item.data?.market_cap ? Number(item.data.market_cap) : null,
    }));
}

async function fetchMemeMarkets() {
  const headers = {};
  if (process.env.COINGECKO_API_KEY) headers["x-cg-demo-api-key"] = process.env.COINGECKO_API_KEY;
  const u = new URL("https://api.coingecko.com/api/v3/coins/markets");
  u.searchParams.set("vs_currency", "usd");
  u.searchParams.set("category", "meme-token");
  u.searchParams.set("order", "market_cap_desc");
  u.searchParams.set("per_page", "50");
  u.searchParams.set("sparkline", "false");
  u.searchParams.set("price_change_percentage", "24h");
  const res = await fetch(u.toString(), { headers });
  if (!res.ok) return [];
  return res.json();
}

function isMemeLike(name, symbol) {
  return MEME_KEYWORD.test(`${name} ${symbol}`);
}

async function main() {
  const listDate = utcToday();
  console.log("Seeding meme coins for", listDate);

  const { data: existing } = await supabase
    .from("daily_meme_coins")
    .select("slug")
    .eq("list_date", listDate)
    .eq("status", "active");

  const usedSlugs = new Set((existing ?? []).map((r) => r.slug));
  let sortOrder = usedSlugs.size;
  const toInsert = [];

  const [trending, memeMarkets] = await Promise.all([fetchTrending(), fetchMemeMarkets()]);
  const byId = new Map();

  for (const coin of trending) {
    if (!coin?.id || !isMemeLike(coin.name, coin.symbol)) continue;
    if (byId.has(coin.id)) continue;
    byId.set(coin.id, coin);
  }
  for (const coin of memeMarkets) {
    if (!coin?.id || byId.has(coin.id)) continue;
    byId.set(coin.id, coin);
  }
  for (const coin of trending) {
    if (!coin?.id || byId.has(coin.id)) continue;
    byId.set(coin.id, coin);
  }

  for (const coin of byId.values()) {
    if (toInsert.filter((r) => r.source === "trending").length >= 7) break;
    const slug = slugify(coin.name, (coin.symbol || "").toUpperCase());
    if (usedSlugs.has(slug)) continue;
    usedSlugs.add(slug);
    toInsert.push({
      list_date: listDate,
      symbol: (coin.symbol || "MEME").toUpperCase(),
      name: coin.name,
      slug,
      source: "trending",
      coingecko_id: coin.id,
      price_usd: coin.current_price ?? coin.price ?? null,
      change_24h: coin.price_change_percentage_24h ?? coin.change24h ?? null,
      market_cap_usd: coin.market_cap ?? coin.marketCap ?? null,
      image_url: coin.image ?? coin.thumb ?? null,
      description: "Live trending meme coin from CoinGecko.",
      tags: ["meme", "trending", "live"],
      featured: false,
      status: "active",
      sort_order: sortOrder++,
    });
  }

  const onyxNeeded = Math.max(10 - (existing?.length ?? 0) - toInsert.length, 0);
  for (let i = 0; i < onyxNeeded; i++) {
    toInsert.push(generateOnyx(listDate, sortOrder++, usedSlugs));
  }

  if (toInsert.length === 0) {
    console.log("Nothing to insert — market may already be full.");
    return;
  }

  const { error } = await supabase.from("daily_meme_coins").upsert(toInsert, {
    onConflict: "list_date,slug",
  });

  if (error) {
    console.error("Insert failed:", error.message);
    process.exit(1);
  }

  console.log(`Inserted ${toInsert.length} coins (${toInsert.filter((c) => c.source === "trending").length} trending, ${toInsert.filter((c) => c.source === "onyx_generated").length} ONYX).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
