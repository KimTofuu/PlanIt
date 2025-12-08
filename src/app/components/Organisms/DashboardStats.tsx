import React from "react";
import { StatCard } from "../Molecules/StatCard";

interface DashboardStatsProps {
  totalBoards: number;
  totalCards: number;
  trelloBoards: number;
}

export function DashboardStats({ totalBoards, totalCards, trelloBoards }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <StatCard
        title="Total Boards"
        value={totalBoards}
        description="Active collaborations across your workspace"
        icon={<i className="fa-solid fa-table-columns" aria-hidden="true"></i>}
        accent="from-[var(--brand-100)] to-[var(--secondary-90)]"
      />
      <StatCard
        title="Cards Tracked"
        value={totalCards}
        description="Tasks and deliverables currently monitored"
        icon={<i className="fa-solid fa-square-check" aria-hidden="true"></i>}
        accent="from-[var(--semantic-emerald)] to-[rgba(16,122,52,0.95)]"
      />
      <StatCard
        title="Trello Boards"
        value={trelloBoards}
        description="Connected spaces synced from Trello"
        icon={<i className="fa-brands fa-trello" aria-hidden="true"></i>}
        accent="from-[var(--brand-90)] to-[var(--secondary-100)]"
      />
    </div>
  );
}
