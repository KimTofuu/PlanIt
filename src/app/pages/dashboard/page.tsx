"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { DashboardHeader } from "../../components/Organisms/DashboardHeader";
import { DashboardStats } from "../../components/Organisms/DashboardStats";
import { BoardsSection } from "../../components/Organisms/BoardsSection";
import { ActivityFeed } from "../../components/Organisms/ActivityFeed";
import { useAuth } from "../../hooks/useAuth";
import { useBoards } from "../../hooks/useBoards";
import { useTrelloBoards } from "../../hooks/useTrello";
import toast from "react-hot-toast";
import Button from "../../components/Atoms/Buttons";

export default function Dashboard() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [showTrelloBoards, setShowTrelloBoards] = useState(false);
  const { logout, user } = useAuth();
  const { boardsQuery, createBoard, createStatus } = useBoards();
  const trelloBoardsQuery = useTrelloBoards();

  const handleLogout = async () => {
    setLoggingOut(true);
    const toastId = toast.loading("Logging out...");
    try {
      await logout();
      toast.success("Logged out successfully", { id: toastId });
      router.push("/pages/sign-in");
    } catch (error) {
      toast.error("Failed to logout", { id: toastId });
    } finally {
      setLoggingOut(false);
    }
  };

  const handleImportFromTrello = async () => {
    const toastId = toast.loading("Importing boards from Trello...");
    try {
      if (!trelloBoardsQuery.data || trelloBoardsQuery.data.length === 0) {
        toast.error("No Trello boards found", { id: toastId });
        return;
      }

      let imported = 0;
      for (const trelloBoard of trelloBoardsQuery.data) {
        try {
          await createBoard({
            name: trelloBoard.name,
            description: trelloBoard.desc || undefined,
            color: trelloBoard.prefs?.backgroundColor || "#3b82f6",
          });
          imported++;
        } catch (err) {
          console.error(`Failed to import board: ${trelloBoard.name}`, err);
        }
      }

      if (imported > 0) {
        toast.success(`Successfully imported ${imported} board(s) from Trello!`, {
          id: toastId,
        });
      } else {
        toast.error("Failed to import any boards", { id: toastId });
      }
    } catch (error) {
      toast.error("Failed to import boards from Trello", { id: toastId });
    }
  };

  const handleOpenTrelloBoard = (boardId: string) => {
    router.push(`/pages/dashboard/trello/${boardId}`);
  };

  const totalBoards = boardsQuery.data?.length ?? 0;
  const totalCards =
    boardsQuery.data?.reduce((sum, board) => sum + board.cardCount, 0) ?? 0;
  const totalTrelloBoards = trelloBoardsQuery.data?.length ?? 0;

  const activityItems = useMemo(
    () => [
      {
        id: "1",
        actor: user ? `${user.fName} ${user.lName}` : "You",
        action: "created a new workspace",
        timestamp: "just now",
        accent: "bg-blue-500",
      },
      {
        id: "2",
        actor: "Team",
        action: "updated sprint goals",
        timestamp: "2 hours ago",
        accent: "bg-green-500",
      },
      {
        id: "3",
        actor: "Marketing",
        action: "launched onboarding campaign",
        timestamp: "1 day ago",
        accent: "bg-purple-500",
      },
    ],
    [user]
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      <DashboardHeader
        userName={user ? user.fName : undefined}
        onLogout={handleLogout}
        isLoggingOut={loggingOut}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            {user ? `Welcome back, ${user.fName}! 👋` : "Welcome back! 👋"}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Here&apos;s what&apos;s happening with your projects today.
          </p>
        </section>

        <DashboardStats
          totalBoards={totalBoards}
          totalCards={totalCards}
          recentActivityCount={activityItems.length}
        />

        {/* Trello Integration Section */}
        <section className="mb-8">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                  <span className="text-2xl">📋</span>
                  Trello Integration
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  Import your Trello boards to PlanIt
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowTrelloBoards(!showTrelloBoards)}
                  disabled={trelloBoardsQuery.isLoading}
                >
                  {showTrelloBoards ? "Hide" : "Show"} Trello Boards (
                  {totalTrelloBoards})
                </Button>
                <Button
                  variant="primary"
                  onClick={handleImportFromTrello}
                  isLoading={createStatus.isPending}
                  disabled={
                    !trelloBoardsQuery.data ||
                    trelloBoardsQuery.data.length === 0 ||
                    trelloBoardsQuery.isLoading
                  }
                >
                  Import All from Trello
                </Button>
              </div>
            </div>

            {showTrelloBoards && (
              <div className="mt-4">
                {trelloBoardsQuery.isLoading && (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="ml-3 text-neutral-500">
                      Loading Trello boards...
                    </p>
                  </div>
                )}

                {trelloBoardsQuery.isError && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-red-600 dark:text-red-400">
                      Failed to load Trello boards. Check your API credentials in
                      .env.local
                    </p>
                  </div>
                )}

                {trelloBoardsQuery.data && trelloBoardsQuery.data.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-neutral-600 dark:text-neutral-400">
                      No Trello boards found. Create some boards in Trello first.
                    </p>
                  </div>
                )}

                {trelloBoardsQuery.data && trelloBoardsQuery.data.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {trelloBoardsQuery.data.map((board) => (
                      <div
                        key={board.id}
                        onClick={() => handleOpenTrelloBoard(board.id)}
                        className="p-4 rounded-lg border-2 border-neutral-200 dark:border-neutral-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors cursor-pointer"
                        style={{
                          backgroundColor: board.prefs?.backgroundColor
                            ? `${board.prefs.backgroundColor}20`
                            : undefined,
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                            {board.name}
                          </h3>
                          {board.prefs?.backgroundColor && (
                            <div
                              className="w-4 h-4 rounded-full border border-neutral-300"
                              style={{
                                backgroundColor: board.prefs.backgroundColor,
                              }}
                            ></div>
                          )}
                        </div>

                        {board.desc && (
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2">
                            {board.desc}
                          </p>
                        )}

                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenTrelloBoard(board.id);
                            }}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            Open Board →
                          </button>
                          <a
                            href={board.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-neutral-600 dark:text-neutral-400 hover:underline inline-flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Trello
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        <BoardsSection
          boards={boardsQuery.data}
          isLoading={boardsQuery.isLoading}
          errorMessage={boardsQuery.error ? boardsQuery.error.message : null}
          onCreateBoard={createBoard}
          isCreating={createStatus.isPending}
        />

        <ActivityFeed items={activityItems} />
      </main>
    </div>
  );
}