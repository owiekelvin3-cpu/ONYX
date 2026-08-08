export type SignalTier = "basic" | "pro" | "vip";

export type SignalPlan = {
  id: SignalTier;
  name: string;
  price: number;
  days: number;
  description: string;
  features: string[];
};

export const SIGNAL_PLANS: SignalPlan[] = [
  {
    id: "basic",
    name: "Basic Signals",
    price: 49,
    days: 30,
    description: "Daily FX and crypto setups with defined risk.",
    features: ["Basic desk signals", "Email-style alerts in-app", "30-day access"],
  },
  {
    id: "pro",
    name: "Pro Signals",
    price: 99,
    days: 30,
    description: "Expanded desk including metals, indices, and ETH setups.",
    features: ["Pro desk signals", "Higher-confidence setups", "30-day access"],
  },
  {
    id: "vip",
    name: "VIP Desk",
    price: 199,
    days: 30,
    description: "Institutional-grade ideas with priority desk coverage.",
    features: ["VIP desk signals", "All pro coverage", "30-day access"],
  },
];

export function signalPlanById(id: string) {
  return SIGNAL_PLANS.find((p) => p.id === id);
}

export function signalTierLabel(tier: string) {
  if (tier === "vip") return "VIP";
  if (tier === "pro") return "Pro";
  return "Basic";
}
