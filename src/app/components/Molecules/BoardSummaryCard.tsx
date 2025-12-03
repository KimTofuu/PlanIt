import Link from "next/link";
import React from "react";
import type { BoardSummary } from "../../interface/board";

interface BoardSummaryCardProps {
  board: BoardSummary;
}

export function BoardSummaryCard({ board }: BoardSummaryCardProps) {
  const gradients = [
    "from-blue-500 to-blue-600",
    "from-purple-500 to-purple-600",
    "from-green-500 to-green-600",
    "from-orange-500 to-orange-600",
    "from-pink-500 to-pink-600",
  ];

  const gradientClass = gradients[board.id.length % gradients.length];
  const style = board.color
    ? {
        background: `linear-gradient(135deg, ${board.color}, ${board.color})`,
      }
    : undefined;

  return (
    <Link
      href={`/pages/dashboard/board/${board.id}`}
      className={`bg-gradient-to-br ${board.color ? "" : gradientClass} rounded-lg p-6 text-white hover:shadow-lg transition-shadow cursor-pointer`}
      style={style}
    >
      <h3 className="text-xl font-semibold mb-2">{board.name}</h3>
      {board.description && (
        <p className="text-white/70 text-sm mb-4 line-clamp-2">{board.description}</p>
      )}
      <div className="flex items-center justify-between text-sm text-white/80">
        <span>{board.cardCount} cards · {board.listCount} lists</span>
        <span>{board.memberCount} members</span>
      </div>
    </Link>
  );
}
