"use client";

import type { ChartPoint } from "@/lib/chart-data";
import { buildPortfolioChartData } from "@/lib/chart-data";
import { formatCurrency } from "@/lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function PortfolioChart({
  balance,
  chartData,
  compact,
}: {
  balance: number;
  chartData?: ChartPoint[];
  compact?: boolean;
}) {
  const data = chartData ?? buildPortfolioChartData(balance);

  return (
    <div>
      {!compact && (
        <>
          <p className="text-xs text-text-tertiary">Estimated Balance</p>
          <p className="text-2xl font-bold text-text-primary mt-1 font-mono tabular-nums">
            {formatCurrency(balance)}
          </p>
        </>
      )}
      <div className={compact ? "h-40 sm:h-44" : "h-44 xs:h-48 sm:h-56 mt-4"}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="portfolioFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F0B90B" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#F0B90B" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#848E9C", fontSize: 10 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#848E9C", fontSize: 10 }}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              width={42}
            />
            <Tooltip
              contentStyle={{
                background: "#1E2329",
                border: "1px solid #2B3139",
                borderRadius: "8px",
                fontSize: "12px",
                color: "#EAECEF",
              }}
              formatter={(value) => [formatCurrency(Number(value)), "Value"]}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#F0B90B"
              strokeWidth={2}
              fill="url(#portfolioFill)"
              activeDot={{ r: 4, fill: "#F0B90B", stroke: "#0B0E11", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
