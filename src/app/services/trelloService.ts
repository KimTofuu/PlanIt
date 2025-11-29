const TRELLO_API_KEY = process.env.NEXT_PUBLIC_TRELLO_API_KEY;
const TRELLO_TOKEN = process.env.NEXT_PUBLIC_TRELLO_TOKEN;
const BASE_URL = "https://api.trello.com/1";

export interface TrelloBoard {
  id: string;
  name: string;
  desc: string;
  url: string;
  prefs: {
    backgroundColor?: string;
    backgroundImage?: string;
  };
  lists?: TrelloList[];
}

export interface TrelloList {
  id: string;
  name: string;
  cards?: TrelloCard[];
}

export interface TrelloCard {
  id: string;
  name: string;
  desc: string;
  due: string | null;
  labels: Array<{ name: string; color: string }>;
  idList: string;
}

export const trelloService = {
  // Get all boards for the authenticated user
  async getBoards(): Promise<TrelloBoard[]> {
    const response = await fetch(
      `${BASE_URL}/members/me/boards?key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch Trello boards");
    }
    return response.json();
  },

  // Get a specific board with lists and cards
  async getBoard(boardId: string): Promise<TrelloBoard> {
    const response = await fetch(
      `${BASE_URL}/boards/${boardId}?lists=open&cards=open&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch Trello board");
    }
    return response.json();
  },

  // Get lists for a board with their cards
  async getBoardWithListsAndCards(boardId: string): Promise<{
    board: TrelloBoard;
    lists: TrelloList[];
  }> {
    // Fetch board details
    const boardResponse = await fetch(
      `${BASE_URL}/boards/${boardId}?key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`
    );
    if (!boardResponse.ok) {
      throw new Error("Failed to fetch Trello board");
    }
    const board = await boardResponse.json();

    // Fetch lists with cards
    const listsResponse = await fetch(
      `${BASE_URL}/boards/${boardId}/lists?cards=open&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`
    );
    if (!listsResponse.ok) {
      throw new Error("Failed to fetch Trello lists");
    }
    const lists = await listsResponse.json();

    return { board, lists };
  },

  // Get lists for a board
  async getLists(boardId: string): Promise<TrelloList[]> {
    const response = await fetch(
      `${BASE_URL}/boards/${boardId}/lists?cards=open&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch Trello lists");
    }
    return response.json();
  },

  // Get cards for a list
  async getCards(listId: string): Promise<TrelloCard[]> {
    const response = await fetch(
      `${BASE_URL}/lists/${listId}/cards?key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch Trello cards");
    }
    return response.json();
  },
};