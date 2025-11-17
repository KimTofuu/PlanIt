import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { ObjectId, type Db } from "mongodb";
import clientPromise from "../../../lib/mongodb";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-in-production";
const DB_NAME = process.env.MONGODB_DB || "planit";

interface UserRecord {
  _id: ObjectId;
  fName: string;
  lName: string;
  email: string;
}

export interface AuthContext {
  user: {
    id: string;
    fName: string;
    lName: string;
    email: string;
  };
  userObjectId: ObjectId;
  db: Db;
}

export async function authenticate(req: Request): Promise<AuthContext | NextResponse> {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: jwt.JwtPayload;
  try {
    payload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const userId = payload.userId;
  if (!userId) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const client = await clientPromise;
  const db: Db = client.db(DB_NAME);
  const users = db.collection<UserRecord>("users");
  const userDoc = await users.findOne({ _id: new ObjectId(userId) }, { projection: { password: 0 } });

  if (!userDoc) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return {
    user: {
      id: userDoc._id.toString(),
      fName: userDoc.fName,
      lName: userDoc.lName,
      email: userDoc.email,
    },
    userObjectId: userDoc._id,
    db,
  };
}
