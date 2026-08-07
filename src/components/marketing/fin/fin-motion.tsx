"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

export function useFinCountUp(
  target: number,
  { duration = 1.3, decimals = 0 }: { duration?: number; decimals?: number } = {}
) {
  const reduce = useReducedMotion();
  const [value, setValue] = useState(reduce ? target : 0);

  useEffect(() => {
    if (reduce) {
      setValue(target);
      return;
    }
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(target * eased);
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, reduce]);

  if (decimals > 0) return value.toFixed(decimals);
  return Math.round(value).toLocaleString();
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};

export function FinStagger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} variants={container} initial="hidden" animate="show">
      {children}
    </motion.div>
  );
}

export function FinStaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  );
}

export function FinBar({
  height,
  delay = 0,
  className,
}: {
  height: number;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { height: 0 }}
      animate={{ height: `${height}%` }}
      transition={{ duration: 0.75, delay, ease }}
    />
  );
}

export function FinProgressSegments({
  segments,
}: {
  segments: { value: number; color: string }[];
}) {
  const reduce = useReducedMotion();
  return (
    <div className="flex h-2 overflow-hidden rounded-full bg-[#ECEEF2]">
      {segments.map((seg, i) => (
        <motion.div
          key={i}
          className="h-full"
          style={{ backgroundColor: seg.color }}
          initial={reduce ? false : { width: 0 }}
          animate={{ width: `${seg.value}%` }}
          transition={{ duration: 0.9, delay: 0.15 + i * 0.08, ease }}
        />
      ))}
    </div>
  );
}
