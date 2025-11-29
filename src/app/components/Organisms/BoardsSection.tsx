"use client";

import { useState } from "react";
import Button from "../Atoms/Buttons";
import { BoardSummaryCard } from "../Molecules/BoardSummaryCard";
import type { BoardSummary, CreateBoardPayload } from "../../interface/board";

interface BoardsSectionProps {
  boards?: BoardSummary[];
  isLoading: boolean;
  onCreateBoard: (payload: CreateBoardPayload) => Promise<BoardSummary>;
  isCreating: boolean;
  errorMessage?: string | null;
}

export function BoardsSection({ boards, isLoading, onCreateBoard, isCreating, errorMessage }: BoardsSectionProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#3b82f6");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name.trim()) {
      setError("Board name is required");
      return;
    }

    try {
      await onCreateBoard({ name: name.trim(), description: description.trim() || undefined, color });
      setName("");
      setDescription("");
      setColor("#3b82f6");
      setError(null);
      setIsFormOpen(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to create board";
      setError(message);
    }
  };

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Your Boards</h2>
        <Button variant="primary" className="px-4" onClick={() => setIsFormOpen(true)}>
          + Create Board
        </Button>
      </div>

      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 mb-6 space-y-3"
        >
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Board name
            </label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
              placeholder="e.g. Marketing Campaign"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
              placeholder="What is this board about?"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Accent color
            </label>
            <input
              type="color"
              value={color}
              onChange={(event) => setColor(event.target.value)}
              className="h-10 w-16 p-1 border border-neutral-300 dark:border-neutral-600 rounded"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-3">
            <Button type="submit" variant="primary" isLoading={isCreating}>
              Save Board
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading && <p className="text-neutral-500">Loading your boards...</p>}
        {!isLoading && errorMessage && (
          <p className="text-red-500">{errorMessage}</p>
        )}
        {!isLoading && boards && boards.length === 0 && (
          <p className="text-neutral-600 dark:text-neutral-400">No boards yet. Create one to get started.</p>
        )}
        {boards?.map((board) => (
          <BoardSummaryCard key={board.id} board={board} />
        ))}
      </div>
    </section>
  );
}
