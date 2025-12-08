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
  const hasHexColor = typeof board.color === "string" && /^#([0-9a-fA-F]{6})$/.test(board.color);
  const style = board.color
    ? hasHexColor
      ? {
          background: `linear-gradient(135deg, ${board.color}1a, #ffffffcc)`,
          borderColor: `${board.color}40`,
        }
      : {
          background: `linear-gradient(135deg, ${board.color}, ${board.color})`,
        }
    : undefined;
  const usesCustomColor = Boolean(board.color);
  const titleClass = usesCustomColor ? "text-slate-900 dark:text-slate-100" : "text-white";
  const bodyTextClass = usesCustomColor ? "text-slate-600 dark:text-slate-300" : "text-white/80";
  const metaTextClass = usesCustomColor ? "text-slate-600 dark:text-slate-300" : "text-white";
  const iconWrapperClass = usesCustomColor
    ? "bg-white/70 text-slate-600 shadow-sm dark:bg-slate-800/70 dark:text-slate-300"
    : "bg-white/20 text-white";

  return (
    <Link
      href={`/pages/dashboard/board/${board.id}`}
      className={`group relative overflow-hidden rounded-3xl border border-[var(--secondary-15)] bg-white p-6 text-left shadow-[0_25px_50px_-30px_rgba(17,24,39,0.45)] transition-all hover:-translate-y-1 hover:shadow-[0_35px_65px_-35px_rgba(17,24,39,0.55)] dark:border-[rgba(255,255,255,0.08)] dark:bg-slate-900/80 ${
        board.color ? "" : `bg-gradient-to-br ${gradientClass} text-white`
      }`}
      style={style}
    >
      {!board.color && <div className="absolute inset-0 bg-slate-900/20 opacity-0 transition-opacity group-hover:opacity-10"></div>}
      <div className="relative flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className={`text-xl font-semibold ${titleClass}`}>
            {board.name}
          </h3>
          <span className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl shadow-inner ${iconWrapperClass}`}>
            <i className="fa-solid fa-diagram-project" aria-hidden="true"></i>
          </span>
        </div>
        {board.description && (
          <p className={`line-clamp-3 text-sm leading-relaxed ${bodyTextClass}`}>
            {board.description}
          </p>
        )}
        <div className={`flex flex-wrap items-center gap-4 text-sm font-medium ${metaTextClass}`}>
          <span className="inline-flex items-center gap-1">
            <i className="fa-solid fa-layer-group" aria-hidden="true"></i>
            {board.listCount} lists
          </span>
          <span className="inline-flex items-center gap-1">
            <i className="fa-regular fa-note-sticky" aria-hidden="true"></i>
            {board.cardCount} cards
          </span>
          <span className="inline-flex items-center gap-1">
            <i className="fa-regular fa-user" aria-hidden="true"></i>
            {board.memberCount} members
          </span>
        </div>
      </div>
    </Link>
  );
}
