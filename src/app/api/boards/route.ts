import { NextResponse } from "next/server";
import { ObjectId, type Collection } from "mongodb";
import { authenticate } from "../_utils/auth";
import type {
  BoardSummary,
  CreateBoardPayload,
} from "../../interface/board";

export interface BoardCardDocument {
  id: string;
  title: string;
  description?: string;
  labels: string[];
  dueDate?: string | null;
  commentsCount?: number;
  attachmentsCount?: number;
}

export interface BoardListDocument {
  id: string;
  title: string;
  cards: BoardCardDocument[];
}

export interface BoardDocument {
  _id: ObjectId;
  ownerId: ObjectId;
  name: string;
  description?: string;
  color?: string;
  members: Array<{
    userId: string;
    fName: string;
    lName: string;
    email: string;
    role: "owner" | "admin" | "member";
  }>;
  lists: BoardListDocument[];
  createdAt: Date;
  updatedAt: Date;
}

const COLLECTION = "boards";

function toSummary(doc: BoardDocument): BoardSummary {
  const cardCount = doc.lists.reduce((total, list) => total + list.cards.length, 0);
  return {
    id: doc._id.toString(),
    name: doc.name,
    description: doc.description,
    color: doc.color,
    memberCount: doc.members.length,
    listCount: doc.lists.length,
    cardCount,
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export async function GET(req: Request) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) {
    return auth;
  }

  const { userObjectId, db } = auth;
  const boards = db.collection<BoardDocument>(COLLECTION);

  const docs = await boards
    .find({ ownerId: userObjectId })
    .sort({ updatedAt: -1 })
    .toArray();

  return NextResponse.json(docs.map(toSummary));
}

export async function POST(req: Request) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) {
    return auth;
  }

  const { user, userObjectId, db } = auth;
  const boards: Collection<BoardDocument> = db.collection(COLLECTION);

  let payload: CreateBoardPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (!payload?.name || typeof payload.name !== "string") {
    return NextResponse.json({ error: "Board name is required" }, { status: 400 });
  }

  const now = new Date();

  const board: Omit<BoardDocument, "_id"> = {
    ownerId: userObjectId,
    name: payload.name.trim(),
    description: payload.description?.trim() || undefined,
    color: payload.color?.trim() || undefined,
    members: [
      {
        userId: user.id,
        fName: user.fName,
        lName: user.lName,
        email: user.email,
        role: "owner",
      },
    ],
    lists: [],
    createdAt: now,
    updatedAt: now,
  };

  const result = await boards.insertOne(board as BoardDocument);
  const inserted = await boards.findOne({ _id: result.insertedId });

  if (!inserted) {
    return NextResponse.json({ error: "Failed to create board" }, { status: 500 });
  }

  return NextResponse.json(toSummary(inserted), { status: 201 });
}
