"use client";

import { useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "./hooks/useAuth";
import { useBoards } from "./hooks/useBoards";
import { useTrelloBoards } from "./hooks/useTrello";
import toast from "react-hot-toast";
import Button from "./components/Atoms/Buttons";

const DashboardHeader = dynamic(
  () =>
    import("./components/Organisms/DashboardHeader").then((mod) => ({
      default: mod.DashboardHeader,
    })),
  {
    loading: () => (
      <div className="h-16 w-full animate-pulse border-b border-[var(--border)] bg-[var(--surface)]"></div>
    ),
  }
);

const DashboardStats = dynamic(
  () =>
    import("./components/Organisms/DashboardStats").then((mod) => ({
      default: mod.DashboardStats,
    })),
  {
    loading: () => (
      <div className="grid grid-cols-1 gap-6 animate-pulse md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)]"
          ></div>
        ))}
      </div>
    ),
  }
);

const AIChat = dynamic(
  () => import("./components/Organisms/AIChat"),
  {
    loading: () => (
      <div className="flex h-[420px] items-center justify-center rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]">
        <div className="text-center space-y-3">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-transparent border-t-[var(--brand-100)]"></div>
          <p className="text-sm text-[var(--foreground-muted)]">Loading AI Assistant…</p>
        </div>
      </div>
    ),
    ssr: false,
  }
);

const accentColors = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444"] as const;

type TabType = "ai-chat";

