"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { BoardCanvas } from "../../../../components/Organisms/BoardCanvas";
import { BoardHeader } from "../../../../components/Organisms/BoardHeader";
import { useBoard } from "../../../../hooks/useBoards";

export default function BoardPage() {
  const params = useParams<{ id: string }>();
  const boardIdParam = params?.id;
  const boardId = Array.isArray(boardIdParam) ? boardIdParam[0] : boardIdParam;

  const { boardQuery } = useBoard(boardId);

  const gradientClass = useMemo(() => {
    if (!boardQuery.data?.color) {
      return "bg-gradient-to-br from-blue-500 to-purple-600";
    }
    return "";
  }, [boardQuery.data]);

  const gradientStyle = useMemo(() => {
    const color = boardQuery.data?.color;
    if (!color) return undefined;
    return { background: `linear-gradient(135deg, ${color}, ${color})` };
  }, [boardQuery.data]);

  if (boardQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Loading board...
      </div>
    );
  }

  if (boardQuery.isError || !boardQuery.data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6 text-center">
        <h1 className="text-2xl font-semibold mb-2">Board not available</h1>
        <p className="text-white/70">{boardQuery.error instanceof Error ? boardQuery.error.message : "Unable to load this board."}</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${gradientClass}`} style={gradientStyle}>
      <BoardHeader board={boardQuery.data} />
      <BoardCanvas board={boardQuery.data} />
    </div>
  );
}