import Bytez from "bytez.js";
import { TrelloBoard } from "../interface/trello";
import { ChatMessage, ChatResponse } from "../interface/aiChat";

const BYTEZ_API_KEY = "cc31c3e9d4295cbfd62942b69109567b";
const TRELLO_API_KEY = process.env.NEXT_PUBLIC_TRELLO_API_KEY;
const TRELLO_TOKEN = process.env.NEXT_PUBLIC_TRELLO_TOKEN;

const sdk = new Bytez(BYTEZ_API_KEY);
const model = sdk.model("Qwen/Qwen3-0.6B");

export const bytezService = {
  /**
   * Fetch specific board details (lists and cards) only when needed
   */
  async fetchBoardDetails(boardId: string): Promise<any> {
    try {
      const response = await fetch(
        `https://api.trello.com/1/boards/${boardId}?lists=open&cards=visible&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`
      );

      if (!response.ok) return null;

      const board = await response.json();

      // Fetch cards for each list
      if (board.lists) {
        board.lists = await Promise.all(
          board.lists.map(async (list: any) => {
            const cardsResponse = await fetch(
              `https://api.trello.com/1/lists/${list.id}/cards?key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`
            );

            if (cardsResponse.ok) {
              list.cards = await cardsResponse.json();
            }

            return list;
          })
        );
      }

      return board;
    } catch (error) {
      console.error(`Error fetching board ${boardId}:`, error);
      return null;
    }
  },

  /**
   * Analyze user question and determine what data is needed
   */
  async analyzeAndFetchData(
    userMessage: string,
    boards: TrelloBoard[]
  ): Promise<{ context: string; needsDetails: boolean }> {
    const lowerMessage = userMessage.toLowerCase();

    // Keywords that indicate need for detailed data
    const detailKeywords = [
      "card",
      "task",
      "list",
      "due",
      "deadline",
      "label",
      "description",
      "status",
      "progress",
    ];

    const needsDetails = detailKeywords.some((keyword) =>
      lowerMessage.includes(keyword)
    );

    if (!needsDetails) {
      // Return basic board info only
      return {
        context: this.buildBasicBoardContext(boards),
        needsDetails: false,
      };
    }

    // Determine which boards need details
    const relevantBoards = boards.filter((board) =>
      lowerMessage.includes(board.name.toLowerCase())
    );

    // If no specific board mentioned, fetch details for all (or limit to first few)
    const boardsToFetch =
      relevantBoards.length > 0 ? relevantBoards : boards.slice(0, 3);

    // Fetch detailed data for relevant boards only
    const detailedBoards = await Promise.all(
      boardsToFetch.map(async (board) => {
        const details = await this.fetchBoardDetails(board.id);
        return details || board;
      })
    );

    return {
      context: this.buildDetailedBoardContext(detailedBoards),
      needsDetails: true,
    };
  },

  /**
   * Build basic context (just board names and IDs)
   */
  buildBasicBoardContext(boards: TrelloBoard[]): string {
    if (!boards || boards.length === 0) {
      return "No boards available.";
    }

    return boards
      .map(
        (board, idx) => `
${idx + 1}. "${board.name}"
   - ID: ${board.id}
   - Description: ${board.desc || "No description"}
   - URL: ${board.url}`
      )
      .join("\n");
  },

  /**
   * Build detailed context (lists and cards)
   */
  buildDetailedBoardContext(boards: any[]): string {
    if (!boards || boards.length === 0) {
      return "No boards available.";
    }

    return boards
      .map((board, idx) => {
        const totalLists = board.lists?.length || 0;
        const totalCards =
          board.lists?.reduce(
            (sum: number, list: any) => sum + (list.cards?.length || 0),
            0
          ) || 0;

        let boardInfo = `
Board ${idx + 1}: "${board.name}"
- ID: ${board.id}
- Total Lists: ${totalLists}
- Total Cards: ${totalCards}`;

        // Add list details
        if (board.lists && board.lists.length > 0) {
          boardInfo += `\n\nLists:`;
          board.lists.forEach((list: any, listIdx: number) => {
            boardInfo += `\n  ${listIdx + 1}. "${list.name}" (${
              list.cards?.length || 0
            } cards)`;

            // Add card details
            if (list.cards && list.cards.length > 0) {
              boardInfo += `\n     Cards:`;
              list.cards.forEach((card: any, cardIdx: number) => {
                boardInfo += `\n       ${cardIdx + 1}. "${card.name}"`;
                if (card.desc) boardInfo += ` - ${card.desc}`;
                if (card.due)
                  boardInfo += ` [Due: ${new Date(
                    card.due
                  ).toLocaleDateString()}]`;
                if (card.labels && card.labels.length > 0) {
                  boardInfo += ` [Labels: ${card.labels
                    .map((l: any) => l.name)
                    .join(", ")}]`;
                }
              });
            }
          });
        }

        return boardInfo;
      })
      .join("\n\n---\n");
  },

  async sendMessage(
    userMessage: string,
    boards: TrelloBoard[],
    conversationHistory: ChatMessage[] = []
  ): Promise<ChatResponse> {
    try {
      // Analyze question and fetch only needed data
      const { context, needsDetails } = await this.analyzeAndFetchData(
        userMessage,
        boards
      );

      const contextualMessage = `Context: You are PlanIt AI Assistant helping manage Trello boards.

Available Boards Data:
${context}

User Question: ${userMessage}

Please provide a helpful, concise response based on the board data above.${
        !needsDetails ? " (Note: Only basic board info is available)" : ""
      }`;

      const messages: ChatMessage[] = [
        ...conversationHistory,
        {
          role: "user",
          content: contextualMessage,
        },
      ];

      const response = await model.run(messages);

      let messageContent: string;

      if (response && typeof response === "object" && "output" in response) {
        const output = response.output;

        if (typeof output === "string") {
          messageContent = output;
        } else if (output && typeof output === "object") {
          if ("text" in output && typeof output.text === "string") {
            messageContent = output.text;
          } else if ("content" in output && typeof output.content === "string") {
            messageContent = output.content;
          } else if ("message" in output && typeof output.message === "string") {
            messageContent = output.message;
          } else {
            return {
              message: "",
              error: "Invalid output format from AI",
            };
          }
        } else {
          return {
            message: "",
            error: "Invalid output type from AI",
          };
        }
      } else if (typeof response === "string") {
        messageContent = response;
      } else {
        return {
          message: "",
          error: "Invalid response format from AI",
        };
      }

      // Remove <think> tags
      messageContent = messageContent
        .replace(/<think>[\s\S]*?<\/think>\s*/gi, "")
        .trim();

      return {
        message: messageContent,
      };
    } catch (err) {
      console.error("Bytez AI Error:", err);
      return {
        message: "",
        error: err instanceof Error ? err.message : "Unknown error occurred",
      };
    }
  },

  /**
   * Build detailed context string from all boards
   */
  buildBoardContext(boards: TrelloBoard[]): string {
    if (!boards || boards.length === 0) {
      return "No boards available.";
    }

    return boards
      .map((board, idx) => {
        const totalLists = board.lists?.length || 0;
        const totalCards =
          board.lists?.reduce(
            (sum, list) => sum + (list.cards?.length || 0),
            0
          ) || 0;

        let boardInfo = `
Board ${idx + 1}: "${board.name}"
- ID: ${board.id}
- Description: ${board.desc || "No description"}
- Total Lists: ${totalLists}
- Total Cards: ${totalCards}`;

        // Add list details
        if (board.lists && board.lists.length > 0) {
          boardInfo += `\n\nLists:`;
          board.lists.forEach((list, listIdx) => {
            boardInfo += `\n  ${listIdx + 1}. "${list.name}" (${
              list.cards?.length || 0
            } cards)`;

            // Add card details
            if (list.cards && list.cards.length > 0) {
              boardInfo += `\n     Cards:`;
              list.cards.forEach((card, cardIdx) => {
                boardInfo += `\n       ${cardIdx + 1}. "${card.name}"`;
                if (card.desc) boardInfo += ` - ${card.desc}`;
                if (card.due)
                  boardInfo += ` [Due: ${new Date(
                    card.due
                  ).toLocaleDateString()}]`;
                if (card.labels && card.labels.length > 0) {
                  boardInfo += ` [Labels: ${card.labels
                    .map((l) => l.name)
                    .join(", ")}]`;
                }
              });
            }
          });
        }

        return boardInfo;
      })
      .join("\n\n---\n");
  },

  /**
   * Generate quick insights about boards
   */
  generateInsights(boards: TrelloBoard[]): string {
    const totalBoards = boards.length;
    const totalCards = boards.reduce(
      (sum, board) =>
        sum +
        (board.lists?.reduce(
          (listSum, list) => listSum + (list.cards?.length || 0),
          0
        ) || 0),
      0
    );

    const upcomingDueDates = boards
      .flatMap(
        (board) => board.lists?.flatMap((list) => list.cards || []) || []
      )
      .filter((card) => card.due && new Date(card.due) > new Date())
      .sort((a, b) => new Date(a.due!).getTime() - new Date(b.due!).getTime())
      .slice(0, 5);

    return `
📊 Quick Insights:
- You have ${totalBoards} board(s) with ${totalCards} total card(s)
- Upcoming deadlines: ${
      upcomingDueDates.length > 0
        ? upcomingDueDates
            .map((c) => `${c.name} (${new Date(c.due!).toLocaleDateString()})`)
            .join(", ")
        : "None"
    }
`;
  },
};