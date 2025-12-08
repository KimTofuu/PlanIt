import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  accent?: string;
  description?: string;
}

export function StatCard({
  title,
  value,
  icon,
  accent = "from-[var(--brand-90)] to-[var(--secondary-90)]",
  description,
}: StatCardProps) {
  return (
    <article className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-alt)] p-7 shadow-[var(--shadow)] transition-transform hover:-translate-y-1">
      <span className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${accent}`} aria-hidden="true"></span>
      <div className="relative flex items-start justify-between gap-6">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--foreground-muted)] opacity-80">
            {title}
          </p>
          <p className="text-4xl font-semibold text-[var(--foreground)]">
            {value}
          </p>
          {description && (
            <p className="max-w-xs text-sm leading-relaxed text-[var(--foreground-muted)]">
              {description}
            </p>
          )}
        </div>
        {icon && (
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-2xl text-white shadow-lg shadow-[rgba(15,23,42,0.18)]`}
            aria-hidden="true"
          >
            {icon}
          </div>
        )}
      </div>
    </article>
  );
}
