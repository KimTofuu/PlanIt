import React from "react";
import type { BoardCard } from "../../interface/board";

interface BoardCardItemProps {
  card: BoardCard;
}

export function BoardCardItem({ card }: BoardCardItemProps) {
  return (
    <div className="cursor-pointer rounded-2xl border border-[var(--secondary-15)] bg-white p-5 shadow-[0_15px_30px_-20px_rgba(17,24,39,0.45)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_25px_45px_-25px_rgba(17,24,39,0.5)] dark:border-[rgba(255,255,255,0.08)] dark:bg-slate-900/80">
      <h3 className="mb-2 font-semibold text-[var(--neutral-charcoal)] dark:text-slate-100">{card.title}</h3>
      {card.description && (
        <p className="mb-3 text-sm leading-relaxed text-[var(--secondary-90)] dark:text-slate-300">{card.description}</p>
      )}
      <div className="flex items-center gap-2 flex-wrap mb-2">
        {card.labels.map((label) => (
          <span
            key={label}
            className="rounded-full bg-[var(--brand-15)] px-2.5 py-1 text-xs font-medium text-secondary-primary dark:bg-[rgba(255,255,255,0.08)] dark:text-[var(--brand-15)]"
          >
            {label}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between text-sm text-[var(--secondary-75)] dark:text-slate-300">
        {card.dueDate && (
          <div className="flex items-center gap-2">
            <i className="fa-regular fa-calendar-days text-slate-400" aria-hidden="true"></i>
            <span className="font-medium text-[var(--secondary-100)] dark:text-slate-200">{card.dueDate}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1">
            <i className="fa-regular fa-comments" aria-hidden="true"></i>
            {card.commentsCount ?? 0}
          </span>
          <span className="inline-flex items-center gap-1">
            <i className="fa-solid fa-paperclip" aria-hidden="true"></i>
            {card.attachmentsCount ?? 0}
          </span>
        </div>
      </div>
    </div>
  );
}
