import { useQuery, useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { TrelloBoard, TrelloCard, TrelloList } from "../interface/trello";
import { trelloService } from "../services/trelloService";

const TRELLO_API_KEY = process.env.NEXT_PUBLIC_TRELLO_API_KEY;
const TRELLO_TOKEN = process.env.NEXT_PUBLIC_TRELLO_TOKEN;

export function useTrelloBoards(
  options?: Omit<UseQueryOptions<TrelloBoard[]>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: ["trello", "boards"],
    queryFn: async () => {
      const response = await fetch(
        `https://api.trello.com/1/members/me/boards?key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch Trello boards");
      }

      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
    ...options,
  });
}

export function useTrelloBoardWithData(boardId: string) {
  return useQuery({
    queryKey: ["trello-board-full", boardId],
    queryFn: () => trelloService.getBoardWithListsAndCards(boardId),
    enabled: !!boardId,
    staleTime: 60_000,
    refetchInterval: 5_000,
    refetchOnWindowFocus: true,
  });
}

export function useTrelloBoard(
  boardId: string | null,
  options?: Omit<UseQueryOptions<TrelloBoard>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: ["trello", "board", boardId],
    queryFn: async () => {
      if (!boardId) throw new Error("Board ID is required");

      const response = await fetch(
        `https://api.trello.com/1/boards/${boardId}?lists=open&cards=visible&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch board details");
      }

      return response.json();
    },
    enabled: !!boardId,
    staleTime: 3 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    ...options,
  });
}

export function useTrelloLists(
  boardId: string | null,
  options?: Omit<UseQueryOptions<TrelloList[]>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: ["trello", "lists", boardId],
    queryFn: async () => {
      if (!boardId) throw new Error("Board ID is required");

      const response = await fetch(
        `https://api.trello.com/1/boards/${boardId}/lists?key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch lists");
      }

      return response.json();
    },
    enabled: !!boardId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    ...options,
  });
}

export function useTrelloCards(
  listId: string | null,
  options?: Omit<UseQueryOptions<TrelloCard[]>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: ["trello", "cards", listId],
    queryFn: async () => {
      if (!listId) throw new Error("List ID is required");

      const response = await fetch(
        `https://api.trello.com/1/lists/${listId}/cards?key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch cards");
      }

      return response.json();
    },
    enabled: !!listId,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
    ...options,
  });
}

export function usePrefetchTrelloBoard() {
  const queryClient = useQueryClient();

  return (boardId: string) => {
    queryClient.prefetchQuery({
      queryKey: ["trello", "board", boardId],
      queryFn: async () => {
        const response = await fetch(
          `https://api.trello.com/1/boards/${boardId}?lists=open&cards=visible&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`
        );
        return response.json();
      },
      staleTime: 3 * 60 * 1000,
    });
  };
}

export function useUpdateTrelloBoard(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: { name?: string; desc?: string; prefs_background?: string }) =>
      trelloService.updateBoard(boardId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trello-board", boardId] });
      queryClient.invalidateQueries({ queryKey: ["trello-board-full", boardId] });
      queryClient.invalidateQueries({ queryKey: ["trello-boards"] });
    },
  });
}

export function useUpdateTrelloCard(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cardId, updates }: {
      cardId: string;
      updates: { name?: string; desc?: string; due?: string | null; idList?: string };
    }) => trelloService.updateCard(cardId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trello-board-full", boardId] });
    },
  });
}

export function useCreateTrelloCard(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listId, card }: {
      listId: string;
      card: { name: string; desc?: string; due?: string };
    }) => trelloService.createCard(listId, card),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trello-board-full", boardId] });
    },
  });
}

export function useDeleteTrelloCard(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cardId: string) => trelloService.deleteCard(cardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trello-board-full", boardId] });
    },
  });
}

export function useMoveTrelloCard(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cardId, listId }: { cardId: string; listId: string }) =>
      trelloService.moveCard(cardId, listId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trello-board-full", boardId] });
    },
  });
}

export function useCreateTrelloList(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => trelloService.createList(boardId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trello-board-full", boardId] });
    },
  });
}

export function useUpdateTrelloList(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listId, name }: { listId: string; name: string }) =>
      trelloService.updateList(listId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trello-board-full", boardId] });
    },
  });
}