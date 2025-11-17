import React from "react";
import { BoardColumn } from "./BoardColumn";
import type { BoardDetail } from "../../interface/board";

interface BoardCanvasProps {
  board: BoardDetail;
}

export function BoardCanvas({ board }: BoardCanvasProps) {
  return (
    <div className="p-6 overflow-x-auto">
      <div className="flex gap-4 min-w-max">
        {board.lists.length > 0 ? (
          board.lists.map((list) => <BoardColumn key={list.id} list={list} />)
        ) : (
          <div className="flex-shrink-0 w-80 bg-white/20 border border-dashed border-white/40 rounded-lg p-4 text-white/80">
            <p>No lists yet. Integrate board mutation hooks to start building workflows.</p>
          </div>
        )}
      </div>
    </div>
  );
}
