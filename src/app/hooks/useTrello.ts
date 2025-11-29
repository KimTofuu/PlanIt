import { useQuery } from "@tanstack/react-query";
import { trelloService } from "../services/trelloService";

export function useTrelloBoards() {
  return useQuery({
    queryKey: ["trello-boards"],
    queryFn: () => trelloService.getBoards(),
    staleTime: 5 * 60 * 1000, // 5 minutes
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
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useTrelloLists(boardId: string) {
  return useQuery({
    queryKey: ["trello-lists", boardId],
    queryFn: () => trelloService.getLists(boardId),
    enabled: !!boardId,
  });
}