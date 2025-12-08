"use client";

import { useMemo } from "react";
import Button from "./Buttons";
import { useTheme } from "../../hooks/useTheme";

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme, isReady } = useTheme();

  const { icon, label } = useMemo(() => {
    if (!isReady) {
      return {
        icon: "fa-solid fa-circle-notch fa-spin",
        label: "Loading",
      } as const;
    }

    return theme === "dark"
      ? {
          icon: "fa-solid fa-moon",
          label: "Switch to light mode",
        }
      : {
          icon: "fa-regular fa-sun",
          label: "Switch to dark mode",
        };
  }, [isReady, theme]);

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      onClick={toggleTheme}
      disabled={!isReady}
      aria-pressed={theme === "dark"}
      aria-label={label}
      className={`gap-0 rounded-full px-3 py-2 shadow-[0_16px_36px_-18px_rgba(26,90,131,0.55)] transition-transform hover:-translate-y-[1px] hover:shadow-[0_20px_40px_-16px_rgba(26,90,131,0.62)] focus-visible:ring-4 focus-visible:ring-[rgba(71,181,255,0.35)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)] dark:bg-[var(--brand-100)] dark:hover:bg-[var(--brand-90)] dark:shadow-[0_18px_38px_-18px_rgba(15,23,42,0.85)] ${className}`}
    >
      <i className={`${icon} text-lg`} aria-hidden="true"></i>
      <span className="sr-only">{label}</span>
    </Button>
  );
}
