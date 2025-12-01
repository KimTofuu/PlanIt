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

  async updateBoard(boardId: string, updates: { name?: string; desc?: string; prefs_background?: string; prefs_backgroundImage?: string; }) {
    const params = new URLSearchParams({
      key: TRELLO_API_KEY!,
      token: TRELLO_TOKEN!,
    });

    if (updates.name) params.append("name", updates.name);
    if (updates.desc) params.append("desc", updates.desc);
    if (updates.prefs_background) params.append("prefs_background", updates.prefs_background);
    if (updates.prefs_backgroundImage) params.append("prefs_backgroundImage", updates.prefs_backgroundImage);

    const response = await fetch(`${BASE_URL}/boards/${boardId}?${params.toString()}`, {
      method: "PUT",
    });

    if (!response.ok) {
      throw new Error("Failed to update board");
    }
  },

  async updateCard(cardId: string, updates: { name?: string; desc?: string; due?: string | null; idList?: string; }) {
    const params = new URLSearchParams({
      key: TRELLO_API_KEY!,
      token: TRELLO_TOKEN!,
    });

    if (updates.name) params.append("name", updates.name);
    if (updates.desc) params.append("desc", updates.desc);
    if (updates.due) params.append("due", updates.due);
    if (updates.idList) params.append("idList", updates.idList);

    const response = await fetch(`${BASE_URL}/cards/${cardId}?${params.toString()}`, {
      method: "PUT",
    });

    if (!response.ok) {
      throw new Error("Failed to update card");
    }
    return response.json();
  },

  async moveCard(cardId: string, listId: string): Promise<TrelloCard> {
    return this.updateCard(cardId, { idList: listId });
  },

  async createCard(listId: string, card: {
    name: string;
    desc?: string;
    due?: string;
  }): Promise<TrelloCard> {
    const params = new URLSearchParams({
      key: TRELLO_API_KEY!,
      token: TRELLO_TOKEN!,
      idList: listId,
      name: card.name,
    });

    if (card.desc) params.append("desc", card.desc);
    if (card.due) params.append("due", card.due);

    const response = await fetch(
      `${BASE_URL}/cards?${params.toString()}`,
      { method: "POST" }
    );

    if (!response.ok) {
      throw new Error("Failed to create Trello card");
    }
    return response.json();
  },

  async deleteCard(cardId: string): Promise<void> {
    const response = await fetch(
      `${BASE_URL}/cards/${cardId}?key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`,
      { method: "DELETE" }
    );

    if (!response.ok) {
      throw new Error("Failed to delete Trello card");
    }
  },

  async createList(boardId: string, name: string): Promise<TrelloList> {
    const params = new URLSearchParams({
      key: TRELLO_API_KEY!,
      token: TRELLO_TOKEN!,
      name: name,
      idBoard: boardId,
    });

    const response = await fetch(
      `${BASE_URL}/lists?${params.toString()}`,
      { method: "POST" }
    );

    if (!response.ok) {
      throw new Error("Failed to create Trello list");
    }
    return response.json();
  },

  async updateList(listId: string, name: string): Promise<TrelloList> {
    const params = new URLSearchParams({
      key: TRELLO_API_KEY!,
      token: TRELLO_TOKEN!,
      name: name,
    });

    const response = await fetch(
      `${BASE_URL}/lists/${listId}?${params.toString()}`,
      { method: "PUT" }
    );

    if (!response.ok) {
      throw new Error("Failed to update Trello list");
    }
    return response.json();
  },

  async archiveList(listId: string): Promise<TrelloList> {
    const params = new URLSearchParams({
      key: TRELLO_API_KEY!,
      token: TRELLO_TOKEN!,
      closed: "true",
    });

    const response = await fetch(
      `${BASE_URL}/lists/${listId}/closed?${params.toString()}`,
      { method: "PUT" }
    );

    if (!response.ok) {
      throw new Error("Failed to archive Trello list");
    }
    return response.json();
  },
};

