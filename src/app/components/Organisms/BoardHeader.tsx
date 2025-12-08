import Link from "next/link";
import Button from "../Atoms/Buttons";
import type { BoardDetail } from "../../interface/board";

interface BoardHeaderProps {
  board: BoardDetail;
}

export function BoardHeader({ board }: BoardHeaderProps) {
  return (
    <header className="border-b border-white/15 bg-slate-900/70 backdrop-blur-lg">
      <div className="mx-auto flex max-w-full items-center justify-between px-4 py-4 text-white sm:px-6 lg:px-8">
        <div className="flex items-center gap-5">
          <Link
            href="/pages/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20"
          >
            <i className="fa-solid fa-arrow-left" aria-hidden="true"></i>
            Back
          </Link>
          <div>
            <h1 className="text-2xl font-semibold leading-tight">{board.name}</h1>
            {board.description && <p className="text-sm text-white/70">{board.description}</p>}
          </div>
          <button
            className="rounded-full bg-white/10 p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
            aria-label="Star this board"
          >
            <i className="fa-regular fa-star" aria-hidden="true"></i>
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex -space-x-3">
            {board.members.map((member) => (
              <div
                key={member.id}
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white/80 bg-white/20 text-xs font-semibold uppercase"
              >
                {`${member.fName?.[0] ?? ""}${member.lName?.[0] ?? ""}`.toUpperCase() || "?"}
              </div>
            ))}
          </div>
          <Button variant="outline" className="border-white/40 bg-white/15 text-white transition-colors hover:bg-white/25">
            <i className="fa-solid fa-user-plus" aria-hidden="true"></i>
            Invite
          </Button>
        </div>
      </div>
    </header>
  );
}
