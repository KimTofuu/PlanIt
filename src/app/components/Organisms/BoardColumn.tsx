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
      <div className="bg-gray-100 dark:bg-neutral-800 rounded-lg p-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-neutral-900 dark:text-neutral-100">
            {list.title}
            <span className="ml-2 text-sm text-neutral-500">{list.cards.length}</span>
          </h2>
          <button className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100">
            ⋯
          </button>
        </div>

        <div className="space-y-2 mb-2 min-h-[20px]">
          {list.cards.length === 0 ? (
            <div className="text-sm text-neutral-500 dark:text-neutral-400 italic">
              No cards yet
            </div>
          ) : (
            list.cards.map((card) => <BoardCardItem key={card.id} card={card} />)
          )}
        </div>

        <Button
          variant="outline"
          className="w-full justify-start text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 border-transparent"
        >
          + Add a card
        </Button>
      </div>
    </div>
  );
}
