import Link from "next/link";
import Button from "../Atoms/Buttons";
import type { BoardDetail } from "../../interface/board";

interface BoardHeaderProps {
  board: BoardDetail;
}

export function BoardHeader({ board }: BoardHeaderProps) {
  return (
    <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-4">
          <Link href="/pages/dashboard" className="text-white hover:bg-white/10 p-2 rounded-lg">
            ← Back
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{board.name}</h1>
            {board.description && <p className="text-white/70 text-sm">{board.description}</p>}
          </div>
          <button className="text-white/80 hover:text-white">⭐</button>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            {board.members.map((member) => (
              <div
                key={member.id}
                className="w-8 h-8 rounded-full bg-white/20 border-2 border-white flex items-center justify-center text-white text-sm font-semibold"
              >
                {`${member.fName?.[0] ?? ""}${member.lName?.[0] ?? ""}`.toUpperCase() || "?"}
              </div>
            ))}
          </div>
          <Button variant="outline" className="bg-white/20 hover:bg-white/30 border-white/40 text-white">
            + Invite
          </Button>
        </div>
      </div>
    </header>
  );
}
