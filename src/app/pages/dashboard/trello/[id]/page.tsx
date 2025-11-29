"use client";

import { useParams, useRouter } from "next/navigation";
import { useTrelloBoardWithData } from "../../../../hooks/useTrello";
import Button from "../../../../components/Atoms/Buttons";

export default function TrelloBoardPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const boardId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const { data, isLoading, isError, error } = useTrelloBoardWithData(boardId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Trello board...</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-500 to-pink-600 text-white p-6">
        <h1 className="text-3xl font-bold mb-4">Board Not Found</h1>
        <p className="text-white/80 mb-6">
          {error instanceof Error ? error.message : "Unable to load this Trello board."}
        </p>
        <Button variant="outline" onClick={() => router.push("/pages/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const { board, lists } = data;

  return (
    <div
      className="min-h-screen"
      style={{
        background: board.prefs?.backgroundColor
          ? `linear-gradient(135deg, ${board.prefs.backgroundColor}, ${board.prefs.backgroundColor}dd)`
          : "linear-gradient(135deg, #0079bf, #026aa7)",
      }}
    >
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/pages/dashboard")}
                className="!bg-white/10 !text-white !border-white/20 hover:!bg-white/20"
              >
                ← Back
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-white">{board.name}</h1>
                  <span className="px-2 py-1 text-xs bg-white/20 text-white rounded-md">
                    📋 Trello (Read-Only)
                  </span>
                </div>
                {board.desc && (
                  <p className="text-sm text-white/70 mt-1">{board.desc}</p>
                )}
              </div>
            </div>
            <a
              href={board.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors inline-flex items-center gap-2"
            >
              Edit on Trello
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      {/* Board Content */}
      <main className="p-8">
        {lists.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/70 text-lg">This board has no lists yet.</p>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {lists.map((list) => (
              <div
                key={list.id}
                className="flex-shrink-0 w-80 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20"
              >
                {/* List Header */}
                <div className="px-4 py-3 border-b border-white/10">
                  <h2 className="font-semibold text-white">{list.name}</h2>
                  <p className="text-xs text-white/60 mt-1">
                    {list.cards?.length || 0} cards
                  </p>
                </div>

                {/* Cards */}
                <div className="p-3 space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto">
                  {list.cards && list.cards.length > 0 ? (
                    list.cards.map((card) => (
                      <div
                        key={card.id}
                        className="bg-white dark:bg-neutral-800 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <h3 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                          {card.name}
                        </h3>
                        
                        {card.desc && (
                          <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2 line-clamp-3">
                            {card.desc}
                          </p>
                        )}

                        {/* Labels */}
                        {card.labels && card.labels.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {card.labels.map((label, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded text-xs text-white font-medium"
                                style={{
                                  backgroundColor: label.color || "#94a3b8",
                                }}
                              >
                                {label.name || "Label"}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Due Date */}
                        {card.due && (
                          <div className="flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-400">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Due: {new Date(card.due).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-white/50 text-sm py-4">
                      No cards in this list
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}