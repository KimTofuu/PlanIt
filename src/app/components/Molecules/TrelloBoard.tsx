import Link from "next/link";

interface TrelloBoardCardProps {
  board: {
    id: string;
    name: string;
    desc: string;
    url: string;
    prefs: {
      backgroundColor?: string;
    };
  };
  onImport?: () => void;
}

export function TrelloBoardCard({ board, onImport }: TrelloBoardCardProps) {
  return (
    <div
      className="rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-shadow"
      style={{
        background: board.prefs?.backgroundColor || "#0079bf",
      }}
    >
      <h3 className="text-xl font-semibold mb-2">{board.name}</h3>
      {board.desc && <p className="text-sm opacity-90 mb-4">{board.desc}</p>}
      
      <div className="flex gap-2">
        <a
          href={board.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs px-3 py-1 bg-white/20 rounded hover:bg-white/30 transition-colors"
        >
          View on Trello
        </a>
        {onImport && (
          <button
            onClick={onImport}
            className="text-xs px-3 py-1 bg-white/20 rounded hover:bg-white/30 transition-colors"
          >
            Import to PlanIt
          </button>
        )}
      </div>
    </div>
  );
}