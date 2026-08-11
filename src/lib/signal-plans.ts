export type SignalTier = "starter" | "professional" | "elite" | "institutional";

export type SignalPlan = {
  id: SignalTier;
  name: string;
  price: number;
  days: number;
  description: string;
  features: string[];
  highlighted?: boolean;
};

export const SIGNAL_PLANS: SignalPlan[] = [
  {
    id: "starter",
    name: "Starter Signals",
    price: 500,
    days: 30,
    description: "Core FX and crypto desk setups with defined entry, target, and stop.",
    features: [
      "Daily starter desk alerts",
      "Basic tier signal feed",
      "In-app notifications",
      "30-day access",
    ],
  },
  {
    id: "professional",
    name: "Professional Signals",
    price: 1000,
    days: 30,
    description: "Expanded coverage including indices, metals, and higher-confidence setups.",
    features: [
      "Pro desk + starter feed",
      "Up to 15 ideas per week",
      "Priority in-app alerts",
      "30-day access",
    ],
    highlighted: true,
  },
  {
    id: "elite",
    name: "Elite Signals",
    price: 2500,
    days: 30,
    description: "VIP desk access with advanced setups and faster publication window.",
    features: [
      "Elite + pro desk access",
      "VIP-tier live signals",
      "Support ticket priority",
      "30-day access",
    ],
  },
  {
    id: "institutional",
    name: "Institutional Desk",
    price: 5000,
    days: 30,
    description: "Full desk coverage including institutional-only ideas and concierge support.",
    features: [
      "All desk tiers unlocked",
      "Institutional-only setups",
      "Dedicated desk concierge",
      "30-day access",
    ],
  },
];

/** Legacy tier ids still stored on older rows or admin desk publishes. */
const LEGACY_TIER_RANK: Record<string, number> = {
  basic: 1,
  starter: 1,
  pro: 2,
  professional: 2,
  vip: 3,
  elite: 3,
  institutional: 4,
};

export function signalTierRank(tier: string | null | undefined): number {
  if (!tier) return 0;
  return LEGACY_TIER_RANK[tier.toLowerCase()] ?? 0;
}

export function signalPlanById(id: string) {
  return SIGNAL_PLANS.find((p) => p.id === id);
}

export function signalTierLabel(tier: string) {
  const plan = SIGNAL_PLANS.find((p) => p.id === tier);
  if (plan) return plan.name.replace(" Signals", "").replace(" Desk", "");
  if (tier === "vip") return "VIP";
  if (tier === "pro") return "Pro";
  if (tier === "basic") return "Basic";
  return tier;
}

export function userTierRankFromPackages(
  packages: Array<{ package_id?: string | null; status: string; expires_at?: string | null }>
): number {
  const now = Date.now();
  const active = packages.filter(
    (p) =>
      p.status === "active" &&
      (!p.expires_at || new Date(p.expires_at).getTime() > now)
  );
  if (active.length === 0) return 0;
  return Math.max(...active.map((p) => signalTierRank(p.package_id)));
}
