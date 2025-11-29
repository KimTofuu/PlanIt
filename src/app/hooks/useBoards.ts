"use client";

import { useMemo } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import { boardService } from "../services/boardService";
import { useAuth } from "./useAuth";
import type {
  BoardDetail,
  BoardSummary,
  CreateBoardPayload,
  UpdateBoardPayload,
} from "../interface/board";

const BOARDS_QUERY_KEY = ["boards"] as const;

export interface UseBoardsResult {
  boardsQuery: UseQueryResult<BoardSummary[]>;
  createBoard: (payload: CreateBoardPayload) => Promise<BoardSummary>;
  createStatus: UseMutationResult<BoardSummary, Error, CreateBoardPayload>;
}

export function useBoards(): UseBoardsResult {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const boardsQuery = useQuery<BoardSummary[]>({
    queryKey: BOARDS_QUERY_KEY,
    queryFn: () => boardService.listBoards(token ?? ""),
    enabled: Boolean(token),
    staleTime: 60 * 1000,
  });

  const createStatus = useMutation<BoardSummary, Error, CreateBoardPayload>({
    mutationFn: (payload) => {
      if (!token) {
        return Promise.reject(new Error("You must be signed in to manage boards."));
      }
      return boardService.createBoard(payload, token);
    },
    onSuccess: (board) => {
      queryClient.setQueryData<BoardSummary[]>(BOARDS_QUERY_KEY, (existing) => {
        if (!existing) {
          return [board];
        }
        return [board, ...existing];
      });
    },
  });

  return {
    boardsQuery,
    createBoard: createStatus.mutateAsync,
    createStatus,
  };
}

const BOARD_DETAIL_KEY_PREFIX = "board";

export interface UseBoardResult {
  boardQuery: UseQueryResult<BoardDetail>;
  updateBoard: (payload: UpdateBoardPayload) => Promise<BoardDetail>;
  updateStatus: UseMutationResult<BoardDetail, Error, UpdateBoardPayload>;
  deleteBoard: () => Promise<void>;
  deleteStatus: UseMutationResult<{ ok: boolean }, Error, void>;
}

export function useBoard(boardId: string | undefined): UseBoardResult {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => [BOARD_DETAIL_KEY_PREFIX, boardId], [boardId]);

  const boardQuery = useQuery<BoardDetail>({
    queryKey,
    queryFn: () => {
      if (!token || !boardId) {
        throw new Error("Missing board context");
      }
      return boardService.getBoard(boardId, token);
    },
    enabled: Boolean(token && boardId),
    staleTime: 30 * 1000,
  });

  const updateStatus = useMutation<BoardDetail, Error, UpdateBoardPayload>({
    mutationFn: (payload) => {
      if (!token || !boardId) {
        return Promise.reject(new Error("Missing board context"));
      }
      return boardService.updateBoard(boardId, payload, token);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKey, updated);
      queryClient.setQueryData<BoardSummary[]>(BOARDS_QUERY_KEY, (current) => {
        if (!current) return current;
        return current.map((board) =>
          board.id === updated.id
            ? {
                ...board,
                name: updated.name,
                description: updated.description,
                color: updated.color,
                memberCount: updated.memberCount,
                listCount: updated.listCount,
                cardCount: updated.cardCount,
                updatedAt: updated.updatedAt,
              }
            : board
        );
      });
    },
  });

  const deleteStatus = useMutation<{ ok: boolean }, Error, void>({
    mutationFn: () => {
      if (!token || !boardId) {
        return Promise.reject(new Error("Missing board context"));
      }
      return boardService.deleteBoard(boardId, token);
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey });
      queryClient.setQueryData<BoardSummary[]>(BOARDS_QUERY_KEY, (current) =>
        current ? current.filter((board) => board.id !== boardId) : current
      );
    },
  });

  const deleteBoard = async () => {
    await deleteStatus.mutateAsync();
  };

  return {
    boardQuery,
    updateBoard: updateStatus.mutateAsync,
    updateStatus,
    deleteBoard,
    deleteStatus,
  };
}
