import React from "react";
import { StatCard } from "../Molecules/StatCard";

interface DashboardStatsProps {
  totalBoards: number;
  totalCards: number;
  recentActivityCount: number;
}

export function DashboardStats({ totalBoards, totalCards, recentActivityCount }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard title="Total Boards" value={totalBoards} icon={<span>📋</span>} accent="bg-blue-500" />
      <StatCard title="Cards Tracked" value={totalCards} icon={<span>✅</span>} accent="bg-green-500" />
      <StatCard title="Recent Updates" value={recentActivityCount} icon={<span>🎯</span>} accent="bg-purple-500" />
    </div>
  );
}
