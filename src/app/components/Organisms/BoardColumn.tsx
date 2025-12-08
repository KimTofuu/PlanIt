import React from "react";
import Button from "../Atoms/Buttons";
import { BoardCardItem } from "../Molecules/BoardCardItem";
import type { BoardList } from "../../interface/board";

interface BoardColumnProps {
  list: BoardList;
}

export function BoardColumn({ list }: BoardColumnProps) {
  return (
      <div className="flex-shrink-0 w-80">
      <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 shadow-sm backdrop-blur-sm dark:border-slate-700/70 dark:bg-slate-900/50">
        <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-[var(--neutral-charcoal)] dark:text-[var(--brand-15)]">
              {list.name}
              <span className="ml-2 text-xs font-medium text-[var(--secondary-75)] dark:text-slate-300">
                {list.cards.length}
              </span>
            </h2>
          <button
            className="text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
            aria-label="Column options"
          >
            <i className="fa-solid fa-ellipsis" aria-hidden="true"></i>
          </button>
        </div>

        <div className="mb-3 min-h-[20px] space-y-3">
          {list.cards.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300/70 bg-white/60 p-4 text-sm italic text-slate-500 dark:border-slate-600/70 dark:bg-slate-900/40 dark:text-slate-400">
              No cards yet
            </div>
          ) : (
            list.cards.map((card) => <BoardCardItem key={card.id} card={card} />)
          )}
        </div>

          <Button
            variant="outline"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[var(--secondary-30)] bg-[var(--brand-15)] px-3 py-2 text-sm font-semibold text-secondary-primary transition-colors hover:border-[var(--secondary-100)] hover:bg-[var(--brand-30)] hover:text-[var(--secondary-100)] dark:border-[rgba(255,255,255,0.12)] dark:bg-[rgba(255,255,255,0.05)] dark:text-[var(--brand-15)]"
          >
          <i className="fa-solid fa-circle-plus" aria-hidden="true"></i>
          Add a card
        </Button>
      </div>
    </div>
  );
}
