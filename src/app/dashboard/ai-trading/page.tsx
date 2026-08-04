"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  getAiSubscriptions,
  subscribeToAiBot,
} from "@/lib/api/subscriptions";
import type { AiSubscriptionRow } from "@/lib/supabase/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Bot, TrendingUp, Zap, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const PLANS = [
  {
    name: "Starter Bot",
    price: 99,
    features: ["5 trades/day", "Basic signals", "Email alerts"],
    icon: Bot,
  },
  {
    name: "Pro Bot",
    price: 299,
    features: ["Unlimited trades", "Advanced AI", "Priority execution"],
    icon: Zap,
    popular: true,
  },
  {
    name: "Elite Bot",
    price: 999,
    features: ["Custom strategies", "Dedicated AI", "24/7 monitoring"],
    icon: TrendingUp,
  },
];

export default function AiTradingPage() {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<AiSubscriptionRow[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      setUserId(user.id);
      const rows = await getAiSubscriptions(supabase, user.id);
      setSubscriptions(rows);
    });
  }, []);

  async function handleSubscribe(planName: string, price: number) {
    setError("");

    if (!userId) {
      router.push("/register");
      return;
    }

    setLoadingPlan(planName);
    try {
      const supabase = createClient();
      const row = await subscribeToAiBot(supabase, {
        userId,
        botName: planName,
        price,
      });
      setSubscriptions((prev) => [row, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Subscription failed");
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-text-primary">AI Trading</h1>

      {error && (
        <p role="alert" className="text-[13px] text-red bg-red/10 border border-red/30 rounded px-3 py-2">
          {error}
        </p>
      )}

      {subscriptions.length > 0 && (
        <Card>
          <h3 className="text-[13px] font-semibold mb-3">Active Bots</h3>
          {subscriptions.map((sub) => (
            <div
              key={sub.id}
              className="flex items-center justify-between py-2 border-b border-border last:border-0"
            >
              <div>
                <p className="text-[13px] font-medium">{sub.bot_name}</p>
                <p className="text-[11px] text-text-tertiary capitalize">
                  {sub.status} · {formatCurrency(sub.allocation)} allocated
                </p>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-green/10 text-green capitalize">
                {sub.status}
              </span>
            </div>
          ))}
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-3">
        {PLANS.map((plan) => {
          const Icon = plan.icon;
          return (
            <Card
              key={plan.name}
              className={plan.popular ? "border-brand/40" : ""}
            >
              {plan.popular && (
                <span className="text-[10px] px-2 py-0.5 bg-brand/15 text-brand rounded font-medium">
                  Popular
                </span>
              )}
              <Icon className="w-6 h-6 text-brand mt-3" />
              <h3 className="text-sm font-bold mt-2">{plan.name}</h3>
              <p className="text-xl font-bold mt-1">
                {formatCurrency(plan.price)}
                <span className="text-[11px] text-text-tertiary font-normal">
                  /mo
                </span>
              </p>
              <ul className="mt-3 space-y-1.5">
                {plan.features.map((f) => (
                  <li key={f} className="text-[12px] text-text-tertiary">
                    {f}
                  </li>
                ))}
              </ul>
              {userId ? (
                <Button
                  type="button"
                  className="w-full mt-4"
                  variant={plan.popular ? "brand" : "secondary"}
                  size="sm"
                  disabled={loadingPlan === plan.name}
                  onClick={() => handleSubscribe(plan.name, plan.price)}
                >
                  {loadingPlan === plan.name ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              ) : (
                <Link href="/register">
                  <Button
                    className="w-full mt-4"
                    variant={plan.popular ? "brand" : "secondary"}
                    size="sm"
                  >
                    Subscribe
                  </Button>
                </Link>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
