import React from "react";

interface ActivityItem {
  id: string;
  actor: string;
  action: string;
  timestamp: string;
  accent: string;
}

interface ActivityFeedProps {
  items: ActivityItem[];
}

export function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-sm shadow-slate-200/60 backdrop-blur-sm dark:border-slate-700/70 dark:bg-slate-900/60">
      <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-slate-100">Recent Activity</h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-3">
            <div className={`mt-2 h-2 w-2 rounded-full ${item.accent}`}></div>
            <div className="flex-1">
              <p className="text-slate-800 dark:text-slate-100">
                <span className="font-semibold">{item.actor}</span> {item.action}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{item.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
