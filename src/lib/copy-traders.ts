export type TraderAvatarKind = "anime" | "illustrated" | "gradient" | "pixel" | "emoji";

export type CopyTraderProfile = {
  name: string;
  handle: string;
  bio: string;
  roi: number;
  followers: number;
  winRate: number;
  rating: number;
  avatarKind: TraderAvatarKind;
  /** DiceBear seed or gradient key */
  avatarSeed: string;
  ringColor: string;
  verified?: boolean;
  badge?: string;
};

function dicebear(style: string, seed: string, background?: string) {
  const bg = background ? `&backgroundColor=${background}` : "";
  return `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(seed)}${bg}`;
}

export const COPY_TRADERS: CopyTraderProfile[] = [
  {
    name: "AlphaTrader",
    handle: "@alpha.fx",
    bio: "Momentum scalper · BTC & ETH focus",
    roi: 142.5,
    followers: 2840,
    winRate: 78,
    rating: 4.9,
    avatarKind: "illustrated",
    avatarSeed: "alpha-trader",
    ringColor: "#3b82f6",
    verified: true,
    badge: "Pro",
  },
  {
    name: "CryptoKing",
    handle: "@cryptoking",
    bio: "Altcoin swing setups · high conviction",
    roi: 98.3,
    followers: 5620,
    winRate: 72,
    rating: 4.8,
    avatarKind: "anime",
    avatarSeed: "crypto-king",
    ringColor: "#f97316",
    verified: true,
  },
  {
    name: "YukiTrade",
    handle: "@yuki.trades",
    bio: "Tokyo session · JPY pairs & SOL",
    roi: 118.2,
    followers: 3910,
    winRate: 74,
    rating: 4.9,
    avatarKind: "anime",
    avatarSeed: "yuki-trade",
    ringColor: "#ec4899",
    verified: true,
    badge: "VIP",
  },
  {
    name: "QuantMaster",
    handle: "@quant.master",
    bio: "Systematic models · risk-first",
    roi: 67.1,
    followers: 1890,
    winRate: 81,
    rating: 4.7,
    avatarKind: "illustrated",
    avatarSeed: "quant-master",
    ringColor: "#6366f1",
  },
  {
    name: "SwingPro",
    handle: "@swingpro",
    bio: "Multi-day holds · FX majors",
    roi: 54.8,
    followers: 3210,
    winRate: 69,
    rating: 4.6,
    avatarKind: "gradient",
    avatarSeed: "swing-pro",
    ringColor: "#14b8a6",
  },
  {
    name: "DeFiWhale",
    handle: "@defi.whale",
    bio: "On-chain flows · L2 narratives",
    roi: 203.2,
    followers: 8900,
    winRate: 65,
    rating: 4.9,
    avatarKind: "pixel",
    avatarSeed: "defi-whale",
    ringColor: "#8b5cf6",
    verified: true,
    badge: "Whale",
  },
  {
    name: "SteadyGains",
    handle: "@steady.gains",
    bio: "Low drawdown · compounding daily",
    roi: 38.4,
    followers: 1450,
    winRate: 85,
    rating: 4.5,
    avatarKind: "gradient",
    avatarSeed: "steady-gains",
    ringColor: "#22c55e",
  },
  {
    name: "NovaPulse",
    handle: "@nova.pulse",
    bio: "Breakout hunter · indices & gold",
    roi: 89.6,
    followers: 4720,
    winRate: 71,
    rating: 4.8,
    avatarKind: "emoji",
    avatarSeed: "nova-pulse",
    ringColor: "#eab308",
  },
  {
    name: "MoonRunner",
    handle: "@moon.runner",
    bio: "Anime chart reader · meme + majors",
    roi: 156.8,
    followers: 6240,
    winRate: 68,
    rating: 4.8,
    avatarKind: "anime",
    avatarSeed: "moon-runner",
    ringColor: "#a855f7",
    verified: true,
  },
  {
    name: "ZenScalp",
    handle: "@zen.scalp",
    bio: "1m–5m precision · tight stops",
    roi: 76.3,
    followers: 2580,
    winRate: 79,
    rating: 4.7,
    avatarKind: "illustrated",
    avatarSeed: "zen-scalp",
    ringColor: "#06b6d4",
  },
  {
    name: "GridLord",
    handle: "@grid.lord",
    bio: "Range bots · sideways markets",
    roi: 44.2,
    followers: 1120,
    winRate: 83,
    rating: 4.4,
    avatarKind: "pixel",
    avatarSeed: "grid-lord",
    ringColor: "#64748b",
  },
  {
    name: "WolfStreet",
    handle: "@wolf.street",
    bio: "US open volatility · SPX & NAS",
    roi: 91.4,
    followers: 5100,
    winRate: 70,
    rating: 4.7,
    avatarKind: "gradient",
    avatarSeed: "wolf-street",
    ringColor: "#ef4444",
    badge: "Hot",
  },
  {
    name: "LumiFX",
    handle: "@lumi.fx",
    bio: "London fix · EUR, GBP & oil crosses",
    roi: 112.7,
    followers: 4380,
    winRate: 76,
    rating: 4.8,
    avatarKind: "anime",
    avatarSeed: "lumi-fx",
    ringColor: "#0ea5e9",
    verified: true,
    badge: "Elite",
  },
  {
    name: "BlockSage",
    handle: "@block.sage",
    bio: "Macro cycles · gold, DXY & rates",
    roi: 63.9,
    followers: 2760,
    winRate: 82,
    rating: 4.6,
    avatarKind: "illustrated",
    avatarSeed: "block-sage",
    ringColor: "#ca8a04",
    verified: true,
  },
  {
    name: "PulseBot",
    handle: "@pulse.bot",
    bio: "Automated grids · 24/7 BTC pairs",
    roi: 47.5,
    followers: 1980,
    winRate: 88,
    rating: 4.5,
    avatarKind: "pixel",
    avatarSeed: "pulse-bot",
    ringColor: "#10b981",
    badge: "Bot",
  },
  {
    name: "ChartNinja",
    handle: "@chart.ninja",
    bio: "Price action · support & resistance",
    roi: 134.1,
    followers: 7150,
    winRate: 73,
    rating: 4.9,
    avatarKind: "emoji",
    avatarSeed: "chart-ninja",
    ringColor: "#f43f5e",
    verified: true,
    badge: "Top",
  },
  {
    name: "VaultEdge",
    handle: "@vault.edge",
    bio: "Capital preservation · slow compounding",
    roi: 29.8,
    followers: 980,
    winRate: 91,
    rating: 4.4,
    avatarKind: "gradient",
    avatarSeed: "vault-edge",
    ringColor: "#475569",
  },
];

