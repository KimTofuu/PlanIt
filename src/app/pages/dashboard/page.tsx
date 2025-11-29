"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { DashboardHeader } from "../../components/Organisms/DashboardHeader";
import { DashboardStats } from "../../components/Organisms/DashboardStats";
import { BoardsSection } from "../../components/Organisms/BoardsSection";
import { ActivityFeed } from "../../components/Organisms/ActivityFeed";
import { useAuth } from "../../hooks/useAuth";
import { useBoards } from "../../hooks/useBoards";

export default function Dashboard() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const { logout, user } = useAuth();
  const {
    boardsQuery,
    createBoard,
    createStatus,
  } = useBoards();

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } finally {
      router.push("/pages/sign-in");
      setLoggingOut(false);
    }
  };

  const totalBoards = boardsQuery.data?.length ?? 0;
  const totalCards = boardsQuery.data?.reduce((sum, board) => sum + board.cardCount, 0) ?? 0;

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
          <p className="text-neutral-600 dark:text-neutral-400">Here&apos;s what&apos;s happening with your projects today.</p>
        </section>

        <DashboardStats
          totalBoards={totalBoards}
          totalCards={totalCards}
          recentActivityCount={activityItems.length}
        />

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