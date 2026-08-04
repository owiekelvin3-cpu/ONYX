"use client";

import { cn } from "@/lib/utils";
import { forwardRef, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { Eye, EyeOff, ChevronDown } from "lucide-react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  error?: string;
  showRequired?: boolean;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ className, label, icon, error, id, type, showRequired, required, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [focused, setFocused] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
      <div className="space-y-1.5">
        <label
          htmlFor={id}
          className="block text-[13px] font-medium text-text-secondary"
        >
          {label}
          {(showRequired ?? required) && (
            <span className="text-red ml-0.5" aria-hidden>
              *
            </span>
          )}
        </label>
        <div
          className={cn(
            "relative flex items-center rounded-md border bg-bg-secondary transition-all duration-200",
            focused
              ? "border-brand ring-2 ring-brand/20"
              : "border-border hover:border-border-light",
            error && "border-red ring-2 ring-red/15"
          )}
        >
          {icon && (
            <span className="pl-3.5 text-text-tertiary shrink-0 [&>svg]:w-[18px] [&>svg]:h-[18px]">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            type={inputType}
            onFocus={(e) => {
              setFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              props.onBlur?.(e);
            }}
            className={cn(
              "flex-1 min-w-0 h-[48px] bg-transparent text-[15px] text-text-primary placeholder:text-text-tertiary/60",
              "focus:outline-none",
              icon ? "pl-2.5 pr-3" : "px-3.5",
              isPassword && "pr-11",
              type === "date" && "pr-3 [color-scheme:dark] cursor-pointer",
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-0 h-full px-3.5 text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-[18px] h-[18px]" />
              ) : (
                <Eye className="w-[18px] h-[18px]" />
              )}
            </button>
          )}
        </div>
        {error && <p className="text-[12px] text-red pt-0.5">{error}</p>}
      </div>
    );
  }
);
AuthInput.displayName = "AuthInput";

interface AuthSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  showRequired?: boolean;
}

export const AuthSelect = forwardRef<HTMLSelectElement, AuthSelectProps>(
  ({ className, label, error, id, showRequired, required, children, ...props }, ref) => {
    const [focused, setFocused] = useState(false);

    return (
      <div className="space-y-1.5">
        <label
          htmlFor={id}
          className="block text-[13px] font-medium text-text-secondary"
        >
          {label}
          {(showRequired ?? required) && (
            <span className="text-red ml-0.5" aria-hidden>
              *
            </span>
          )}
        </label>
        <div
          className={cn(
            "relative flex items-center rounded-md border bg-bg-secondary transition-all duration-200",
            focused
              ? "border-brand ring-2 ring-brand/20"
              : "border-border hover:border-border-light",
            error && "border-red ring-2 ring-red/15"
          )}
        >
          <select
            ref={ref}
            id={id}
            required={required}
            onFocus={(e) => {
              setFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              props.onBlur?.(e);
            }}
            className={cn(
              "flex-1 min-w-0 h-[48px] bg-transparent text-[15px] text-text-primary pl-3.5 pr-10",
              "focus:outline-none appearance-none cursor-pointer",
              className
            )}
            {...props}
          >
            {children}
          </select>
          <ChevronDown className="absolute right-3.5 w-4 h-4 text-text-tertiary pointer-events-none" />
        </div>
        {error && <p className="text-[12px] text-red pt-0.5">{error}</p>}
      </div>
    );
  }
);
AuthSelect.displayName = "AuthSelect";

export function AuthTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex border-b border-border mb-8">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            "flex-1 pb-3 text-[15px] font-medium transition-colors relative cursor-pointer",
            active === tab.id
              ? "text-text-primary after:absolute after:bottom-0 after:inset-x-0 after:h-[2px] after:bg-brand"
              : "text-text-tertiary hover:text-text-secondary"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
