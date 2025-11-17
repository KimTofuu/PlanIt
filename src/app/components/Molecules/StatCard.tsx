import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  accent?: string;
}

export function StatCard({ title, value, icon, accent = "bg-blue-500" }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6 border border-neutral-200 dark:border-neutral-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">{value}</p>
        </div>
        <div className={`text-4xl flex items-center justify-center w-12 h-12 rounded-full text-white ${accent}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
