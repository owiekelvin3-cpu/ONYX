import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "bg-bg-secondary border border-border rounded-lg p-5",
        className
      )}
    >
      {children}
    </div>
  );
}
