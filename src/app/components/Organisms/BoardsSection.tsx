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
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Your Boards</h2>
        <Button variant="primary" className="px-4" onClick={() => setIsFormOpen(true)}>
          <i className="fa-solid fa-plus" aria-hidden="true"></i>
          Create Board
        </Button>
      </div>

      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 space-y-4 rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-sm shadow-slate-200/60 backdrop-blur-sm dark:border-slate-700/70 dark:bg-slate-900/60"
        >
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Board name
            </label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-xl border border-slate-300/80 bg-white px-3 py-2 text-slate-900 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:focus:ring-blue-500/40"
              placeholder="e.g. Marketing Campaign"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Description
            </label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="w-full rounded-xl border border-slate-300/80 bg-white px-3 py-2 text-slate-900 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:focus:ring-blue-500/40"
              placeholder="What is this board about?"
              rows={3}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Accent color
            </label>
            <input
              type="color"
              value={color}
              onChange={(event) => setColor(event.target.value)}
              className="h-10 w-16 cursor-pointer rounded border border-slate-300/80 bg-white p-1 shadow-sm dark:border-slate-700 dark:bg-slate-900/60"
            />
          </div>
          {error && <p className="text-sm font-medium text-rose-600 dark:text-rose-400">{error}</p>}
          <div className="flex gap-3">
            <Button type="submit" variant="secondary" isLoading={isCreating}>
              <i className="fa-solid fa-floppy-disk" aria-hidden="true"></i>
              Save Board
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading && <p className="text-slate-500">Loading your boards...</p>}
        {!isLoading && errorMessage && (
          <p className="text-rose-500">{errorMessage}</p>
        )}
        {!isLoading && boards && boards.length === 0 && (
          <p className="text-slate-600 dark:text-slate-300">No boards yet. Create one to get started.</p>
        )}
        {boards?.map((board) => (
          <BoardSummaryCard key={board.id} board={board} />
        ))}
      </div>
    </section>
  );
}
