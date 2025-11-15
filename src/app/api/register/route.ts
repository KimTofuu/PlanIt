import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { fName, lName, email, password } = await req.json();

    if (!fName || !lName || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "planit");
    const users = db.collection("users");

    // ensure unique email index (safe to call repeatedly)
    await users.createIndex({ email: 1 }, { unique: true });

    const existing = await users.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const result = await users.insertOne({
      fName,
      lName,
      email,
      password: hashed,
      createdAt: new Date(),
    });

    // Generate JWT token for auto-login
    const token = jwt.sign(
      { userId: result.insertedId.toString(), email },
      process.env.JWT_SECRET || "fallback-secret-change-in-production",
      { expiresIn: "7d" }
    );

    return NextResponse.json(
      {
        ok: true,
        token,
        user: {
          id: result.insertedId.toString(),
          fName,
          lName,
          email,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Register error:", err);
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}