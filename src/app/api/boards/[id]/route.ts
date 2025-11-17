import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { authenticate } from "../../_utils/auth";
import type {
  BoardCard,
  BoardDetail,
  BoardList,
  UpdateBoardPayload,
} from "../../../interface/board";
import type {
  BoardCardDocument,
  BoardDocument,
  BoardListDocument,
} from "../route";

function toDetail(doc: BoardDocument): BoardDetail {
  const lists: BoardList[] = doc.lists.map((list: BoardListDocument) => ({
    id: list.id,
    title: list.title,
    cards: list.cards.map((card: BoardCardDocument) => ({
      id: card.id,
      title: card.title,
      description: card.description,
      labels: card.labels,
      dueDate: card.dueDate ?? null,
      commentsCount: card.commentsCount ?? 0,
      attachmentsCount: card.attachmentsCount ?? 0,
    } satisfies BoardCard)),
  }));

  const updatedAt = doc.updatedAt.toISOString();
  const createdAt = doc.createdAt.toISOString();
  const cardCount = lists.reduce((total, list) => total + list.cards.length, 0);

  return {
    id: doc._id.toString(),
    name: doc.name,
    description: doc.description,
    color: doc.color,
    memberCount: doc.members.length,
    listCount: doc.lists.length,
    cardCount,
    updatedAt,
    createdAt,
    members: doc.members.map((member: BoardDocument["members"][number]) => ({
      id: member.userId,
      fName: member.fName,
      lName: member.lName,
      email: member.email,
      role: member.role,
    })),
    lists,
  };
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) {
    return auth;
  }

  const { userObjectId, db } = auth;
  const id = params.id;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid board id" }, { status: 400 });
  }

  const boards = db.collection<BoardDocument>("boards");
  const board = await boards.findOne({ _id: new ObjectId(id), ownerId: userObjectId });

  if (!board) {
    return NextResponse.json({ error: "Board not found" }, { status: 404 });
  }

  return NextResponse.json(toDetail(board));
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) {
    return auth;
  }

  const { userObjectId, db } = auth;
  const id = params.id;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid board id" }, { status: 400 });
  }

  let payload: UpdateBoardPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const boards = db.collection<BoardDocument>("boards");
  const now = new Date();

  const update: Partial<BoardDocument> = {
    updatedAt: now,
  };

  if (payload.name !== undefined) {
    update.name = payload.name.trim();
  }

  if (payload.description !== undefined) {
    update.description = payload.description.trim() || undefined;
  }

  if (payload.color !== undefined) {
    update.color = payload.color.trim() || undefined;
  }

  await boards.updateOne(
    { _id: new ObjectId(id), ownerId: userObjectId },
    { $set: update }
  );

  const updated = await boards.findOne({ _id: new ObjectId(id), ownerId: userObjectId });

  if (!updated) {
    return NextResponse.json({ error: "Board not found" }, { status: 404 });
  }

  return NextResponse.json(toDetail(updated));
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) {
    return auth;
  }

  const { userObjectId, db } = auth;
  const id = params.id;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid board id" }, { status: 400 });
  }

  const boards = db.collection<BoardDocument>("boards");
  const result = await boards.deleteOne({ _id: new ObjectId(id), ownerId: userObjectId });

  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "Board not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