export function traderAvatarUrl(trader: CopyTraderProfile): string {
  switch (trader.avatarKind) {
    case "anime":
      return dicebear("adventurer", trader.avatarSeed, "ffd5dc,ffdfbf,c0aede");
    case "illustrated":
      return dicebear("lorelei", trader.avatarSeed, "b6e3f4,c0aede,d1d4f9");
    case "pixel":
      return dicebear("pixel-art", trader.avatarSeed, "fef3c7,d1fae5,e0e7ff");
    case "emoji":
      return dicebear("fun-emoji", trader.avatarSeed, "ffedd5,fecdd3,e9d5ff");
    case "gradient":
    default:
      return dicebear("notionists", trader.avatarSeed, "e2e8f0,f1f5f9,e0f2fe");
  }
}

export function traderInitials(name: string) {
  return name
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function gradientForSeed(seed: string): [string, string] {
  const palettes: [string, string][] = [
    ["#6366f1", "#a855f7"],
    ["#0ea5e9", "#22d3ee"],
    ["#f97316", "#ef4444"],
    ["#22c55e", "#14b8a6"],
    ["#ec4899", "#f43f5e"],
    ["#eab308", "#f97316"],
  ];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash + seed.charCodeAt(i) * (i + 1)) % palettes.length;
  return palettes[hash] ?? palettes[0];
}
