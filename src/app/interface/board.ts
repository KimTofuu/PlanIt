export interface BoardMember {
  id: string;
  fName: string;
  lName: string;
  email: string;
  role: "owner" | "admin" | "member";
}

export interface BoardCard {
  id: string;
  title: string;
  description?: string;
  labels: string[];
  dueDate?: string | null;
  commentsCount?: number;
  attachmentsCount?: number;
}

export interface BoardList {
  id: string;
  title: string;
  cards: BoardCard[];
}

export interface BoardSummary {
  id: string;
  name: string;
  description?: string;
  color?: string;
  memberCount: number;
  listCount: number;
  cardCount: number;
  updatedAt: string;
}

export interface BoardDetail extends BoardSummary {
  members: BoardMember[];
  lists: BoardList[];
  createdAt: string;
}

export interface CreateBoardPayload {
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateBoardPayload {
  name?: string;
  description?: string;
  color?: string;
}
