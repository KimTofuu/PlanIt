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
    <section className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
      <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-3">
            <div className={`w-2 h-2 rounded-full ${item.accent} mt-2`}></div>
            <div className="flex-1">
              <p className="text-neutral-900 dark:text-neutral-100">
                <span className="font-semibold">{item.actor}</span> {item.action}
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">{item.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
