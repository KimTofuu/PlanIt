"use client";

import Link from "next/link";
import Button from "../Atoms/Buttons";
import ThemeToggle from "../Atoms/ThemeToggle";

interface DashboardHeaderProps {
  userName?: string;
  onLogout: () => Promise<void>;
  isLoggingOut: boolean;
}

export function DashboardHeader({ userName, onLogout, isLoggingOut }: DashboardHeaderProps) {
  const greeting = userName ? `Hello, ${userName}!` : "Hello there!";

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] shadow-[var(--shadow)] backdrop-blur-md transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-2xl font-semibold tracking-tight transition-opacity hover:opacity-85"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--brand-15)] text-xl text-[var(--brand-100)] transition-colors dark:bg-white/10 dark:text-white">
              <i className="fa-solid fa-layer-group" aria-hidden="true"></i>
            </span>
            <span>PlanIt</span>
          </Link>
          <nav className="hidden gap-6 text-sm font-medium md:flex">
            <Link
              href="/pages/dashboard"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-15)] px-4 py-2 text-[var(--brand-100)] shadow-sm transition-colors hover:bg-[var(--brand-30)]/70 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
            >
              <i className="fa-solid fa-chalkboard" aria-hidden="true"></i>
              Boards
            </Link>
          </nav>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3">
          <ThemeToggle className="inline-flex" />
          <Button
            onClick={onLogout}
            disabled={isLoggingOut}
            variant="secondary"
            size="sm"
            className="px-4 shadow-[0_16px_36px_-18px_rgba(26,90,131,0.55)] transition hover:-translate-y-[1px] hover:shadow-[0_20px_40px_-16px_rgba(26,90,131,0.6)] dark:bg-[var(--brand-100)] dark:hover:bg-[var(--brand-90)]"
          >
            {isLoggingOut ? (
              <>
                <i className="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
                Logging out...
              </>
            ) : (
              <>
                <i className="fa-solid fa-right-from-bracket" aria-hidden="true"></i>
                Log out
              </>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