export default function Dashboard() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [showTrelloBoards, setShowTrelloBoards] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("ai-chat");
  const { logout, user } = useAuth();
  const { boardsQuery } = useBoards();

  const trelloBoardsQuery = useTrelloBoards({
    enabled: showTrelloBoards,
    staleTime: 5 * 60 * 1000,
  });

  const handleLogout = async () => {
    setLoggingOut(true);
    const toastId = toast.loading("Logging out...");
    try {
      await logout();
      toast.success("Logged out successfully", { id: toastId });
      router.push("/pages/sign-in");
    } catch (_error) {
      toast.error("Failed to logout", { id: toastId });
    } finally {
      setLoggingOut(false);
    }
  };

  const handleOpenTrelloBoard = (boardId: string) => {
    router.push(`/pages/dashboard/trello/${boardId}`);
  };

  const totalBoards = boardsQuery.data?.length ?? 0;
  const totalCards =
    boardsQuery.data?.reduce((sum, board) => sum + board.cardCount, 0) ?? 0;
  const totalTrelloBoards = trelloBoardsQuery.data?.length ?? 0;

  return (
    <div className="min-h-screen bg-[var(--background)] pb-16 text-[var(--foreground)] transition-colors duration-300">
      <Suspense
        fallback={
          <div className="h-16 w-full animate-pulse border-b border-[var(--border)] bg-[var(--surface)]"></div>
        }
      >
        <DashboardHeader
          userName={user ? user.fName : undefined}
          onLogout={handleLogout}
          isLoggingOut={loggingOut}
        />
      </Suspense>

      <main className="mx-auto flex max-w-7xl flex-col gap-12 px-4 pb-4 pt-12 sm:px-6 lg:px-8">
        <section className="grid gap-10 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow)] backdrop-blur-md transition-colors md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div className="space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full bg-[var(--semantic-azure)]/15 px-4 py-2 text-sm font-semibold text-[var(--semantic-azure)]">
              <i className="fa-solid fa-chart-line" aria-hidden="true"></i>
              Dashboard overview
            </span>
            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-[var(--foreground)] md:text-4xl">
              {user ? `Welcome back, ${user.fName}!` : "Welcome back to PlanIt!"}
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-[var(--foreground-muted)]">
              Check progress across your workspace, keep Trello in sync, and lean on the AI assistant for quick insights whenever you need them.
            </p>
            <div className="max-w-xl rounded-[var(--radius-sm)] border border-[var(--semantic-azure)]/25 bg-gradient-to-br from-[var(--semantic-azure)]/10 via-[var(--surface-alt)] to-[var(--semantic-emerald)]/10 p-4 text-sm text-[var(--foreground-muted)] shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--semantic-azure)]">
                Today&apos;s focus
              </p>
              <ul className="mt-3 space-y-2">
                <li className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--semantic-azure)]"></span>
                  Review project velocity
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--semantic-emerald)]"></span>
                  Capture Trello updates
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--semantic-amber)]"></span>
                  Sync with the AI assistant
                </li>
              </ul>
            </div>
          </div>
          <aside className="flex flex-col justify-between gap-6 rounded-[var(--radius-sm)] border border-[var(--semantic-azure)]/20 bg-gradient-to-br from-[var(--surface-alt)] via-[var(--surface)] to-[var(--semantic-azure)]/8 p-6 text-sm text-[var(--foreground-muted)] shadow-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--semantic-azure)]">
                Workspace pulse
              </p>
              <p className="mt-3 text-base font-medium text-[var(--foreground)]">
                {totalBoards > 0 ? `${totalBoards} boards active` : "No boards yet"}
              </p>
              <p className="mt-1 text-sm">
                Keep tasks grouped by priority and revisit the AI tab for tailored recommendations based on your latest activity.
              </p>
            </div>
            <div className="grid gap-3">
              <div className="flex items-start gap-3 rounded-[var(--radius-sm)] border-l-4 border-[var(--semantic-azure)] bg-[var(--semantic-azure)]/10 p-3 text-[var(--foreground-muted)] shadow-sm">
                <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--semantic-azure)]/20 text-[var(--semantic-azure)]">
                  <i className="fa-solid fa-layer-group" aria-hidden="true"></i>
                </span>
                <div>
                  <p className="text-sm font-semibold text-[var(--foreground)]">Boards</p>
                  <p className="text-xs">{totalBoards} total / {totalCards} cards</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-[var(--radius-sm)] border-l-4 border-[var(--semantic-amber)] bg-[var(--semantic-amber)]/12 p-3 text-[var(--foreground-muted)] shadow-sm">
                <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--semantic-amber)]/25 text-[var(--semantic-amber)]">
                  <i className="fa-brands fa-trello" aria-hidden="true"></i>
                </span>
                <div>
                  <p className="text-sm font-semibold text-[var(--foreground)]">Trello</p>
                  <p className="text-xs">{totalTrelloBoards} connected boards</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-[var(--radius-sm)] border-l-4 border-[var(--semantic-emerald)] bg-[var(--semantic-emerald)]/12 p-3 text-[var(--foreground-muted)] shadow-sm">
                <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--semantic-emerald)]/20 text-[var(--semantic-emerald)]">
                  <i className="fa-solid fa-robot" aria-hidden="true"></i>
                </span>
                <div>
                  <p className="text-sm font-semibold text-[var(--foreground)]">AI insights</p>
                  <p className="text-xs">Ready with quick summaries</p>
                </div>
              </div>
            </div>
          </aside>
        </section>

        <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)] transition-colors">
          <Suspense
            fallback={
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-32 animate-pulse rounded-[var(--radius-sm)] bg-[var(--surface-alt)]"
                  ></div>
                ))}
              </div>
            }
          >
            <DashboardStats
              totalBoards={totalBoards}
              totalCards={totalCards}
              trelloBoards={totalTrelloBoards}
            />
          </Suspense>
        </section>

        <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)] transition-colors">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="flex items-center gap-3 text-xl font-semibold text-[var(--foreground)]">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--brand-15)] text-[var(--brand-100)] shadow-sm">
                  <i className="fa-brands fa-trello" aria-hidden="true"></i>
                </span>
                Trello Integration
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-[var(--foreground-muted)]">
                Connect with Trello to explore existing boards and jump into detailed views without leaving PlanIt.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowTrelloBoards(!showTrelloBoards)}
                disabled={trelloBoardsQuery.isLoading}
                className="px-5 shadow-sm">
                <i className="fa-solid fa-table-list" aria-hidden="true"></i>
                {showTrelloBoards ? "Hide Trello Boards" : "Show Trello Boards"}
                <span className="text-xs font-semibold text-white/80">
                  ({totalTrelloBoards})
                </span>
              </Button>
            </div>
          </div>

          {showTrelloBoards && (
            <div className="mt-6 space-y-6">
              {trelloBoardsQuery.isLoading && (
                <div className="flex flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-alt)] p-10 text-center shadow-sm">
                  <i className="fa-solid fa-spinner fa-spin text-2xl text-[var(--brand-100)]" aria-hidden="true"></i>
                  <p className="text-sm text-[var(--foreground-muted)]">Loading Trello boards…</p>
                </div>
              )}

              {trelloBoardsQuery.isError && (
                <div className="rounded-[var(--radius-lg)] border border-rose-200/70 bg-rose-50/80 p-6 text-rose-700 shadow-sm dark:border-rose-800/50 dark:bg-rose-900/15 dark:text-rose-200">
                  <p>
                    Failed to load Trello boards. Check your API credentials in
                    <code className="mx-1 rounded bg-rose-100 px-1 py-0.5 text-xs font-semibold dark:bg-rose-900/40">.env.local</code>
                    and try again.
                  </p>
                </div>
              )}

              {trelloBoardsQuery.data && trelloBoardsQuery.data.length === 0 && (
                <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-alt)] p-10 text-center text-[var(--foreground-muted)] shadow-sm">
                  <p>No Trello boards found yet. Create a board in Trello to see it here.</p>
                </div>
              )}

              {trelloBoardsQuery.data && trelloBoardsQuery.data.length > 0 && (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {trelloBoardsQuery.data.map((board) => (
                    <div
                      key={board.id}
                      onClick={() => handleOpenTrelloBoard(board.id)}
                      className="group relative cursor-pointer overflow-hidden rounded-[var(--radius-sm)] border-2 border-[var(--brand-90)] bg-[var(--surface-alt)] p-5 shadow-[0_22px_48px_-32px_rgba(61,139,253,0.35)] transition-all duration-200 hover:-translate-y-2 hover:shadow-[0_26px_56px_-28px_rgba(61,139,253,0.45)]"
                    >
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--brand-100)]/10 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" aria-hidden="true"></div>
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-lg font-semibold text-[var(--foreground)]">
                            {board.name}
                          </h3>
                          {board.prefs?.backgroundColor && (
                            <span
                              className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/60 shadow-sm"
                              style={{ backgroundColor: board.prefs.backgroundColor }}
                              aria-label="Board accent color"
                            ></span>
                          )}
                        </div>

                        {board.desc && (
                          <p className="mt-3 line-clamp-3 text-sm text-[var(--foreground-muted)]">
                            {board.desc}
                          </p>
                        )}

                        <div className="mt-5 flex items-center justify-between text-sm text-[var(--foreground-muted)]">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenTrelloBoard(board.id);
                            }}
                            className="inline-flex items-center gap-2 font-semibold text-[var(--brand-100)] transition-colors hover:text-[var(--secondary-100)]"
                          >
                            <i className="fa-solid fa-up-right-from-square" aria-hidden="true"></i>
                            Open board
                          </button>
                          <a
                            href={board.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 transition-colors hover:text-[var(--foreground)]"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Trello
                            <i className="fa-solid fa-arrow-up-right-from-square text-xs" aria-hidden="true"></i>
                          </a>
                        </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] px-6 py-4 shadow-[var(--shadow)] transition-colors">
            <nav className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setActiveTab("ai-chat")}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  activeTab === "ai-chat"
                    ? "bg-[var(--brand-15)] text-[var(--brand-100)] shadow-sm"
                    : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                }`}
              >
                <i className="fa-solid fa-robot" aria-hidden="true"></i>
                AI Assistant
              </button>
            </nav>
          </div>

          <Suspense
            fallback={
              <div className="flex h-[420px] items-center justify-center rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]">
                <div className="space-y-3 text-center">
                  <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-transparent border-t-[var(--brand-100)]"></div>
                  <p className="text-sm text-[var(--foreground-muted)]">Loading AI Assistant…</p>
                </div>
              </div>
            }
          >
            {activeTab === "ai-chat" && <AIChat />}
          </Suspense>
        </section>
      </main>
    </div>
  );
}