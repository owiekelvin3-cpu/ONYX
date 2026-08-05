import type { ReactNode } from "react";

export function AdminPageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-brand">Admin</p>
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary mt-1">{title}</h1>
        {subtitle && <p className="text-sm text-text-tertiary mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
