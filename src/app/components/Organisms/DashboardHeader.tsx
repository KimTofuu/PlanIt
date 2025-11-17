"use client";

import Link from "next/link";
import Button from "../Atoms/Buttons";

interface DashboardHeaderProps {
  userName?: string;
  onLogout: () => Promise<void>;
  isLoggingOut: boolean;
}

export function DashboardHeader({ userName, onLogout, isLoggingOut }: DashboardHeaderProps) {
  return (
    <header className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            PlanIt
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/pages/dashboard" className="text-neutral-900 dark:text-neutral-100 font-medium">
              Boards
            </Link>
            <Link
              href="/pages/dashboard/templates"
              className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              Templates
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
            <span className="text-sm">{userName ? `Hi, ${userName}` : "Hello"}</span>
          </div>
          <Button
            onClick={onLogout}
            disabled={isLoggingOut}
            variant="outline"
            size="sm"
            className="px-3"
          >
            {isLoggingOut ? "Logging out..." : "Log Out"}
          </Button>
        </div>
      </div>
    </header>
  );
}
