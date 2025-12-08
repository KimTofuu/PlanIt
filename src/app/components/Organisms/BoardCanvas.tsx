import React from "react";
import { BoardColumn } from "./BoardColumn";
import type { BoardDetail } from "../../interface/board";

interface BoardCanvasProps {
  board: BoardDetail;
}

export function BoardCanvas({ board }: BoardCanvasProps) {
  return (
    <div className="overflow-x-auto p-6">
      <div className="flex min-w-max gap-5">
        {board.lists.length > 0 ? (
          board.lists.map((list) => <BoardColumn key={list.id} list={list} />)
        ) : (
          <div className="flex w-80 flex-shrink-0 flex-col gap-3 rounded-2xl border border-dashed border-white/40 bg-white/10 p-5 text-sm text-white/80">
            <i className="fa-regular fa-note-sticky text-lg" aria-hidden="true"></i>
            <p>No lists yet. Integrate board mutation hooks to start building workflows.</p>
          </div>
        )}
      </div>
    </div>
  );
}
