import React from "react";
import type { BoardCard } from "../../interface/board";

interface BoardCardItemProps {
  card: BoardCard;
}

export function BoardCardItem({ card }: BoardCardItemProps) {
  return (
    <div className="bg-white dark:bg-neutral-700 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <h3 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">{card.title}</h3>
      {card.description && (
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">{card.description}</p>
      )}
      <div className="flex items-center gap-2 flex-wrap mb-2">
        {card.labels.map((label) => (
          <span
            key={label}
            className="bg-neutral-200 dark:bg-neutral-600 text-neutral-800 dark:text-neutral-200 text-xs px-2 py-1 rounded-full"
          >
            {label}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between text-sm text-neutral-600 dark:text-neutral-400">
        {card.dueDate && (
          <div className="flex items-center gap-1">
            <span role="img" aria-label="calendar">
              📅
            </span>
            {card.dueDate}
          </div>
        )}
        <div className="flex items-center gap-2">
          <span>💬 {card.commentsCount ?? 0}</span>
          <span>📎 {card.attachmentsCount ?? 0}</span>
        </div>
      </div>
    </div>
  );
}
