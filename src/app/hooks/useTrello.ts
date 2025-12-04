import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { trelloService } from "../services/trelloService";

export function useTrelloBoards() {
  return useQuery({
    queryKey: ["trello-boards"],
    queryFn: () => trelloService.getBoards(),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  });
}

export function useTrelloBoard(boardId: string) {
  return useQuery({
    queryKey: ["trello-board", boardId],
    queryFn: () => trelloService.getBoard(boardId),
    enabled: !!boardId,
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

export function useTrelloLists(boardId: string) {
  return useQuery({
    queryKey: ["trello-lists", boardId],
    queryFn: () => trelloService.getLists(boardId),
    enabled: !!boardId,
  });
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