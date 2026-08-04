import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "brand" | "outline" | "ghost" | "secondary";
  size?: "sm" | "md" | "lg";
}

const variants = {
  brand:
    "bg-brand text-brand-text font-semibold hover:bg-brand-hover active:scale-[0.98]",
  outline:
    "border border-border-light text-text-primary hover:border-text-tertiary hover:bg-bg-hover",
  ghost: "text-text-secondary hover:text-text-primary hover:bg-bg-hover",
  secondary:
    "bg-bg-tertiary text-text-primary hover:bg-bg-hover border border-border",
};

const sizes = {
  sm: "h-8 px-4 text-xs rounded",
  md: "h-10 px-5 text-sm rounded",
  lg: "h-12 px-8 text-sm rounded",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "brand", size = "md", children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);
Button.displayName = "Button";
