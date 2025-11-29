"use server";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import clientPromise from "../../../lib/mongodb";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-in-production";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "planit");
    const users = db.collection("users");

    const user = await users.findOne({ email });
    if (!user || !user.password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const matches = await bcrypt.compare(password, user.password);
    if (!matches) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      ok: true,
      token,
      user: {
        id: user._id.toString(),
        fName: user.fName,
        lName: user.lName,
        email: user.email,
      },
    });
  } catch (err: unknown) {
    console.error("Login error:", err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
