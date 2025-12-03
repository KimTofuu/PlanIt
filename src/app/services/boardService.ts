import { request } from "./requestService";
import type {
  BoardDetail,
  BoardSummary,
  CreateBoardPayload,
  UpdateBoardPayload,
} from "../interface/board";

export const boardService = {
  async listBoards(token: string): Promise<BoardSummary[]> {
    return request<BoardSummary[]>("/api/boards", { token });
  },

  async createBoard(payload: CreateBoardPayload, token: string): Promise<BoardSummary> {
    return request<BoardSummary>("/api/boards", {
      method: "POST",
      body: payload,
      token,
    });
  },

  async getBoard(id: string, token: string): Promise<BoardDetail> {
    return request<BoardDetail>(`/api/boards/${id}`, { token });
  },

  async updateBoard(id: string, payload: UpdateBoardPayload, token: string): Promise<BoardDetail> {
    return request<BoardDetail>(`/api/boards/${id}`, {
      method: "PATCH",
      body: payload,
      token,
    });
  },

  async deleteBoard(id: string, token: string): Promise<{ ok: boolean }> {
    return request<{ ok: boolean }>(`/api/boards/${id}`, {
      method: "DELETE",
      token,
    });
  },
};
